document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    //Envio la planilla al backend
    const response = await fetch('http://localhost:8080/api/orderForm/upload', {
      method: 'POST',
      body: formData,
    });

    //Si la respuesta es negativa tiro error
    if (!response.ok) {
      throw new Error('Error en la carga del archivo');
    }

    //Si se envia correctamente logueamos la respuesta positiva del back (confirmacion)
    const result = await response.json();
    console.log(result);

    // Unna vez que envie la planilla, la pido de vuelta procesada por el back, donde se extraen los datos
    const dataResponse = await fetch('http://localhost:8080/api/orderForm');
    const data = await dataResponse.json();

    //La data nos llega en forma de array, y nos llegan celdas vacias. Aqui filtramos solo las celdas con informacion relevante
    const usedRange = data.filter((e) => {
      if (e[0] || e[1] !== null) {
        return e;
      }
    });

    //Ayuda para visualizar rapido el array completo
    console.log(usedRange);

    //Aca se obtiene el numero de la cantidad de productos que vino en la planilla
    const cantidad_producto = usedRange.length - 1;

    //Aca a traves del filtro obtenemos solo la columna con los skus
    const skus = usedRange.map((e) => {
      return e[1];
    });

    skus.shift(); //?Le sacamos el primer item que es "sku", nos quedamos solo con los codigos

    //* // --- DOM RENDER ---

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
          formContainer.innerHTML += `<div  class="cell ${element[1]}">${e}</div>`;
        }
        i++;
      });
    });

    const skuEnter = document.getElementById('skuEnter');

    skuEnter.addEventListener('input', (e) => {
      let text = e.target.value;
      if (text.length >= 13) {
        skus.forEach((e) => {
          if (e === text) {
            const itemOk = document.getElementsByClassName(`${text}`);
            for (let i = 0; i < itemOk.length; i++) {
              itemOk[i].classList.add('cell-ok');
              itemOk[i].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
              });
            }
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }, 1000);
          }
        });
        setTimeout(() => {
          e.target.value = '';
        }, 300);
      }
    });
  } catch (error) {
    console.error('Hubo un problema con la carga del archivo:', error);
  }
});
