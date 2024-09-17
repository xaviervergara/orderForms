document.addEventListener('DOMContentLoaded', async () => {
  const formContainer = document.getElementById('formContainer');

  // Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get('id');

  if (fileId) {
    try {
      const response = await fetch(`/api/orderForm/${fileId}`);
      const responseData = await response.json();
      const { missingItems } = responseData;

      const htmlContent = missingItems
        .map((element) => {
          return element
            .map((e, index) => {
              return `<div class="cell ${element[1]}">${e}</div>`;
            })
            .join(''); // Une todos los divs de un solo elemento
        })
        .join(''); // Une todos los elementos en un solo string de HTML

      formContainer.innerHTML = htmlContent; // Inserta el HTML generado

      //! --- MAILING MAILING MAILING MAILING MAILING MAILING ---
      document
        .getElementById('sendMailBtn')
        .addEventListener('click', async () => {
          try {
            const response = await fetch('/api/endControl/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: 'xaviervergara00@gmail.com', // Destinatario del correo
                subject: 'Prueba de correo con Nodemailer y Outlook',
                text: 'Este es un correo de prueba enviado desde Nodemailer usando Outlook.',
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
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(`Error en else`);
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
