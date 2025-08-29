import http from "node:http"
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js"

const server = http.createServer(async (request, response) => {
  // Identificando o método HTTP
  const { method } = request
  return response.end("Método: " + method)
})

server.listen(3333)
