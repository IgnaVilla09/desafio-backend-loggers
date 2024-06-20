export class UsuarioDTO {
  constructor(usuario) {
    this.firstname = usuario.nombre;
    this.lastname = usuario.apellido
      ? usuario.apellido
      : "Sin apellido especificado";
    this.rol = usuario.role;
    this.email = usuario.email;
    this.age = usuario.age;
    this.cartId = usuario.cartId; // Se envía cartId para poder ser utilizado en el frontend
  }
}

export class UsuarioGitDTO {
  constructor(usuario){
    this.name = usuario.profileGithub.displayName;
    this.rol = usuario.role;
    this.email = usuario.email;
    this.cartId = usuario.cartId;
  }
}
