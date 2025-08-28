// Tipos primitivos
/*let username: string
username = "Oi"
// username = 1
// username = false
let total: number
total = 3
total = 4.5
let isLoading: boolean
isLoading = true
isLoading = false*/

// Tipagem explicita e inferência de tipos
/*let myName: string // tipagem explicita ou anotação de tipo (Type Annotation)
//myName = 2
myName = "Davi"
let message = "Olá, mundo!" // inferência de tipo
//message = 8
message = "Olá, Davi"*/

// Tipo any
/*let message: any
message = 2
message = "Oi"
message = true*/

// Tipagem em arrays
/*let names: string[] = ["Davi", "Rodrigo"] // tipagem explicita
let numbers: number[] = [1, 3, 7, 11]
//names.push(1)
//numbers.push("")
let products = ["Produto X", "Produto Y", "Produto Z"] // inferência de tipo*/

// Tipagem em funções
/*function sum(x: number, y: number): number {
  const result = x + y // inferência de tipo
  console.log("Resultado =", result)
  //return "result"
  return result
}
//const result = sum(1, "2")
//const result = sum(1)
const result = sum(1, 2)
const showMessage = (name: string): string => {
  const message = "Olá " + name
  //return 1
  return message
}
//showMessage("Davi", "Ferreira")
showMessage("Davi")*/

// Tipagem em objetos
/*let user: { name: string; age: number; avatarUrl?: string } = {
  name: "Davi",
  //age: "22",
  age: 22,
  // avatarUrl: "https://img.url" // atributo opcional (usa um "?" depois do nome)
}
// function signIn(email: string, password: string) {
//   // lógica de autenticação
// }
// signIn("davi@email.com", "drowssap")
function signIn({email, password}: {email: string, password: string}) {
//function signIn(data: {email: string, password: string}) {
  // lógica de autenticação
}
signIn({email: "davi@email.com", password: "drowssap"})
//signIn({avatar: "https://url.img"})*/

// Null e Undefined
/*let value: number
//console.log(value)
let user = {
  name: "Davi",
}
//console.log(user.email)
let email: null = null
console.log(email)
if (!email) {
  console.log("Informe o email!")
}*/

// Union Types
/*let response: string | null
response = "Teste"
//response = 4
response = null*/
