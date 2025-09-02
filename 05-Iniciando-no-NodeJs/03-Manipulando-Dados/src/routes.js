// Salvando usuários em memória
import { parseRoutePath } from "./utils/parseRoutePaths.js"
export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: ({ request, response, database }) => {
      if (Object.keys(request.query).length !== 0) {
        return response.end(JSON.stringify(request.query))
      }
      const products = database.select("products")
      return response.end(JSON.stringify(products))
    },
  },
  {
    method: "POST",
    path: "/products",
    controller: ({ request, response, database }) => {
      const { name, price } = request.body
      database.insert("products", { name, price })
      return response.writeHead(201).end("Produto criado com sucesso!")
    },
  },
  {
    method: "DELETE",
    path: "/products/:id",
    controller: ({ request, response }) => {
      return response.end("Produto removido com o ID: " + request.params.id)
    },
  },
].map((route) => ({
  ...route,
  path: parseRoutePath(route.path),
}))
