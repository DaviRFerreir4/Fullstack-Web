import express from 'express'

const PORT = 3333

const app = express()

// GET simples
app.get('/', (request, response) => {
  response.send('Hello World Express')
})

// GET com parâmetros nomeados (route params)
app.get('/products/:id', (request, response) => {
  const { id } = request.params

  response.send(`Hello World Express. Seu ID é ${id}`)
})

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

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
