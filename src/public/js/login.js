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

  window.location.href = "/products";

  if (respuesta.status == 200) {
    let datos = await respuesta.json();
  } else {
    alert(`${respuesta.status} ${respuesta.statusText}`);
  }
});
