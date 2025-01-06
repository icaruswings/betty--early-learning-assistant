import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStreamReader } from "../use-stream-reader";

// Suppress console.error during tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe("useStreamReader", () => {
  // Mock ReadableStream functionality
  function createMockResponse(chunks: string[]) {
    let chunkIndex = 0;
    const mockReadable = new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => {
          controller.enqueue(new TextEncoder().encode(chunk));
        });
        controller.close();
      },
    });

    return new Response(mockReadable);
  }

  it("should handle successful streaming with single chunk", async () => {
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const mockResponse = createMockResponse(['data: {"content": "Hello, world!"}\n\n']);

    const streamResult = await result.current.streamReader(mockResponse, {
      onChunk,
      onComplete,
    });

    expect(streamResult).toEqual({
      content: "Hello, world!",
      error: null,
    });
    expect(onChunk).toHaveBeenCalledWith("Hello, world!");
    expect(onComplete).toHaveBeenCalledWith("Hello, world!");
  });

  it("should handle multiple chunks", async () => {
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const mockResponse = createMockResponse([
      'data: {"content": "Hello"}\n\n',
      'data: {"content": ", "}\n\n',
      'data: {"content": "world!"}\n\n',
    ]);

    const streamResult = await result.current.streamReader(mockResponse, {
      onChunk,
      onComplete,
    });

    expect(streamResult).toEqual({
      content: "Hello, world!",
      error: null,
    });
    expect(onChunk).toHaveBeenCalledTimes(3);
    expect(onChunk).toHaveBeenNthCalledWith(1, "Hello");
    expect(onChunk).toHaveBeenNthCalledWith(2, "Hello, ");
    expect(onChunk).toHaveBeenNthCalledWith(3, "Hello, world!");
    expect(onComplete).toHaveBeenCalledWith("Hello, world!");
  });

  it("should handle done signal", async () => {
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const mockResponse = createMockResponse([
      'data: {"content": "Hello"}\n\n',
      'data: {"done": true}\n\n',
      'data: {"content": "ignored"}\n\n',
    ]);

    const streamResult = await result.current.streamReader(mockResponse, {
      onChunk,
      onComplete,
    });

    expect(streamResult).toEqual({
      content: "Hello",
      error: null,
    });
    expect(onChunk).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("Hello");
  });

  it("should handle error in stream data", async () => {
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const mockResponse = createMockResponse([
      'data: {"content": "Hello"}\n\n',
      'data: {"error": "Stream error occurred"}\n\n',
    ]);

    const streamResult = await result.current.streamReader(mockResponse, {
      onChunk,
      onComplete,
    });

    expect(streamResult).toEqual({
      content: "Hello",
      error: "Stream error occurred",
    });
    expect(onChunk).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("should handle invalid JSON in stream", async () => {
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    const mockResponse = createMockResponse([
      'data: {"content": "Hello"}\n\n',
      "data: invalid json here\n\n",
    ]);

    const streamResult = await result.current.streamReader(mockResponse, {
      onChunk,
      onComplete,
    });

    expect(streamResult.content).toBe("Hello");
    expect(streamResult.error).toMatch(/property name|JSON/);
    expect(onChunk).toHaveBeenCalledTimes(1);
  });

  it("should handle missing response body", async () => {
    const { result } = renderHook(() => useStreamReader());
    const mockResponse = new Response(null);

    const streamResult = await result.current.streamReader(mockResponse);

    expect(streamResult).toEqual({
      content: "",
      error: "No response body",
    });
  });

  it("should handle stream read error", async () => {
    const { result } = renderHook(() => useStreamReader());
    const mockReadable = new ReadableStream({
      start(controller) {
        controller.error(new Error("Read error"));
      },
    });

    const mockResponse = new Response(mockReadable);
    const streamResult = await result.current.streamReader(mockResponse);

    expect(streamResult).toEqual({
      content: "",
      error: "Read error",
    });
  });

  it("should handle timeout", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useStreamReader());
    const onChunk = vi.fn();

    // Create a stream that returns a chunk after the timeout
    const mockReadable = new ReadableStream({
      async pull(controller) {
        const currentTime = Date.now();
        const startTime = currentTime;

        // Simulate a delayed chunk
        await new Promise((resolve) => {
          setTimeout(resolve, 11000);
        });

        controller.enqueue(new TextEncoder().encode('data: {"content": "Late data"}\n\n'));
      },
    });

    const mockResponse = new Response(mockReadable);
    const streamPromise = result.current.streamReader(mockResponse, { onChunk });

    // Run timers and wait for rejection
    await vi.runAllTimersAsync();

    const streamResult = await streamPromise;

    expect(streamResult).toEqual({
      content: "",
      error: "Stream timeout - no data received for 10 seconds",
    });
    expect(onChunk).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("should work without callbacks", async () => {
    const { result } = renderHook(() => useStreamReader());
    const mockResponse = createMockResponse([
      'data: {"content": "Hello"}\n\n',
      'data: {"content": ", world!"}\n\n',
    ]);

    const streamResult = await result.current.streamReader(mockResponse);

    expect(streamResult).toEqual({
      content: "Hello, world!",
      error: null,
    });
  });
});
