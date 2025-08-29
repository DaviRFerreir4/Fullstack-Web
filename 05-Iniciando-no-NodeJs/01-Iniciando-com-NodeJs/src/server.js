import http, { createServer } from "node:http"

const server = createServer((request, response) => {
  return response.end("Hello World")
})

server.listen(3333)
