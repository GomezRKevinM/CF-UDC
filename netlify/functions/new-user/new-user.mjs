// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
export default async (request, context) => {
  try {
    const body = await request.json()
    const { nombre, username, password, emailU, emailP, number } = body
    console.log(body)
    if (!nombre || !username || !password || !emailU || !emailP || !number) {
      return new Response('Faltan datos', { status: 400 })
    }

    fetch(`https://app-3b8e40df-de09-4d4e-a795-9d05e9806eef.cleverapps.io/new-user`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        swal.fire({
          title: "Usuario creado",
          text: "El usuario ha sido creado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      })
      .catch(error => {
        console.error('Error:', error)
        swal.fire({
          title: "Error",
          text: "Error al crear el usuario",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
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
