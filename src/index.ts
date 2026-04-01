    import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
    import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
    import { error } from "node:console";
    import { z } from "zod";

    const server = new McpServer({
    name: "my-first-mcp",
    version: "1.0.0",
    });

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

    async function main() {
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }

    main().catch((error) => {
        console.error("Error in main!:", error)
        process.exit(1);
    });


