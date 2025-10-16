import { app } from '@/app'
import { env } from './env'
import 'express-async-errors'

app.listen(env.PORT, () => {
  console.log(`Server is runing on port ${env.PORT}`)
})
