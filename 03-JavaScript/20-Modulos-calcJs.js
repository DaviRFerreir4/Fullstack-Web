// Criando módulos
/*export function sum(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}
// export { sum, multiply }; // exporta tudo no final*/

// Importando tudo
/*function sum(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}
export { sum, multiply };*/

// Exportação padrão ou nomeada
/*export default function sum(a, b) { // função padrão fornecida pelo módulo
return a + b;
}
export  function multiply(a, b) { // cada item é importado pelo seu próprio nome de importação
return a * b;
}*/

// Renomeando as exportações
/*function sum(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}
export { sum as sumTwoNumbers, multiply as multiplyTwoNumbers }; // exporta as funções com outros nomes*/

// Renomeando as importações
/*function sum(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}
export { sum, multiply };*/

// Usando classes nos módulos
/*export class Calc {
  name = "Davi";
  sum(a, b) {
    return a + b;
  }
  multiply(a, b) {
    return a * b;
  }
}*/