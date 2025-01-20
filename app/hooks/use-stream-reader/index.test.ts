import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStreamReader } from "../use-stream-reader";

describe("useStreamReader", () => {
  const mockResponse = (body: ReadableStream | null = null, ok = true) =>
    new Response(body, { status: ok ? 200 : 500 });

  const createMockStream = (chunks: any[]) => {
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        controller.close();
      },
    });
  };

  it("handles successful streaming with chunks", async () => {
    const chunks = [
      { event: "on_chat_model_stream", data: { chunk: { kwargs: { content: "Hello" } } } },
      { event: "on_chat_model_stream", data: { chunk: { kwargs: { content: " World" } } } },
      { event: "on_chat_model_end", data: {} },
    ];

    const mockStream = createMockStream(chunks);
    const response = mockResponse(mockStream);

    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response, {
      onChunk,
      onComplete,
    });

    expect(streamResult.content).toBe("Hello World");
    expect(streamResult.error).toBeNull();
    expect(onChunk).toHaveBeenCalledWith("Hello");
    expect(onChunk).toHaveBeenCalledWith("Hello World");
    expect(onComplete).toHaveBeenCalledWith("Hello World");
  });

  it("handles non-ok response", async () => {
    const response = mockResponse(null, false);
    response.text = vi.fn().mockResolvedValue("Error message");

    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response);

    expect(streamResult.content).toBe("");
    expect(streamResult.error).toBe("Error message");
  });

  it("handles missing response body", async () => {
    const response = mockResponse(null);
    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response);

    expect(streamResult.content).toBe("");
    expect(streamResult.error).toBe("No response body available");
  });

  it("handles invalid JSON in stream", async () => {
    const encoder = new TextEncoder();
    const invalidStream = new ReadableStream({
      start(controller) {
        // Send an invalid JSON chunk followed by a valid one
        controller.enqueue(encoder.encode("data: not-json\n\n"));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "on_chat_model_stream",
              data: { chunk: { kwargs: { content: "Valid" } } },
            })}\n\n`
          )
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "on_chat_model_end",
              data: {},
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    const response = mockResponse(invalidStream);
    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response);

    // Invalid JSON should be skipped, only valid content should be included
    expect(streamResult.content).toBe("Valid");
    expect(streamResult.error).toBeNull();
  });

  it("handles stream read error", async () => {
    const errorStream = new ReadableStream({
      start(controller) {
        controller.error(new Error("Stream error"));
      },
    });

    const response = mockResponse(errorStream);
    const { result } = renderHook(() => useStreamReader());

    await expect(result.current.streamReader(response)).rejects.toThrow("Stream error");
  });

  it("handles mixed content in stream", async () => {
    const chunks = [
      { event: "other_event", data: {} },
      { event: "on_chat_model_stream", data: { chunk: { kwargs: { content: "Hello" } } } },
      { event: "on_chat_model_end", data: {} },
    ];

    const mockStream = createMockStream(chunks);
    const response = mockResponse(mockStream);

    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response);

    expect(streamResult.content).toBe("Hello");
    expect(streamResult.error).toBeNull();
  });

  it("works without callbacks", async () => {
    const chunks = [
      { event: "on_chat_model_stream", data: { chunk: { kwargs: { content: "Test" } } } },
      { event: "on_chat_model_end", data: {} },
    ];

    const mockStream = createMockStream(chunks);
    const response = mockResponse(mockStream);

    const { result } = renderHook(() => useStreamReader());
    const streamResult = await result.current.streamReader(response);

    expect(streamResult.content).toBe("Test");
    expect(streamResult.error).toBeNull();
  });
});
