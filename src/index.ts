    import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
    import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
    import { z } from "zod";
    import * as fs from "fs/promises";
    import * as path from "path";
    import { fileURLToPath } from "node:url";

    // Initialize the server
    const server = new McpServer({
    name: "my-first-mcp",
    version: "1.0.0",
    });

    // Tool 1: Add Numbers
    server.tool(
    "add-numbers",
    "Add two numbers",
    {
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    },
    ({ a, b }) => {
        return {
        content: [{ type: "text", text: `Total is ${a + b}` }],
        };
    }
    );

    // Tool 2: Get GitHub Repos
    server.tool(
    "get_github_repos",
    "Get GitHub repositories from the given username",
    {
        username: z.string().describe("Github username"),
    },
    async ({ username }) => {
        const res = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { "User-Agent": "MCP-Server" },
        });

        if (!res.ok) throw new Error("Github API error");

        const repos = await res.json();

        const repoList = repos
        .map((repo: any, i: number) => `${i + 1}. ${repo.name}`)
        .join("\n\n");

        return {
        content: [
            {
            type: "text",
            text: `Github repositories for ${username} (${repos.length} repos):\n\n${repoList}`,
            },
        ],
        };
    }
    );

    // Resource: Apartment Rules
    server.resource(
    "apartment-rules",
    "rules://all",
    async (uri) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const rulesRaw = await fs.readFile(
        path.resolve(__dirname, "../src/data/vertopal.com_rules.json"),
        "utf-8"
        );

        return {
        contents: [
            {
            uri: uri.href,
            text: rulesRaw,
            mimeType: "application/json",
            },
        ],
        };
    }
    );


    server.prompt("explain-sql", "Explain the given SQL query",{
        sql:z.string().describe("The SQL query to explain")
    }, ({sql})=>{
        return{
            messages:[
                {
                    role:"user",
                    content:{
                        type:"text",
                        text:`Give a detailed explanation of the following SQL query in plain English: ${sql} Make it very detailed and specific for a beginner to understand`
                    },
                },
            ],
        };
    }
);
    
    // Start server
    async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    }

    main().catch((error) => {
    console.error("Error in main!:", error);
    process.exit(1);
    });