import http from "node:http"
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js"

const server = http.createServer(async (request, response) => {
  // URL da requisição
  const { method, url } = request
  // return response.writeHead(200).end("URL: " + url)
  if (method === "GET" && url === "/products") {
    return response.end("Lista de produtos: ...")
  }
  if (method === "POST" && url === "/products") {
    return response.writeHead(201).end("Produto cadastrado com sucesso!")
  }
  return response.writeHead(404).end("Rota não encontrada!")
})

server.listen(3333)
