const express = require("express")
const { McpServer } = require ("@modelcontextprotocol/sdk/server/mcp.js");
const  { SSEServerTransport } = require ("@modelcontextprotocol/sdk/server/sse.js");

// Server created 
const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  console.log(transports)
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

// app.get("/",(req,res)=>{
//   res.send(req.query)
// })

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId ;
 
  const transport = transports[sessionId];
  if (transport) {
    // send messsage to the server !! --> MCP 
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001);