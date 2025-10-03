import express from 'express'
import type { Request, Response } from 'express'

const PORT = 3333

const app = express()
app.use(express.json())

app.get('/', async (request: Request, response: Response) => {
  response.json({ message: 'Eae' })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
