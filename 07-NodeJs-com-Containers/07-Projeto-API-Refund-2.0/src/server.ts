import { app } from '@/app.js'
import { env } from './env.js'

const PORT = env.PORT

app.listen(PORT, () => console.log(`Server is runing on port ${PORT}`))
