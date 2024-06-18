let inputPass1 = document.getElementById("password");
let inputPass2 = document.getElementById("password2");
let inputEmail = document.getElementById("email");
let btnPass = document.getElementById("btn-email-password");

btnPass.addEventListener('click', async (e) => {
    e.preventDefault();

    if (inputPass1.value !== inputPass2.value) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        const response = await fetch("/api/sessions/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: inputEmail.value,
                password: inputPass1.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Por favor, no repita la contraseña anterior");
        }

        alert(data.message); // Aquí muestra el mensaje de éxito o de otro tipo
        window.location.href = "/login"; 
    } catch (error) {
        alert(error.message);
    }
});
