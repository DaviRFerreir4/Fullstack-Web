// Utilizando o fetch()
/*const response = fetch("http://localhost:3333/products")
.then((response) => console.log(response.json()
.then((data) => console.log(data))));*/

// Utilizando o async e await
/*async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products");
  const data = await response.json();
  console.log(data);
}
fetchProducts();*/

// Passando parâmetros na requisição
async function fetchProductById(id) {
  const response = await fetch(`http://localhost:3333/products/${id}`);
  const data = await response.json();
  console.log(data);
}
fetchProductById(2);