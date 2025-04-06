// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
export default async (request, context) => {
  try {
    fetch(`https://app-3b8e40df-de09-4d4e-a795-9d05e9806eef.cleverapps.io/new-user`)
    .then(response => response.json())
    .then(data => {
        swal.fire({
            title: "Usuario creado",
            text: "El usuario ha sido creado exitosamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        })
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    })
  } catch (error) {
    swal.fire({
        title: "Error",
        text: "Error al crear el usuario",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
    })
    console.error('Error:', error)
    return new Response(error.toString(), {
      status: 500,
    })
  }
}
