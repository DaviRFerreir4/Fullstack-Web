import express, { NextFunction } from 'express'
import { routes } from './routes/index.js'
import { AppError } from './utils/app-error.js'
import { ZodError } from 'zod'

const PORT = 3333

const app = express()

app.use(express.json())

// Middleware global (precisa vir antes das rotas, senão será ignorado, como na rota acima)
// app.use(myMiddleware)

// Utilizando rotas separadas em outros arquivos
app.use(routes)

app.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({ message: error.message })
    } else if (error instanceof ZodError) {
      return response
        .status(400)
        .json({ message: `Validation error`, issues: error.format() })
    }
    return response
      .status(500)
      .json({ message: `Erro genérico: ${error.message}` })
  }
)

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
