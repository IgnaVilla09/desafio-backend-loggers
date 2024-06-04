import os from "os";
export function args(products) {
  let { title, price, code, stock, ...otros } = products;
  return `Se han detectado args inválidos.
Argumentos requeridos:
    - Nombre: tipo string. Se ingresó ${title}
    - Precio: tipo number. Se ingreso ${price}
    - Code: tipo number. Se ingreso ${code}
    - Stock: tipo number. Se ingreso ${stock} 
Argumentos opcionales:
    - Descripción, imágenes, estado y categoría. Se ingreso ${JSON.stringify(
      otros
    )}

Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}
