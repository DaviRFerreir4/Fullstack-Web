import http from "node:http"
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js"

const server = http.createServer(async (request, response) => {
  // Utilizando Middleware
  const { method, url } = request
  await jsonBodyHandler(request, response)
  if (method === "GET" && url === "/products") {
    return response.end("Lista de produtos: ...")
  }
  if (method === "POST" && url === "/products") {
    console.log(request.body)
    return response.writeHead(201).end(JSON.stringify(request.body)) // response.end precisa receber texto
  }
  return response.writeHead(404).end("Rota não encontrada!")
})

server.listen(3333)
