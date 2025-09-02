// Obtendo parâmetros nomeados e separando eles
import { parseRoutePath } from "./utils/parseRoutePaths.js"
export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: (request, response) => {
      if (Object.keys(request.query).length !== 0) {
        return response.end(JSON.stringify(request.query))
      }
      return response.end("Lista de produtos: ...")
    },
  },
  {
    method: "POST",
    path: "/products",
    controller: (request, response) => {
      return response.writeHead(201).end(JSON.stringify(request.body))
    },
  },
  {
    method: "DELETE",
    path: "/products/:id",
    controller: (request, response) => {
      return response.end("Produto removido com o ID: " + request.params.id)
    },
  },
].map((route) => ({
  ...route,
  path: parseRoutePath(route.path),
}))
