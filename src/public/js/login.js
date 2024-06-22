let btnLogin = document.getElementById("btn-form");
let inputEmail = document.getElementById("email");
let inputPassword = document.getElementById("password");

btnLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  if (
    inputEmail.value.trim().length === 0 ||
    inputPassword.value.trim().length === 0
  ) {
    alert("Debe completar todos los campos");
    return;
  }

  let body = {
    email: inputEmail.value.trim(),
    password: inputPassword.value.trim(),
  };

  let respuesta = await fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (respuesta.status === 200) {
    alert("Login exitoso");
    window.location.href = "/products";
  } else {
    if (respuesta.status === 401) {
      alert("Email o contraseña incorrectos");
      return;
    }
    let errorText = await respuesta.text(); 
    alert(`Error: ${errorText}`);
  }
});
