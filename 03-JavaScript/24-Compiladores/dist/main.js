"use strict";

class User {
  constructor(_ref) {
    let {
      email
    } = _ref;
    this.email = email;
  }
  sendMessage() {
    console.log("Mensagem enviada para:", this.email); // se quiser que reflita no código, devo recompilar o arquivo com o script criado ("npm run build")
  }
}
let user = new User({
  email: "davi@email.com"
});
console.log(user);
user.sendMessage();

// executar o comando "./node_modules/.bin/babel main.js --out-dir dist" no terminal para que o babel gere o código a ser lido por navegadores incompatíveis com essa versão do ECMAScript