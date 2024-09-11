export function showDeleteConfirmation(fileId) {
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
}
