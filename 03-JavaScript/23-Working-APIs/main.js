const response = fetch("http://localhost:3333/products")
.then((response) => console.log(response.json()
.then((data) => console.log(data))));