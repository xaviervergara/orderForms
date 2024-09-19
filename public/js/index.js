import { showDeleteConfirmation } from './sweetalert-config.js';

const socket = io();

const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');

export async function updateFileList() {
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

    //Esto lo saque de gpt es para hacer la animacion del listado
    // Obtener todos los elementos recién creados
    const items = document.querySelectorAll('.item-list');

    // Aplicar la animación de forma gradual pero desde arriba hacia abajo
    items.forEach((item, index) => {
      const reversedIndex = items.length - 1 - index; // Invertir el orden
      setTimeout(() => {
        item.classList.add('show'); // Añade la clase "show"
      }, reversedIndex * 50); // El retraso se incrementa de abajo hacia arriba
    });

    //* Agregar event listeners para redirigir a la página de detalles
    document.querySelectorAll('.item-name').forEach((item) => {
      item.addEventListener('click', () => {
        const fileId = item.getAttribute('data-id');
        // Redirigir a la página de detalles
        window.location.href = `/detail.html?id=${fileId}`;
      });
    });

    //* --- Elimina el archivo ---
    document.querySelectorAll('.item-delete').forEach((item) => {
      item.addEventListener('click', async () => {
        const fileId = item.getAttribute('data-id');
        showDeleteConfirmation(fileId);
      });
    });
  } catch (error) {
    console.error('Error al obtener la lista de archivos:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
      const response = await fetch('/api/orderForm/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        //* Actualiza la lista de archivos para incluir el archivo recién subido
        await updateFileList();
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  });

  // Cargar la lista de archivos al cargar la página
  updateFileList();
});

// Escuchar el evento de archivo subido
socket.on('fileUploaded', async (file) => {
  await updateFileList(); // Actualiza la lista de archivos
});

// Escuchar el evento de archivo eliminado
socket.on('fileDeleted', async ({ fileId }) => {
  await updateFileList(); // Actualiza la lista de archivos
});
