# brightdata-spreadsheet-enrichment

<div align="center">
  <img src="data:image/png;base64,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" alt="Bright Data Logo" width="80"/>
  <p>Powered by <a href="https://brightdata.com">Bright Data</a></p>
</div>

## 🚀 Welcome to the Spreadsheet Enrichment Repository!

An end-to-end solution for building AI-enriched spreadsheets with real-time web access. The application combines [Bright Data's](https://brightdata.com/) advanced web scraping and search capabilities with AI foundation models to transform your business spreadsheets with intelligent web-sourced information.


## Features

With this application, you can:
- 📊 Enrich spreadsheet cells with AI-generated content backed by live web data
- 🧠 Entity extraction and data processing with advanced LLMs
- 🔄 Process entire columns in batch for efficient data enhancement
- 📑 Access source citations for all web-sourced information
- 📂 Export your enriched data as CSV files for further use
- 🔍 Deep research mode with comprehensive multi-source verification

Designed for ease of customization, you can extend this core implementation to:
- Integrate proprietary data sources
- Modify the agent architecture
- Configure different AI foundation models
- Perform advanced web scraping and data extraction using Bright Data's comprehensive toolkit

## Architecture Diagram
![Spreadsheet Demo](images/Architecture.png)

## Setup Instructions

#### API Keys:

This application requires API keys from the following services:
- [Bright Data API](https://brightdata.com/)
- [Google Gemini API](https://ai.google.dev/) (for LLM processing)
- [OpenRouter API](https://openrouter.ai/) (optional, for deep research mode)

#### Set up environment variables:

   a. Create a `.env` file in the project's root directory with your API keys:
   ```bash
   BRIGHT_DATA_API_TOKEN=<your Bright Data API token>
   WEB_UNLOCKER_ZONE=<your web unlocker zone (default: unblocker)>
   BROWSER_ZONE=<your scraping browser zone (default: scraping_browser)>
   GOOGLE_API_KEY=<your Google Gemini API key>
   OPENROUTER_API_KEY=<your OpenRouter API key (optional, for deep research)>
   ```

   b. Create a `.env.development` file in the `ui` directory with:
   ```bash
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   ```

### Backend Setup
#### Python Virtual Environment
1. Create a virtual environment and activate it:
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
python3.11 -m pip install -r requirements.txt
```

3. From the root of the project, run the backend server:
```bash
python app.py
```
#### Docker 

1. Alternatively, build and run the backend using Docker from the root of the project:
```bash
# Build the Docker image
docker build -t brightdata-spreadsheet .

# Run the container
docker run -p 8000:8000 --env-file .env brightdata-spreadsheet
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
4. Launch the app in your browser with http://localhost:5174/

## 📂 Repository Structure

This repository includes everything required to create a functional spreadsheet enrichment tool with web access:

### 📡 Backend ([`backend/`](./backend))
The core backend logic, powered by LangGraph and Bright Data MCP:
- [`graph.py`](./backend/graph.py) – Defines the agent architecture, state management, and processing nodes using Bright Data's web scraping capabilities.

### 🌐 Frontend ([`ui/`](./ui))
Interactive React frontend for dynamic user interactions and spreadsheet responses.

### Server
- [`app.py`](./app.py) – FastAPI server that handles API endpoints and orchestrates the enrichment pipeline.

## Tech Stack

- **Bright Data MCP**: Advanced web scraping and data collection through Model Context Protocol
- **LangGraph**: Agent workflow orchestration and state management
- **FastAPI**: High-performance API backend
- **React**: Interactive frontend interface
- **AI Models**: Intelligent data processing and extraction

## Research Modes

### Standard Mode
- Fast, efficient web search and data extraction
- Single-source verification
- Optimized for speed and basic enrichment tasks

### Deep Research Mode
- Multi-source verification across 3+ independent sources
- Authority prioritization: LinkedIn profiles, company pages, press releases
- Iterative refinement with 5-7 search iterations
- Advanced browser automation for complex sites
- Comprehensive fact-checking and validation

## API Endpoints

- `POST /api/enrich/batch`: Endpoint that handles batched agent execution and spreadsheet population.
- `GET /api/health`: Health check endpoint.

## Contributing

Feel free to submit issues and enhancement requests!

## 📞 Contact Us

Have questions, feedback, or looking to build a custom solution? We'd love to hear from you!

- Email our team directly for support and customization requests