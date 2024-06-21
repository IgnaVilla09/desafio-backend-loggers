export class UsuarioDTO {
  constructor(usuario) {
    this.id = usuario._id;
    this.firstname = usuario.nombre;
    this.lastname = usuario.apellido
      ? usuario.apellido
      : "Sin apellido especificado";
    this.rol = usuario.role;
    this.email = usuario.email;
    this.age = usuario.age;
    this.cartId = usuario.cartId; 
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
