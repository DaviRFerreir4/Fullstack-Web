const periods = document.querySelectorAll(".period")

// Gera evento de click para cada lista
periods.forEach((period) => {
  // Captura o clique na lista
  period.addEventListener("click", (event) => {
    // Verifica se o clique ocorreu no icone de cancelar
    if(event.target.classList.contains("cancel-icon")) {
      // Recupera a li pai do icone
      const item = event.target.closest("li")
      const { id } = item.dataset

      if (id) {
        const isConfirm = confirm("Tem certeza que deseja cancelar esse agendamento?")

        if (isConfirm) {
          console.log("Remover");
        }
      }
    }
  })
})