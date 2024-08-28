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

    // Una vez subido, se hace el fetch para obtener el contenido
    const dataResponse = await fetch('http://localhost:8080/api/orderForm');
    const data = await dataResponse.json();

    //Retorna solo el usedRange de la planilla
    const usedRange = data.filter((e) => {
      if (e[0] || e[1] !== null) {
        return e;
      }
    });

    console.log(usedRange); //Ayuda para visualizar rapido el array completo

    //Cantidad de producto

    const cantidad_producto = usedRange.length - 1;

    console.log(`La cantidad de productos es: ${cantidad_producto}`);

    //Filtra solo los sku

    const skus = usedRange.map((e) => {
      return e[1];
    });

    skus.shift(); //?Le sacamos el primer item que es "sku", nos quedamos solo con los codigos

    console.log(`Esto es skus: ${skus}`);

    //* DOM RENDER

    let form = document.getElementById('uploadForm');

    form.innerHTML += `<div class="cant-item">Cantidad de items: ${cantidad_producto}</div>`;

    let formContainer = document.getElementById('formContainer');
    //i lo uso para colorear solo los 10 primeros 10 datos, (encabezado de la tabla)
    let i = 0;
    usedRange.forEach((element) => {
      element.forEach((e) => {
        if (i < 10) {
          formContainer.innerHTML += `<div class="header">${e}</div>`;
        } else {
          formContainer.innerHTML += `<div class="cell">${e}</div>`;
        }
        i++;
      });
    });
  } catch (error) {
    console.error('Hubo un problema con la carga del archivo:', error);
  }
});
