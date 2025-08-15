class User {
  constructor({ email }){
    this.email = email;
  }
}

let user = new User({ email: "davi@email.com" });
console.log(user);
// executar o comando "./node_modules/.bin/babel main.js --out-dir dist" no terminal para que o babel gere o código a ser lido por navegadores incompatíveis com essa versão do ECMAScript