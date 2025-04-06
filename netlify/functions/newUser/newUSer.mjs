export default async (request, context) => {
  const { id, nombre, username, password, emailU, emailP, number } = await request.json()

  const response = await fetch(`https://app-3b8e40df-de09-4d4e-a795-9d05e9806eef.cleverapps.io/new-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, nombre, username, password, emailU, emailP, number }),
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}