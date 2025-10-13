import http from 'node:http'

const products = [
  { id: 1, name: 'Camiseta', price: 60.59 },
  { id: 2, name: 'Shorts', price: 54.69 },
  { id: 3, name: 'Tênis', price: 149.99 },
]

const app = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/products') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(products))
  }
})

export { app }
