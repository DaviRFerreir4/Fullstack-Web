import http from "node:http"
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js"

const server = http.createServer(async (request, response) => {
  // Utilizando Status Code
  const { method } = request
  return response.writeHead(200).end("Método: " + method)
})

server.listen(3333)
