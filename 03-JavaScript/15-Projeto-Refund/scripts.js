// selecionando os elementos do formulário
const form = document.querySelector("form");
const expense = document.querySelector("input#expense");
const category = document.querySelector("select#category");
const amount = document.querySelector("input#amount");
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// capturando evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
};

// formatando o valor para reais brasileiros
function formatCurrencyBRL(value) {
  value = Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

// captura o evento de submit para criação da despesa
form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  addExpense(newExpense);
}

// adiciona uma nova despesa na lista
function addExpense(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", `Ícone da despesa de ${newExpense.category_name.toLowerCase()}`);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info")
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;
    const categoryName = document.createElement("span");
    categoryName.textContent = newExpense.category_name;
    expenseInfo.append(expenseName, categoryName);
    
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    const currency = document.createElement("small");
    currency.textContent = newExpense.amount.slice(0, 2);
    expenseAmount.textContent = newExpense.amount.slice(3, (newExpense.amount.length));
    expenseAmount.prepend(currency);

    const removeInput = document.createElement("img");
    removeInput.setAttribute("src", "img/remove.svg");
    removeInput.setAttribute("alt", "Remover");
    removeInput.classList.add("remove-icon");
    removeInput.onclick = () => {
      expenseItem.remove();
      updateTotals();
    };

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeInput);
    expenseList.append(expenseItem);
    
    updateTotals();
  } catch(error) {
    alert("Não foi possível adicionar a despesa a lista, tente novamente");
    console.log(error);
  }
}

// atualiza o total de despesas da lista
function updateTotals() {
  try {
    const items = expenseList.children;
    expensesQuantity.textContent = `${items.length} ${items.length === 1 ? "despesa" : "despesas"}`;

    let total = 0;
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount").textContent.slice(2, items[item].querySelector(".expense-amount").textContent.length);
      let value = Number(itemAmount.replace(".", "").replace(",", "."))
      if (isNaN(value)) {
        alert("Não foi possível calcular o total. O valor não parece ser um número");
        throw new Error("Valor digitado não é um número");
      }
      total += value;
    }
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "").trim();
    expensesTotal.innerHTML = `<small>R$</small>${total}`;
  } catch(error) {
    alert(error.message);
    console.log(error);
  }
}