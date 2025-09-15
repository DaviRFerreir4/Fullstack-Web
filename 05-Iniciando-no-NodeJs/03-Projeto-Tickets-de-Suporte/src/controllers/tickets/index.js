export function index({ request, response, database }) {
  const { status } = request.query
  console.log(status)
  const tickets = database.select()
  return response.end(JSON.stringify(tickets))
}
