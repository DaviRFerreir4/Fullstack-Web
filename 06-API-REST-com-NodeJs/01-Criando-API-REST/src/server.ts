import express from 'express'
import myMiddleware from './middlewares/my-middleware.js'

const PORT = 3333

const app = express()

app.use(express.json())

// GET simples e utilizando um middleware local em uma rota específica
app.get('/', myMiddleware, (request, response) => {
  response.send('Hello World Express')
})

// GET com parâmetros nomeados (route params)
app.get('/products/:id', (request, response) => {
  const { id } = request.params

  response.send(`Hello World Express. Seu ID é ${id}`)
})

// Middleware global (precisa vir antes das rotas, senão será ignorado, como na rota acima)
app.use(myMiddleware)

app.get('/products/:id/:user', (request, response) => {
  const { id, user } = request.params

  response.send(`Hello World Express. Seu ID é ${id} e seu usuário é ${user}`)
})

// GET com parâmetros não nomeados (query params)
app.get('/products', (request, response) => {
  const { page, limit } = request.query

  if (page && limit) {
    response.send(`Página ${page} de ${limit}`)
  }

  response.send('Listando produtos...')
})

// Recuperando dados do corpo da requisição POST
app.post('/products', (request, response) => {
  const { name, price } = request.body

  // response.send(`Produto ${name} custa $${price}`)
  response.status(201).json({
    name,
    price,
  })
})

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
