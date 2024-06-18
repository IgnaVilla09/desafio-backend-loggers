let btnReset= document.getElementById('btn-email-password');
let input = document.getElementById("email")
btnReset.addEventListener('click', async (e) => {
    e.preventDefault()
    
    let email = input.value.trim()
    console.log(email)

    if(email === ""){
        alert("Debe ingresar un email")
        return
    }

    let response = await fetch('/api/sessions/sendTokenPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    })

    if(response.ok === true){
        alert("Se ha enviado un email con el link para resetear la contraseña")
    }else{
        alert("Ocurrió un error al enviar el email: " + response.statusText)
    }
    
})