// Conhecendo Interface no TypeScript
/*interface Product {
  id: number
  name: string
}
function newProduct(product: Product) {
  console.log("Nome do produto:", product.name)
  console.log("Identificador do produto:", product.id)
}
newProduct({ name: "Teclado", id: 1 })*/

// Como estender interfaces
/*interface Person {
  id: number
  name: string
  email?: string // propriedade opcional
}
interface Teacher extends Person {
  // id: number
  // name: string
  subjects: string[]
}
interface Student extends Person {
  // id: number
  // name: string
  age: number
}
let teacher: Teacher = {
  id: 1,
  name: "Rodrigo",
  subjects: ["Javascript", "TypeScript"],
}
let student: Student = {
  id: 1,
  name: "Davi",
  age: 22,
}*/

// Usando Type
/*type Product = {
  id: number
  name: string
}
function newProduct(product: Product) {}
newProduct({ id: 1, name: "Teclado" })
type SelectResponse = Product[] | null
function selectProduct(): SelectResponse {
  return null
}*/

// Intersecção de tipos
/*type Person = {
  id: number
  name: string
}
type Teacher = Person & {
  subjects: string[]
}
type Student = Person & {
  age: number
}
let teacher: Teacher
let student: Student*/

// Diferenças entre Type e Interface
// Semelhanças
/*interface IBaseProduct {
  price: number
}
interface IProduct extends IBaseProduct {
  id: number
  name: string
}
type TBaseProduct = {
  price: number
}
type TProduct = TBaseProduct & {
  id: number
  name: string
}
// let product1: IProduct = { id: 1, name: "Teclado", price: 150 } // Acusa erro depois de adicionar "quantity"
let product2: TProduct = { id: 2, name: "Mouse", price: 125 }
// Diferenças
interface IProduct {
  // É possível adicionar uma peculiariedade da interface tardiamente, mas as outras utilizações acusarão erro
  quantity: number
}
// type TProduct = {
// // Não é possível sobreescrever a declaração de tipo nem adicionar tardiamente
//   quantity: number
// }
let product3: IProduct = { id: 3, name: "Monitor", price: 650, quantity: 5 }
type TypeString = string // É possível criar um tipo personalizado que herda de um tipo primitivo
type TypeNumber = number // (Popularmente chamado de "type alias")
// interface StringInterface extends string {} // Não é possível criar uma interface que herda um tipo primitivo*/

// Asserção de tipos
/*type UserResponse = {
  id: number
  name: string
  avatar: string
}
let userResponse = {} as UserResponse
userResponse.id = 1
userResponse.name = "User"*/

// Restringindo valores
/*type Size = "small" | "medium" | "large"
let size: Size
//size = "sm"
//size = "pequeno"
//size = ""
size = "small" // ctrl + space retorna os possíveis valores para a tipagem*/

// Enums
/*enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3,
}
let profilePermission: number = Profile.Admin
console.log(profilePermission)
console.log(Profile.Client)*/

// Generic
// S => state
// T => type
// K => key
// V => value
// E => element
// <Tipo
// (pode herdar um tipo primitivo: "extends number | string")
// (pode ter um tipo padrão caso não seja especificado: " = string")
// >
/*function useState<T extends number | string = string>() {
  let state: T
  function getState() {
    return state
  }
  function setState(newValue: T) {
    state = newValue
  }
  return { getState, setState }
}
// let newState = useState<string>() // cria aceitando e retornando somente string
// let newState = useState<number>() // cria aceitando e retornando somente número
// let newState = useState() // cria aceitando e retornando somente string pois é o tipo padrão (" = string")
let newState = useState<string | number>() // cria aceitando e retornando tanto string e number por estar explicito assim na criação
newState.getState()
newState.setState(123)
newState.setState("123")*/
