# 🤖 my-first-mcp — Model Context Protocol Server

A production-ready **MCP (Model Context Protocol) Server** built with Node.js and the Anthropic MCP SDK, deployed on **Cloudflare Workers**. This server exposes AI-callable tools and resources that allow LLM clients (Claude Desktop, GitHub Copilot, etc.) to perform real-time autonomous actions — fetching live data, running computations, and serving structured knowledge — without relying on static training data.

🔗 **Live Server:** `https://my-mcp-server.ishaans-official01.workers.dev`

---

## 📌 What is MCP?

**Model Context Protocol (MCP)** is an open standard developed by Anthropic that allows AI models to connect to external tools, APIs, and data sources in a structured, secure way. Think of it as a universal plugin system for AI — instead of hardcoding tool logic inside the model, MCP lets you define tools as standalone servers that any compatible AI client can call.

```
AI Client (Claude / Copilot)
        │
        │  MCP Protocol (stdio / HTTP / SSE)
        ▼
  MCP Server (this project)
        │
        ├── Tool: add-numbers
        ├── Tool: get_github_repos  ──► GitHub API (live)
        └── Resource: apartment-rules ──► Local JSON
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript |
| MCP SDK | `@modelcontextprotocol/sdk` |
| Schema Validation | Zod |
| Deployment | Cloudflare Workers |
| AI Clients Supported | Claude Desktop, GitHub Copilot (VS Code) |

---

## 🚀 Features

### 🔧 Tools

Tools are functions that AI agents can call in real time to perform actions or fetch live data.

#### 1. `add-numbers`
Adds two numbers together and returns the result.

**Input Schema:**
```json
{
  "a": "number — First number",
  "b": "number — Second number"
}
```

**Example Response:**
```
Total is 42
```

---

#### 2. `get_github_repos`
Fetches a user's public GitHub repositories in real time via the GitHub REST API. This demonstrates **live data fetching** — the AI doesn't rely on stale training data but makes an actual HTTP request at the moment it's called.

**Input Schema:**
```json
{
  "username": "string — GitHub username"
}
```

**Example Response:**
```
Github repositories for IshaanSensharma-official (12 repos):

1. ckd_project
2. resume_builder
3. myportfolio
...
```

---

### 📦 Resources

Resources are read-only data sources that AI clients can retrieve and reference during a conversation.

#### `apartment-rules` (`rules://all`)
Serves a structured JSON dataset of apartment rules including categories, titles, rules, and descriptions. AI clients can read this resource and answer tenant questions, summarise policies, or flag violations — acting as an autonomous property management copilot.

**Sample Data:**
```json
[
  {
    "id": 1,
    "category": "Noise",
    "title": "Quiet Hours",
    "rule": "Maintain quiet after 22:00 (10 PM) until 08:00 (8 AM)",
    "description": "Loud music, parties, or excessive noise during these hours may result in complaints and penalties."
  },
  ...
]
```

---

## 🗂️ Project Structure

```
my-first-mcp/
├── src/
│   ├── index.ts          # Main MCP server — tools & resources defined here
│   └── data/
│       └── rules.json    # Apartment rules knowledge base
├── build/
│   └── index.js          # Compiled output (auto-generated)
├── .vscode/
│   └── mcp.json          # VS Code MCP configuration
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/IshaanSensharma-official/my_mcp.git
cd my_mcp

# Install dependencies
npm install

# Install Node.js type definitions
npm install --save-dev @types/node
```

### Build & Run

```bash
# Compile TypeScript
npm run build

# The server runs via stdio — connect it through an MCP client
```

---

## 🔌 Connecting to AI Clients

### GitHub Copilot (VS Code)

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "my-first-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"]
    }
  }
}
```

Then: `Ctrl + Shift + P` → **MCP: Start Server** → `my-first-mcp`

---

### Claude Desktop

Add to `claude_desktop_config.json`:

**Local (stdio):**
```json
{
  "mcpServers": {
    "my-first-mcp": {
      "command": "node",
      "args": ["C:\\path\\to\\my_mcp\\build\\index.js"]
    }
  }
}
```

**Cloud (HTTP — Cloudflare Workers):**
```json
{
  "mcpServers": {
    "my-first-mcp-cloud": {
      "type": "http",
      "url": "https://my-mcp-server.ishaans-official01.workers.dev"
    }
  }
}
```

---

## ☁️ Deployment (Cloudflare Workers)

This server is deployed as a globally distributed edge function on Cloudflare Workers, making it accessible over HTTP/SSE from any MCP-compatible client without needing to run a local process.

```bash
# Deploy to Cloudflare
npm run deploy
```

**Live endpoint:** `https://my-mcp-server.ishaans-official01.workers.dev`

---

## 💡 How It Enables Autonomous AI Workflows

Traditional AI models are limited to their training data. This MCP server breaks that limitation by:

1. **Real-time data fetching** — `get_github_repos` makes live API calls at inference time, so the AI always has current information.
2. **Structured knowledge serving** — The `apartment-rules` resource gives the AI a grounded, factual knowledge base to reason over, reducing hallucination.
3. **Tool composition** — AI agents can chain multiple tool calls together to complete complex multi-step tasks autonomously.
4. **Client-agnostic** — Works with any MCP-compatible client (Claude, Copilot, custom agents) without modification.

---

## 📄 License

MIT

---

## 👤 Author

**Ishaan Sensharma**  
B.Tech CSE (AI/ML) — NIIT University  
GitHub: [@IshaanSensharma-official](https://github.com/IshaanSensharma-official)
