import asyncio
import logging
import os
import sys
import time
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.graph import GeminiProvider, enrich_cell_with_graph

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

load_dotenv()

# Initialize API keys from environment
gemini_api_key = os.getenv("GOOGLE_API_KEY")
brightdata_api_key = os.getenv("BRIGHT_DATA_API_TOKEN")

app = FastAPI(
    title="Data Enrichment API",
    description="API for enriching spreadsheet data using Bright Data and AI models",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchResult(BaseModel):
    title: str
    url: str


class BatchEnrichmentRequest(BaseModel):
    column_name: str
    rows: List[str] 
    context_values: Dict[str, str]
    deep_research: bool = False
    answer: str = None
    search_result: str = None


class BatchEnrichmentResponse(BaseModel):
    enriched_values: List[str]
    status: str
    error: Optional[str] = None
    sources: List[List[SearchResult]] = []


def init_clients():
    """Initialize all clients that have valid API keys"""
    # Check for required API keys
    if not brightdata_api_key:
        raise ValueError("Bright Data API key is required")
    
    if not gemini_api_key:
        raise ValueError("Gemini API key is required")
    
    gemini_provider = GeminiProvider()
    return gemini_provider


gemini_provider = init_clients()

# Rest of your code remains the same...
@app.post("/api/enrich/batch", response_model=BatchEnrichmentResponse)
async def enrich_batch(request: BatchEnrichmentRequest):
    """Enrich multiple rows in parallel."""
    start_time = time.time()
    try:

        logger.info(f"Starting batch enrichment for column: {request.column_name}")
        logger.info(f"Number of rows to process: {len(request.rows)}")
        logger.info(f"Deep research enabled: {request.deep_research}")

        # Process each row
        tasks = []
        for row in request.rows:
            if row.strip():
                task = enrich_cell_with_graph(
                    column_name=request.column_name,
                    target_value=row,
                    context_values=request.context_values,
                    llm_provider=gemini_provider,
                    deep_research=request.deep_research
                )
                tasks.append(task)

        # Measure the time for the enrichment operations
        enrich_start_time = time.time()
        enriched_values = (
            await asyncio.gather(*tasks, return_exceptions=True) if tasks else []
        )
        enrich_time = time.time() - enrich_start_time

        # Process results and fill empty rows
        final_values = []
        all_sources = []
        processed_idx = 0

        for row in request.rows:
            if not row.strip():
                final_values.append("")
                all_sources.append([])
            else:
                value = enriched_values[processed_idx]
                sources = []

                if isinstance(value, dict) and "search_result" in value:
                    for result in value["search_result"]["results"]:
                        sources.append(
                            SearchResult(title=result["title"], url=result["url"])
                        )
                    final_values.append(value.get("answer", str(value)))
                elif isinstance(value, Exception):
                    final_values.append("Error during enrichment")
                else:
                    final_values.append(str(value))

                all_sources.append(sources)
                processed_idx += 1

        total_time = time.time() - start_time
        avg_time_per_row = enrich_time / len(tasks) if tasks else 0
        logger.info(
            f"Batch enrichment completed in {enrich_time:.2f}s (total request: {total_time:.2f}s)"
        )
        logger.info(f"Average time per row: {avg_time_per_row:.2f}s")

        print(
            BatchEnrichmentResponse(
                enriched_values=final_values, status="success", sources=all_sources
            )
        )
        return BatchEnrichmentResponse(
            enriched_values=final_values, status="success", sources=all_sources
        )

    except ValueError as e:
        logger.error(f"Invalid provider configuration: {str(e)}")
        total_time = time.time() - start_time
        logger.info(f"Request failed in {total_time:.2f}s")
        return BatchEnrichmentResponse(
            enriched_values=["Provider configuration error"] * len(request.rows),
            status="error",
            error=str(e),
        )
    except Exception as e:
        logger.error(f"Error in batch enrichment: {str(e)}")
        total_time = time.time() - start_time
        logger.info(f"Request failed in {total_time:.2f}s")
        return BatchEnrichmentResponse(
            enriched_values=["Error during enrichment"] * len(request.rows),
            status="error",
            error=str(e),
            sources=[[] for _ in request.rows],
        )


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
