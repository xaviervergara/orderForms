document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileList = document.getElementById('fileList');

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
      const response = await fetch('/api/orderForm/upload', {
        method: 'POST',
        body: formData,
      });

      // const { newFile } = await response.json();

      // Actualiza la lista de archivos para incluir el archivo recién subido
      await updateFileList();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  });

  async function updateFileList() {
    try {
      const response = await fetch('/api/orderForm/files');
      const files = await response.json();

      fileList.innerHTML = files
        .map(
          (file) =>
            `
          <div class='item-list' >
            <div class="item-name" data-id='${file._id}'>Nombre: ${file.filename}</div> 
            <div class="item-status">Status: ${file.status}</div>          
            <button data-id='${file._id}' class="item-delete">Delete file</button>
            </div>
        `
        )
        .join('');

      // Agregar event listeners para redirigir a la página de detalles
      document.querySelectorAll('.item-name').forEach((item) => {
        item.addEventListener('click', () => {
          const fileId = item.getAttribute('data-id');
          // Redirigir a la página de detalles
          window.location.href = `/detail.html?id=${fileId}`;
        });
      });

      document.querySelectorAll('.item-delete').forEach((item) => {
        item.addEventListener('click', async () => {
          const fileId = item.getAttribute('data-id');
          Swal.fire({
            title: 'Seguro deseas eliminar el archivo?',
            text: 'No serás capaz de deshacer esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar',
            background: '#424242',
            customClass: {
              container: 'swal2-container-custom',
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              content: 'swal2-content-custom',
              confirmButton: 'swal2-confirm-custom',
              cancelButton: 'swal2-cancel-custom',
              icon: 'swal2-icon-custom',
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await fetch(`/api/orderForm/${fileId}`, {
                  method: 'DELETE',
                });

                if (response.ok) {
                  Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                  });
                  //La pagina recarga y se puede ver el cambio
                  updateFileList();
                } else {
                  throw new Error('Error al eliminar el archivo');
                }
              } catch (error) {
                console.log(`Error de metodo DELETE: ${error}`);
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo eliminar el archivo.',
                  icon: 'error',
                });
              }
            }
          });
        });
      });
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
    }
  }

  // Cargar la lista de archivos al cargar la página
  updateFileList();
});
