export class UsuarioDTO {
  constructor(usuario) {
    this.firstname = usuario.nombre.toUpperCase();
    this.lastname = usuario.apellido
      ? usuario.apellido.toUpperCase()
      : "Sin apellido especificado";
    this.rol = usuario.role;
    this.email = usuario.email;
    this.age = usuario.age;
    this.cartId = usuario.cartId; // Se envía cartId para poder ser utilizado en el frontend
  }
}
