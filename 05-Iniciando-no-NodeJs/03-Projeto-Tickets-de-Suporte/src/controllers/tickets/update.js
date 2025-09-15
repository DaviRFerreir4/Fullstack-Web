export function update({ request, response, database }) {
  const { id } = request.params
  const { equipment } = request.body

  return response.end()
}
