// Separando rotas
import { routes } from "../routes.js"

export function routeHandler(request, response) {
  const route = routes.find((route) => {
    return route.method === request.method && route.path === request.url
  })
  if (route) {
    return route.controller(request, response)
  } else {
    return response.writeHead(404).end("Rota não encontrada!")
  }
}
