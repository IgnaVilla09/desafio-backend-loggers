let inputPass1 = document.getElementById("password");
let inputPass2 = document.getElementById("password2");
let btnPass = document.getElementById("btn-email-password");

btnPass.addEventListener('click', async (e) => {

    if (inputPass1.value !== inputPass2.value) {
        alert("Las contraseñas no coinciden");
        return;
    }

});