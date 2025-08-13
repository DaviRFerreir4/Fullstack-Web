// acessando elementos na DOM
/*// console.log(document);
console.log(document.title);
const user = document.getElementById("guest-2");
console.log("Pegando por id\n", user);
// console.dir(user);
const guests = document.getElementsByClassName("guest");
console.log("Pegando por classe\n", guests);
console.log("Pegando específico por classe\n", guests[0]);
console.log("Pegando específico por classe\n", guests.item(1));
const li = document.getElementsByTagName("li");
console.log("Pegando por nome de tag\n", li);*/

// recuperando elementos com query selector
/*const guest = document.querySelector("li#guest-2");
console.log(guest);
const guests = document.querySelector("li.guest");
console.log(guests);
const allGuests = document.querySelectorAll("li.guest");
console.log(allGuests);*/

// manipulando o conteúdo dos elementos da DOM
/*const guestSpan = document.querySelector("#guest-1 span");
const guest = document.querySelector("#guest-1");
console.log(guestSpan.textContent);
guestSpan.textContent = "Davi Roberto";
console.log(guestSpan);
console.log(guest.textContent); // retorna conteúdo visível e oculto
console.log(guest.innerText); // retorna somente o conteudo visível
console.log(guest.innerHTML); // retorna o HTML como texto*/

// alterando estilos dos elementos via JavaScript
/*const input = document.querySelector("input[type=text]#name");
input.classList.add("input-error");
// input.classList.remove("input-error");
input.classList.toggle("input-error"); // se não tiver a classe, adiciona. Se tem, remove
const button = document.querySelector("button");
button.style.backgroundColor = "red";*/

// criando elementos via JavaScript
/*const guestList = document.querySelector("ul");
const newGuest = document.createElement("li");
newGuest.id = "guest-3";
newGuest.classList.add("guest");
const guestName = document.createElement("span");
guestName.textContent = "Diego";
const guestSurename = document.createElement("span");
guestSurename.textContent = "Fernandes";
// newGuest.append(guestSurename); // adiciona após o último filho
// newGuest.prepend(guestName); // adiciona antes do último filho
// newGuest.append(guestName, guestSurename); // adicionando vários argumentos
newGuest.appendChild(guestName);
guestList.append(newGuest);*/

// manipulando atributos via JavaScript
/*const input = document.querySelector("input");
input.setAttribute("required", true);
input.setAttribute("type", "number");
input.removeAttribute("id");*/

// lidando com eventos da DOM
/*window.addEventListener("load", () => {
  console.log("A página foi carregada");
});
addEventListener("click", (event) => {
  event.preventDefault();
  // console.log(event); // retorna todas as informações do evento
  // console.log(event.target);
  console.log(event.target.innerText);
});*/

// lidando com eventos de elementos específicos
/*const ul = document.querySelector("ul");
ul.addEventListener("scroll", () => {
  // console.log(ul.scrollTop);
  if (ul.scrollTop > 300) {
    console.log("Fim da lista");
    ul.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});
const button = document.querySelector("button");
button.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Clicou");
});*/

// eventos de formulário e diferença de addEventListener e declaração do evento direto
/*const form = document.querySelector("form");
form.onsubmit = (event) => {
  event.preventDefault();
  console.log("Você enviou o formulário");
}
form.onsubmit = (event) => {
  event.preventDefault();
  console.log("Você enviou o formulário #2");
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Você enviou o formulário #3");
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Você enviou o formulário #4");
});*/

// eventos em inputs
/*const input = document.querySelector("input");
// input.addEventListener("keydown", (event) => {
//   console.log(event.key);
// });
input.addEventListener("keypress", (event) => {
  console.log(event.key);
});
function inputChange() {
  console.log("O input mudou!");
}
input.onchange = inputChange;*/

// utilizando regex e manipulando o valor do input
/*const input = document.querySelector("input");
const form = document.querySelector("form");
input.addEventListener("input", () => {
  let value = input.value;
  const regex = /\D+/g;
  // console.log(value.match(regex));
  // const isValid = regex.test(value);
  // console.log(isValid);
  // input.value = input.value.replace(regex, "");
});
form.addEventListener("submit", (event) => {
  const regex = /\D+/g;
  event.preventDefault();
  const value = input.value;
  console.log(value.replace(regex, ""));
  if (regex.test(value)) {
    alert("Padrão aceito");
  } else {
    alert("Padrão incorreto");
  }
});*/