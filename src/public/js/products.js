
const btnviewcart = document.getElementById("btn-view-cart")

btnviewcart.addEventListener("click", async (e) => {

    e.preventDefault()
    const cartId = await obtenerElIdDelCarrito();
    window.location.href = `api/carts/${cartId}`;
})

async function obtenerElIdDelCarrito() {
  const response = await fetch(`api/sessions/current`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.cartId;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-product-id');
      const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');

      if (confirmation) {
        try {
          const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status == 401) {
              alert('No tiene permisos para eliminar este producto');
            }
            
            if (response.status == 404) {
              alert('Producto no encontrado');
            }

            if (response.status == 403) {
              alert('No puede eliminar un producto que no le pertenece');
            }
          }else{
            window.location.href = '/products';
          }

        } catch (error) {
          alert('Error al eliminar el producto: ' + error.message);
        }
      }
    });
  });
});
