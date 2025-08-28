// Partial
/*interface User {
  id: number
  name: string
  email: string
}
const newUser: User = { id: 1, name: "Davi", email: "davi@email.com" }
// const updatedUserError: User = { name: "Davi Ferreira" }
// transforma todas as propriedades do tipo em opcionais
const updatedUser: Partial<User> = { name: "Davi Ferreira" }*/

// Pick
/*interface Book {
  title: string
  pages: number
  author: string
  description: string
}
interface BookPreview {
  title: string
}
const book1: BookPreview = { title: "Senhor dos Anéis: A Sociedade do Anel" }
// seleciona somente as propriedades que você deseja de um tipo
const book2: Pick<Book, "title" | "pages"> = {
  title: "Senhor dos Anéis: As Duas Torres",
  pages: 250,
}*/

// Omit
/*interface Book {
  title: string
  pages: number
  author: string
  description: string
}
// tira uma propriedade que você não deseja de um tipo
const book: Omit<Book, "description"> = {
  title: "O Hobbit",
  pages: 220,
  author: "J.R.R. Tolkien",
}*/

// Record
// cria um objeto onde todas as chaves são strings todos os valores são números
/*const scores: Record<string, number> = {
  Davi: 4,
  Mayk: 15,
  // 10: 5, // 10 será convertido para string
  // 15: "Rodrigo", // não aceita o indice como um número
}
// limitando valores com o record
type Profile = "admin" | "user" | "guest"
const user: Record<Profile, number> = {
  admin: 1,
  user: 2,
  guest: 3,
  // default: 0,
}
// objetos personalizados
interface User {
  name: string
  email: string
}
const users: Record<number, User> = {
  1: { name: "Davi", email: "davi@email.com" },
  2: { email: "rodrigo@email.com", name: "Rodrigo" },
}*/

// Typeof
/*interface Product {
  id: number
  name: string
  // price: number // impacta tanto a interface quanto as variaveis declaradas como typeof de uma variavel com o tipo da interface
}
const product1: Product = { id: 1, name: "Teclado" }
const product2: typeof product1 = { name: "Mouse", id: 2 }*/

// Keyof
/*const icons = {
  home: "./path/home.svg",
  add: "./path/add.svg",
  remove: "./path/remove.svg",
}
type Icon = typeof icons
const icon1: keyof Icon = "add" // cria uma variável com o tipo baseado nas keys do tipo Icon
// const icon2: keyof Icon = "x" // retorna erro, pois não existe no tipo "keyof Icon"*/
