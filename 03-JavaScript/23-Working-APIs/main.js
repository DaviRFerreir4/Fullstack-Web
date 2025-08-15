// Utilizando o fetch()
/*const response = fetch("http://localhost:3333/products")
.then((response) => console.log(response.json()
.then((data) => console.log(data))));*/

// Utilizando o async e await
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products");
  const data = await response.json();
  console.log(data);
}
// fetchProducts();

// Passando parâmetros na requisição
async function fetchProductById(id) {
  const response = await fetch(`http://localhost:3333/products/${id}`);
  const data = await response.json();
  console.log(data);
}
// fetchProductById(2);

// Fetch com post
const productName = document.querySelector("input#name");
const productPrice = document.querySelector("input#price");
const form = document.querySelector("form");
const button = document.querySelector("button[type='button']");

button.addEventListener("click", async () => {
  await fetchProducts();
});

form.addEventListener("submit", async (event) => {
  await fetch("http://localhost:3333/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      name: productName.value,
      price: productPrice.value,
    })
  });
});