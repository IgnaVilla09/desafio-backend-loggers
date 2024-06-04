Swal.fire({
  title: "Coloque su nombre",
  input: "text",
  text: "Ingrese su nickname",
  inputValidator: (value) => {
    return !value && "Debe ingresar un nombre.";
  },
  allowOutsideClick: false,
}).then((datos) => {
  let nombre = datos.value;
  document.title = nombre;

  let inputMensaje = document.getElementById("mensaje");
  let divMensajes = document.getElementById("container-mensajes");
  inputMensaje.focus();

  const socket = io();

  socket.emit("presentation", nombre);

  socket.on("historial", (mensajes) => {
    mensajes.forEach((m) => {
      divMensajes.innerHTML += `<strong>${m.nombre}</strong> te envió: ${m.mensaje}<br><br>`;
    });
  });

  socket.on("nuevoUsuario", (nombre) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Se ha conectado el usuario ${nombre}`,
      showConfirmButton: false,
      timer: 4500,
    });
  });

  socket.on("conversacion", (nombre, mensaje) => {
    divMensajes.innerHTML += `<strong>${nombre}</strong> te envió: ${mensaje}<br><br>`;
  });

  socket.on("usuarioDesconectado", (nombre) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${nombre} se ha desconectado`,
    });
  });

  inputMensaje.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
      let mensaje = e.target.value.trim();
      socket.emit("nuevoMensaje", nombre, mensaje);
      e.target.value = "";
      e.target.focus();
    }
  });
});
