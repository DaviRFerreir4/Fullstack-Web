export function hoursClick() {
  const hours = document.querySelectorAll(".hour-available")
  hours.forEach((available) => {
    available.addEventListener("click", (selected) => {
      // Removendo a classe hour-selected de todas as li
      hours.forEach((hour) => {
        hour.classList.remove("hour-selected")
      })

      // Adiciona a classe hour-selected na li selecionada
      selected.target.classList.add("hour-selected")
    })
  })
}