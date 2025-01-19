export default function useStreamingResponse() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const response = new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      // "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for nginx which is required for SSE to work properly
    },
  });

  return { response, writer };
}
