export function dividirArrayPorTamanio(array, n) {
  const resultado = [];

  for (let i = 0; i < array.length; i += n) {
    resultado.push(array.slice(i, i + n));
  }

  return resultado;
}

// Obtener los datos del usuario en el frontend
export async function UserInfo() {
  try {
    const response = await fetch('api/sessions/user-info');
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const userInfo = await response.json();
    localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Almacena los datos en el local storage
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}
