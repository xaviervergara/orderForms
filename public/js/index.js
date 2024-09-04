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
            <div class="item-delete">Delete file</div>
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
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
    }
  }

  // Cargar la lista de archivos al cargar la página
  updateFileList();
});
