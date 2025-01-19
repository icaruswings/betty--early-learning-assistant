export const Suggestions = (suggestions: string[]) => {
  return new Response(JSON.stringify({ suggestions }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const Starters = (starters: string[]) => {
  return new Response(JSON.stringify({ starters }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const Unauthorized = () => {
  return new Response("Unauthorized", { status: 401 });
};

export const MethodNotAllowed = () => {
  return new Response("Method Not Allowed", { status: 405 });
};

export const ServerError = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
