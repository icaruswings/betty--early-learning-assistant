export const ServerError = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
