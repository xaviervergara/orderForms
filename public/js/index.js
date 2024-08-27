document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:8080/api/orderForm/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error en la carga del archivo');
    }

    const result = await response.json();
    console.log(result); // Verifica si la carga fue exitosa

    // Una vez subido, puedes hacer el fetch para obtener el contenido
    const dataResponse = await fetch('http://localhost:8080/api/orderForm');
    const data = await dataResponse.json();

    //Muestra solo el usedRange de la planilla
    const usedRange = data.filter((e) => {
      if (e[0] || e[1] !== null) {
        return e;
      }
    });

    console.log(usedRange);
  } catch (error) {
    console.error('Hubo un problema con la carga del archivo:', error);
  }
});
