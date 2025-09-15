// Obtendo parâmetros nomeados e separando eles
export function parseRoutePath(path) {
  const routeParameterRegex = /:([a-zA-Z]+)/g // regex que verifica os caractéres ":id" da rota (parâmetro não nomeado)
  const params = path.replaceAll(routeParameterRegex, "(?<$1>[a-z0-9-_]+)") // regex que verifica "/números" da rota
  const pathRegex = new RegExp(`${params}(?<query>\\?(.*))?$`)
  return pathRegex
}
