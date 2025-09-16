import express from 'express'
import { routes } from './routes/index.js'

const PORT = 3333

const app = express()

app.use(express.json())

// Middleware global (precisa vir antes das rotas, senão será ignorado, como na rota acima)
// app.use(myMiddleware)

// Utilizando rotas separadas em outros arquivos
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
