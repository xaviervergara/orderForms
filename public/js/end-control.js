document.addEventListener('DOMContentLoaded', async () => {
  // Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get('id');

  if (fileId) {
    try {
      const response = await fetch(`/api/orderForm/${fileId}`);
      const responseData = await response.json();
      const { filename, missingItems } = responseData;

      //Extraer. fecha

      // Encuentra la posición inicial y final de la fecha
      const startIndex = filename.indexOf('del ') + 4; // Posición después de 'del '
      const endIndex = filename.indexOf('.xlsx');

      // Extrae la fecha
      const date = filename.slice(startIndex, endIndex);

      //* ============================================================================================================================
      //* =   Este If indica que dependiendo de si hay faltantes o no, se renderiza determinado layout y se envia un mail distinto   =
      //* ============================================================================================================================
      if (missingItems.length > 0) {
        //*Creamos desde 0 el div donde se renderiza la tabla (lo hacemos desde js, para que no se vea rara la carga del contenido luego )

        const missingsDiv = document.createElement('div');
        missingsDiv.id = 'formContainer';
        missingsDiv.className = 'form-container';

        const htmlContent = missingItems
          .map((element) => {
            return element
              .map((e) => {
                return `<div class="cell ${element[1]}">${e}</div>`;
              })
              .join(''); // Une todos los divs de un solo elemento
          })
          .join(''); // Une todos los elementos en un solo string de HTML

        missingsDiv.innerHTML = htmlContent; // Inserta el HTML generado

        document.querySelector('main').appendChild(missingsDiv);

        //! --- MAILING MAILING MAILING MAILING MAILING MAILING ---
        document
          .getElementById('sendMailBtn')
          .addEventListener('click', async () => {
            try {
              // Crear el HTML con tablas para 10 columnas por fila
              const tableContent = `
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">COD</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">SKU</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">DESCRIPCIÓN</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">OBSERVACIONES</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">TEMPORADA</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">COLECCIÓN</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">DESTINO</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">AMBIENTE</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">CLASIFICACIÓN 1</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #FB7498; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">CLASIFICACIÓN 3</th>
                  </tr>
                </thead>
                <tbody>
                  ${missingItems
                    .map((element) => {
                      return `<tr>
                        ${element
                          .map((e, index) => {
                            return `<td style="
                              padding: 10px;
                              border: 1px solid #ddd;
                              text-align: center;
                              font-family: Arial, sans-serif;
                              font-size: 12px;
                              color: #333;
                              background-color: ${
                                index % 2 === 0 ? '#fafafa' : '#fff'
                              };
                            ">${e}</td>`;
                          })
                          .join('')}
                      </tr>`;
                    })
                    .join('')}
                </tbody>
              </table>
            `;

              const emailHtmlContent = `
                     <h1 style="color: #333333; font-family: roboto; background-color: #F4CCCC; display: inline-block;padding: .2em; border-radius:5px">Items faltantes</h1>
                     <p>Hola buenos días ¿Cómo están? En el día de hoy hemos controlado el pedido del ${date} y encontramos los siguientes faltantes:</p>
                      <div style="width: 90%; padding: 1em; background-color: white; border-radius: 15px;">
                       ${tableContent}
                      </div>
                     <p>Cualquier cosa nos avisan si los mandan en el proximo pedido, ¡Muchas gracias!</p>


                     <p>Saludos,</p>


                     <p>Equipo de Fotografía.</p>
  
                    `;

              const response = await fetch('/api/endControl/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: 'xvergara@arredo.com.ar',
                  subject: `Faltantes pedido del ${date}`,
                  html: emailHtmlContent,
                }),
              });

              if (response.ok) {
                console.log('Correo enviado correctamente');
              } else {
                console.log('Error al enviar el correo');
              }
            } catch (error) {
              console.log('Error:', error);
            }
          });
      } else {
        //* En este ELSE VA EL OTRO MAIL
        const okControlDiv = document.createElement('div');

        okControlDiv.innerHTML =
          '<h1>¡Entrega exitosa! No hubo faltantes en su pedido</h1>';

        document.querySelector('main').appendChild(okControlDiv);

        document
          .getElementById('sendMailBtn')
          .addEventListener('click', async () => {
            const response = await fetch('/api/endControl/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: 'xvergara@arredo.com.ar',
                subject: `Pedido del ${date}: Todos los productos recibidos correctamente`,
                html: `
                      <h1 style="color: #333333;background-color: #D9EAD3;font-family: roboto; display: inline-block; padding: .2em; border-radius:5px">Todos los productos recibidos correctamente</h1>

                      <p>Hola buenos días ¿Cómo están? En el día de hoy hemos controlado el pedido del ${date} y no se reportaron faltantes. ¡Muchas gracias!</p>
                    
                       <p>Saludos,</p>


                     <p>Equipo de Fotografía.</p>

                `,
              }),
            });

            if (response.ok) {
              console.log('Correo enviado correctamente');
            } else {
              console.log('Error al enviar el correo');
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('error en else');
  }
});

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
