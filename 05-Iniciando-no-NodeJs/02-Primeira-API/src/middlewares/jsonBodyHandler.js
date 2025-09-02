// Utilizando Middleware
export async function jsonBodyHandler(request, response) {
  const buffers = []
  try {
    for await (const chunck of request) {
      buffers.push(chunck)
    }
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch (error) {
    request.body = null
  }
  response.setHeader("Content-Type", "application/json")
}
