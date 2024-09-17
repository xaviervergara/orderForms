import { dividirArrayPorTamanio } from '../common.js';

const socket = io();

document.addEventListener('DOMContentLoaded', async () => {
  const formContainer = document.getElementById('formContainer');

  // Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get('id');

  if (fileId) {
    try {
      const response = await fetch(`/api/orderForm/${fileId}`);
      const responseData = await response.json();
      const { data, filename, availableItems, missingItems } = responseData;

      //* Si los skus vienen sin el simbolo "%", lo agregamos

      const usedRangeParsed = data.map((e) => {
        // Verificar si el SKU tiene 11 caracteres y si no contiene el símbolo '%'
        if (e[1].length > 11 && !e[1].includes('%', 11)) {
          // Insertar el símbolo '%' en la posición 11
          e[1] = e[1].slice(0, 11) + '%' + e[1].slice(11);
        }
        return e;
      });

      //* Aca a traves del filtro obtenemos solo la columna con los skus
      const skus = usedRangeParsed.map((e) => {
        return e[1];
      });

      skus.shift(); //?Le sacamos el primer item que es "sku", nos quedamos solo con los codigos

      //* Obtenemos la cantidad de productos totales en el pedido
      const itemQuantity = usedRangeParsed.length - 1;

      //* Renderizamos la el nombre del archivo y la cantidad de productos
      document.getElementById(
        'formSection'
      ).innerHTML += `<div class="file-name">${filename}</div>
      <div class="item-quantity">Cantidad de productos: ${itemQuantity}</div>`;

      //*  Renderizar los datos en `formContainer` en formato planilla
      let i = 0;
      usedRangeParsed.forEach((element) => {
        element.forEach((e) => {
          if (i < 10) {
            formContainer.innerHTML += `<div class="header">${e}</div>`;
          } else {
            formContainer.innerHTML += `<div class="cell ${element[1]}">${e}</div>`;
          }
          i++;
        });
      });

      //* REVISA SI EL FILE DE LA PLANILLA TIENE "availableItems". DE SER ASI, YA LOS PINTA DE VERDE
      //* APENAS SE ABRE LA PLANILLA. FUNCIONA COMO MEMORIA

      const savedOkItems = await availableItems.map((e) => {
        return document.getElementsByClassName(e);
      });

      savedOkItems.forEach((itemCollection) => {
        for (let i = 0; i < itemCollection.length; i++) {
          itemCollection[i].classList.add('cell-ok');
        }
      });

      //* // --- PINTA DE VERDE LOS PRODUCTOS QUE SE INGRESAN CON EL LECTOR DE SKU ---

      //Obtenemos el input del front
      const skuEnter = document.getElementById('skuEnter');

      if (!skuEnter) {
        console.error('El elemento skuEnter no se encontró en el DOM');
        return;
      }

      let timeout; // Variable para almacenar el temporizador

      skuEnter.addEventListener('input', (e) => {
        // Limpiamos el temporizador previo si existe. Por las dudas que el scanner falle y entre caracter y caracter hayamas de 50ms
        clearTimeout(timeout);
        // Definir un pequeño retraso (por ejemplo, 50ms) para procesar el valor del input
        timeout = setTimeout(() => {
          let text = e.target.value.trim();
          console.log('Si se ejecuta');
          // Solo procesar si la longitud es 13 o 14
          if (text.length === 13 || text.length === 14) {
            skus.forEach((sku) => {
              if (sku === text) {
                const itemOk = document.getElementsByClassName(text);
                for (let i = 0; i < itemOk.length; i++) {
                  itemOk[i].classList.add('cell-ok');
                  itemOk[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                  });
                }

                // Emitir el evento a través de Socket.io
                socket.emit('skuMarked', { sku: text });

                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }, 1000);
              }
            });

            // Limpiar el campo de texto después de 300ms
            setTimeout(() => {
              e.target.value = '';
            }, 300);
          }
        }, 50); // Ajusta este valor según la velocidad del escáner
      });

      //* --- ENVIA LOS ITEMS EXISTENTES AL BACKEND GUARDANDOLOS EN EL FILE DE LA PLANILLA PARA LUEGO RECUPERARLOS ---
      document
        .getElementById('sendOkItems')
        .addEventListener('click', async (e) => {
          const existingItems = document.getElementsByClassName('cell-ok');
          let toArr = [...existingItems];
          let rows = toArr.map((e) => {
            return e.innerHTML;
          });

          const rowsDivididos = dividirArrayPorTamanio(rows, 10);

          const res = await fetch('/api/controlledOrder/available', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rowsDivididos, fileId: fileId }),
          });

          if (!res.ok) {
            throw new Error('Error en la carga del archivo');
          }

          const result = await res.json();
          console.log(result);

          Swal.fire({
            title: 'Guardado',
            text: 'El archivo se guardó correctamente',
            icon: 'success',
          }).then((res) => {
            if (res.isConfirmed) {
              window.location.href = '/';
            }
          });
        });

      //* --- Finalizar control ---
      document
        .getElementById('endControl')
        .addEventListener('click', async () => {
          const existingItems = document.getElementsByClassName('cell-ok');
          let toArr = [...existingItems];
          let rows = toArr.map((e) => {
            return e.innerHTML;
          });

          const rowsDivididos = dividirArrayPorTamanio(rows, 10);

          //* Logica para almacenar los productos que no llegaron
          const allCells = document.querySelectorAll('.cell');

          //* Filtra las celdas que NO tienen la clase "cell-ok"
          const notFoundCells = [...allCells].filter(
            (cell) => !cell.classList.contains('cell-ok')
          );

          const notFoundData = notFoundCells.map((cell) => cell.innerHTML);

          const notFoundDataDividido = dividirArrayPorTamanio(notFoundData, 10);

          const res = await fetch('/api/controlledOrder/missing', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rowsDivididos,
              notFoundDataDividido,
              fileId: fileId,
            }),
          });

          if (!res.ok) {
            throw new Error('Error en la carga del archivo');
          }

          const result = await res.json();
          console.log(result);

          Swal.fire({
            title: 'Guardado en la BND',
            text: 'El archivo se guardó correctamente',
            icon: 'success',
          }).then((res) => {
            if (res.isConfirmed) {
              // alert(`Cambios guardados en la BD`);
              window.location.href = `/end-control.html?id=${fileId}`;
              // window.location.href = `/detail.html?id=${fileId}`;
            }
          });
        });
    } catch (error) {
      //! AQUI UN SWAL ALERT DE QUE NO SE ENCONTRO EL FILE
      formContainer.innerHTML =
        '<p>Error al obtener los detalles del archivo.</p>';
      console.error('Error al obtener los detalles del archivo:', error);
    }
  } else {
    formContainer.innerHTML = '<p>No se encontró el archivo.</p>';
  }

  //* --- Salir sin guardar? ---

  document.getElementById('goHomeTitle').addEventListener('click', () => {
    Swal.fire({
      title: 'Desea salir sin guardar?',
      text: 'Perderá los cambios del documento!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir sin guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/';
      }
    });
  });
});

//* --- Socket.io ---

socket.on('skuUpdated', (data) => {
  // Actualiza la interfaz para marcar el SKU en verde
  const itemOk = document.getElementsByClassName(data.sku);
  for (let i = 0; i < itemOk.length; i++) {
    itemOk[i].classList.add('cell-ok');
    itemOk[i].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 1000);
  }
});
