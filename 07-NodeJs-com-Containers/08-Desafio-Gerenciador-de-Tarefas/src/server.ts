import { app } from './app'

const PORT = process.env.PORT || 3333

console.log(process.env.DATABASE_URL)

app.listen(PORT, () => console.log(`Server is runing on port ${PORT}`))
