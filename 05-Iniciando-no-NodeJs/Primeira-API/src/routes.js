// Salvando dados em memória
import { parseRoutePath } from './utils/parseRoutePaths.js'
export const routes = [
  {
    method: 'GET',
    path: '/products',
    controller: ({ request, response, database }) => {
      const products = database.select()
      return JSON.stringify(products)
      // if (Object.keys(request.query).length !== 0) {
      //   return response.end(JSON.stringify(request.query))
      // }
      // return response.end('Lista de produtos: ...')
    },
  },
  {
    method: 'POST',
    path: '/products',
    controller: ({ request, response, database }) => {
      const { name, price } = request.body
      database.insert('products', { name, price })
      return response.writeHead(201).end()
    },
  },
  {
    method: 'DELETE',
    path: '/products/:id',
    controller: ({ request, response }) => {
      return response.end('Produto removido com o ID: ' + request.params.id)
    },
  },
].map((route) => ({
  ...route,
  path: parseRoutePath(route.path),
}))
