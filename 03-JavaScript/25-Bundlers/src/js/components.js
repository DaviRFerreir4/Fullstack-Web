export function title(title) {
  const element = document.createElement("h1");
  element.textContent = title;
  document.body.append(element);
}