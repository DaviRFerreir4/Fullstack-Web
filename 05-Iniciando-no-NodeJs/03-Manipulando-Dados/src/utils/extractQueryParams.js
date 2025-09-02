// Obtendo parâmetros nomeados e separando eles
export function extractQueryParams(query) {
  return query
    .slice(1) // tira o ?
    .split("&") // separa os itens pelo "&"
    .reduce((queryParams, param) => {
      const [key, value] = param.split("=") // separa chave de valor pelo "="
      queryParams[key] = value // adiciona o valor na chave através do queryParams
      return queryParams
    }, {})
}
