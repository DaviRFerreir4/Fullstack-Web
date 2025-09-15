export function index({ request, response, database }) {
  const tickets = database.select()
  return response.end(JSON.stringify(tickets))
}
