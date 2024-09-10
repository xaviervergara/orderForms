export function dividirArrayPorTamanio(array, n) {
  const resultado = [];

  for (let i = 0; i < array.length; i += n) {
    resultado.push(array.slice(i, i + n));
  }

  return resultado;
}
