import express from 'express'

const PORT = 3333

const app = express()

// GET simples
app.get('/', (request, response) => {
  response.send('Hello World Express')
})

// GET com parâmetros nomeados
app.get('/products/:id', (request, response) => {
  const { id } = request.params

  response.send(`Hello World Express. Your ID is ${id}`)
})

app.get('/products/:id/:user', (request, response) => {
  const { id, user } = request.params

  response.send(
    `Hello World Express. Your ID is ${id} and your user is ${user}`
  )
})

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
