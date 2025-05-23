// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
export default async (request, context) => {
  try {
    
    const url = new URL(request.url)
    const subject = url.searchParams.get('id') || 'World'

    const response = await fetch(`https://app-3b8e40df-de09-4d4e-a795-9d05e9806eef.cleverapps.io/classfriend/${subject}`)
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}
