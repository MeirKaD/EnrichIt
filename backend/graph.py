import asyncio
import logging
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, List
from dotenv import load_dotenv
from langgraph.graph import END, START, StateGraph
from mcp_use.client import MCPClient
from mcp_use.adapters.langchain_adapter import LangChainAdapter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str) -> str:
        pass


class GeminiProvider(LLMProvider):
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )

    async def generate(self, prompt: str) -> str:
        response = await self.model.ainvoke(prompt)
        return response.content.strip()

@dataclass
class EnrichmentContext:
    column_name: str
    target_value: str
    context_values: Dict[str, str]
    search_result: Dict = None
    answer: str = None


class EnrichmentPipeline:
    def __init__(self, llm_provider: LLMProvider, deep_research: bool = False):
        self.llm = llm_provider
        self.bright_data_client = None
        self.tools = None
        self.deep_research = deep_research

    async def initialize_bright_data(self):
        """Initialize Bright Data MCP client and tools"""
        if self.bright_data_client is None:
            bright_data_config = {
                "mcpServers": {
                    "Bright Data": {
                        "command": "npx",
                        "args": ["@brightdata/mcp"],
                        "env": {
                            "API_TOKEN": os.getenv("BRIGHT_DATA_API_TOKEN"),
                            "WEB_UNLOCKER_ZONE": os.getenv("WEB_UNLOCKER_ZONE", "unblocker"),
                            "BROWSER_ZONE": os.getenv("BROWSER_ZONE", "scraping_browser")
                        }
                    }
                }
            }
            
            self.bright_data_client = MCPClient.from_dict(bright_data_config)
            adapter = LangChainAdapter()
            self.tools = await adapter.create_tools(self.bright_data_client)

    async def search_bright_data(self, state: EnrichmentContext):
        """Run Bright Data search using MCP"""
        try:
            await self.initialize_bright_data()
            
            query = f"{state.column_name} of {state.target_value}"
            logger.info(f"Searching Bright Data with query: {query}")

            # Use the search_engine tool from Bright Data MCP
            search_tool = next((tool for tool in self.tools if "search" in tool.name.lower()), None)
            
            if search_tool:
                # Execute search using the tool
                search_result = await search_tool.ainvoke({"query": query})
                
                # Parse the result - Bright Data returns both markdown and JSON
                parsed_result = {
                    "results": []
                }
                
                # Extract content from search result
                if hasattr(search_result, 'content'):
                    content = search_result.content
                elif isinstance(search_result, str):
                    content = search_result
                else:
                    content = str(search_result)
                
                parsed_result["results"] = [{
                    "title": f"Search results for {state.target_value}",
                    "content": content,
                    "url": "https://brightdata.com/search-results"
                }]
                
                logger.info("Bright Data search completed")
                return {"search_result": parsed_result}
            else:
                raise Exception("Search tool not found in Bright Data MCP tools")
                
        except Exception as e:
            logger.error(f"Error in search_bright_data: {str(e)}")
            raise
    
    async def deep_search_bright_data(self, state: EnrichmentContext):
        """Run deep research using ReAct Agent with Kimi K2"""
        try:
            await self.initialize_bright_data()
            
            # Initialize Kimi K2 through OpenRouter
            kimi_llm = ChatOpenAI(
                openai_api_key=os.getenv("OPENROUTER_API_KEY"),
                openai_api_base="https://openrouter.ai/api/v1",
                model_name="moonshotai/kimi-k2"
            )
            
            # System prompt for comprehensive research
            system_prompt = f"""
            <research_prompt>
            You are a deep web research specialist designed to outperform surface-level search agents. Your mission: find precise, verified information about the <target_role>{state.column_name}</target_role> at <target_company>{state.target_value}</target_company>.
            <context>
            Additional context: {state.context_values}
            </context>
            <research_strategy>

            Multi-source verification: Cross-reference findings across 3+ independent sources
            Authority prioritization: LinkedIn profiles, company pages, press releases, SEC filings
            Depth over breadth: Use structured extractors and browser automation for complex sites
            Recency validation: Prioritize current information over outdated results
            Iterative refinement: Perform 5-7 search iterations, narrowing focus each time
            </research_strategy>

            <tools_priority>

            Direct scraping: Target company websites, exec pages, team directories
            Structured extractors (LinkedIn, company databases): Use second for reliable data
            Search engines: Final verification and gap-filling only
            Browser automation: For sites requiring complex navigation
            </tools_priority>

            <success_criteria>
            Find the specific individual currently holding the <target_role>{state.column_name}</target_role> position at <target_company>{state.target_value}</target_company> with:

            Full name and title
            Employment verification from 2+ sources
            Contact information when publicly available
            Recent activity/mentions confirming current role
            </success_criteria>

            <output_format>
            Provide factual, source-attributed results. If multiple candidates exist, rank by verification confidence.
            </output_format>
            </research_prompt>
            """
            
            # Create ReAct agent with Bright Data tools
            agent = create_react_agent(
                model=kimi_llm,
                tools=self.tools,
                prompt=system_prompt
            )
            
            # Execute comprehensive search
            query = f"Find comprehensive information about the {state.column_name} of {state.target_value}. Context: {state.context_values}"
            logger.info(f"Starting deep research with query: {query}")
            
            result = await agent.ainvoke({
                "messages": [("human", query)]
            })
            
            # Extract the final response
            final_response = result["messages"][-1].content
            
            parsed_result = {
                "results": [{
                    "title": f"Deep research results for {state.target_value}",
                    "content": final_response,
                    "url": "https://brightdata.com/deep-research-results"
                }]
            }
            
            logger.info("Deep research completed")
            return {"search_result": parsed_result}
            
        except Exception as e:
            logger.error(f"Error in deep_search_bright_data: {str(e)}")
            raise

    async def extract_minimal_answer(self, state: EnrichmentContext) -> Dict:
        """Use LLM to extract a minimal answer from Bright Data's results."""
        content = ""
        
        # Extract content from search results
        if state.search_result and "results" in state.search_result:
            result_contents = [
                result.get("content", "") for result in state.search_result["results"]
            ]
            content = "\n\n---\n\n".join(result_contents)
        
        try:
            prompt = f"""
            Extract the {state.column_name} of {state.target_value} from this search result:

            {content}

            Rules:
            1. Provide ONLY the direct answer - no explanations
            2. Be concise
            3. If information is not found, respond "Information not found"
            4. Do not provide citations or references
            Direct Answer:
            """
            logger.info(f"Extracting answer for {state.target_value}")

            answer = await self.llm.generate(prompt)
            logger.info(f"Extracted answer: {answer}")
            return {"answer": answer}
        except Exception as e:
            logger.error(f"Error in extract_minimal_answer: {str(e)}")
            return {"answer": "Information not found"}

    def build_graph(self):
        """Build and compile the graph"""
        graph = StateGraph(EnrichmentContext)
        
        if self.deep_research:
            graph.add_node("search", self.deep_search_bright_data)
        else:
            graph.add_node("search", self.search_bright_data)
        
        graph.add_node("extract", self.extract_minimal_answer)
        graph.add_edge(START, "search")
        graph.add_edge("search", "extract")
        graph.add_edge("extract", END)
        compiled_graph = graph.compile()
        return compiled_graph


async def enrich_cell_with_graph(
    column_name: str,
    target_value: str,
    context_values: Dict[str, str],
    llm_provider: LLMProvider,
    deep_research: bool = False,
) -> Dict:
    """Helper function to enrich a single cell using langgraph with Bright Data."""
    try:
        logger.info(f"Starting enrich_cell_with_graph for {target_value}")
        pipeline = EnrichmentPipeline(llm_provider, deep_research)
        initial_context = EnrichmentContext(
            column_name=column_name,
            target_value=target_value,
            context_values=context_values,
            search_result=None,
            answer=None,
        )
        graph = pipeline.build_graph()
        result = await graph.ainvoke(initial_context)
        logger.info(f"Completed enrich_cell_with_graph for {target_value}")
        logger.info(f"Result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in enrich_cell_with_graph: {str(e)}")
        return "Error during enrichment"


# Example usage:
if __name__ == "__main__":
    context = EnrichmentContext(
        column_name="AI Engineer",
        target_value="Bright Data",
        context_values={
            "Industry": "Data Collection",
            "Founded": "2014",
            "Location": "Israel",
        },
    )

    gemini_provider = GeminiProvider()

    result_helper = asyncio.run(
        enrich_cell_with_graph(
            column_name="AI Engineer",
            target_value="Bright Data",
            context_values={
                "Industry": "Data Collection",
                "Founded": "2014",
                "Location": "Israel",
            },
            llm_provider=gemini_provider,
            deep_research=True,  # Add this line to enable deep research
        )
    )