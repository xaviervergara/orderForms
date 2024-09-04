document.addEventListener('DOMContentLoaded', async () => {
  const formContainer = document.getElementById('formContainer');

  // Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get('id');

  if (fileId) {
    try {
      const response = await fetch(`/api/orderForm/${fileId}`);
      const responseData = await response.json();
      const { data, filename } = responseData;

      const usedRange = data.filter((e) => {
        if (e[0] || e[1] !== null) {
          return e;
        }
      });

      const itemQuantity = usedRange.length - 1;

      document.getElementById(
        'formSection'
      ).innerHTML += `<div class="file-name">${filename}</div>
      <div class="item-quantity">Cantidad de productos: ${itemQuantity}</div>`;

      // Renderizar los datos en `formContainer`
      let i = 0;
      usedRange.forEach((element) => {
        element.forEach((e) => {
          if (i < 10) {
            formContainer.innerHTML += `<div class="header">${e}</div>`;
          } else {
            formContainer.innerHTML += `<div class="cell ${element[1]}">${e}</div>`;
          }
          i++;
        });
      });

      //* // --- ROW GREEN CHECK ---

      //Obtenemos el input del front
      const skuEnter = document.getElementById('skuEnter');

      if (!skuEnter) {
        console.error('El elemento skuEnter no se encontró en el DOM');
        return;
      }

      //Aca a traves del filtro obtenemos solo la columna con los skus
      const skus = usedRange.map((e) => {
        return e[1];
      });

      skus.shift(); //?Le sacamos el primer item que es "sku", nos quedamos solo con los codigos

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
      formContainer.innerHTML =
        '<p>Error al obtener los detalles del archivo.</p>';
      console.error('Error al obtener los detalles del archivo:', error);
    }
  } else {
    formContainer.innerHTML = '<p>No se encontró el archivo.</p>';
  }
});
