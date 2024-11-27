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
