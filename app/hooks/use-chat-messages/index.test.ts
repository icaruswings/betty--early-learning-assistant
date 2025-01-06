import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { ChatService } from "~/services/chat-service";
import { useStreamReader } from "../use-stream-reader";
import { useChatMessages } from "../use-chat-messages";

// Suppress console.error during tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Mock dependencies
vi.mock("~/services/chat-service", () => ({
  ChatService: {
    sendMessage: vi.fn(),
  },
}));

vi.mock("./use-stream-reader", () => ({
  useStreamReader: vi.fn(),
}));

describe("useChatMessages", () => {
  const mockStreamReader = vi.fn();
  const mockCallbacks = {
    onMessageStart: vi.fn(),
    onMessageStream: vi.fn(),
    onMessageComplete: vi.fn(),
    onMessageError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useStreamReader as any).mockReturnValue({ streamReader: mockStreamReader });
    // Set up default successful response
    mockStreamReader.mockResolvedValue({ content: "AI response", error: null });
    (ChatService.sendMessage as any).mockResolvedValue(new Response());
  });

  it("should call onMessageStart when sending a message", async () => {
    const { result } = renderHook(() =>
      useChatMessages({
        messages: [],
        model: "gpt-4o",
        ...mockCallbacks,
      })
    );

    await result.current.sendMessage("Hello");
    expect(mockCallbacks.onMessageStart).toHaveBeenCalledWith("Hello");
  });

  it("should handle successful message streaming", async () => {
    const { result } = renderHook(() =>
      useChatMessages({
        messages: [],
        model: "gpt-4o",
        ...mockCallbacks,
      })
    );

    await result.current.sendMessage("Hello");

    await waitFor(() => {
      expect(ChatService.sendMessage).toHaveBeenCalledWith(
        [{ role: "user", content: "Hello" }],
        "gpt-4o"
      );
      expect(mockStreamReader).toHaveBeenCalledWith(expect.any(Response), {
        onChunk: expect.any(Function),
        onComplete: expect.any(Function),
      });
      expect(mockCallbacks.onMessageError).not.toHaveBeenCalled();
    });
  });

  it("should handle streaming error", async () => {
    mockStreamReader.mockResolvedValue({ content: "", error: "Stream error" });

    const { result } = renderHook(() =>
      useChatMessages({
        messages: [],
        model: "gpt-4o",
        ...mockCallbacks,
      })
    );

    await result.current.sendMessage("Hello");

    await waitFor(() => {
      expect(mockCallbacks.onMessageError).toHaveBeenCalledWith("Stream error");
    });
  });

  it("should handle API error", async () => {
    const error = new Error("API error");
    (ChatService.sendMessage as any).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useChatMessages({
        messages: [],
        model: "gpt-4o",
        ...mockCallbacks,
      })
    );

    await result.current.sendMessage("Hello");

    await waitFor(() => {
      expect(mockCallbacks.onMessageError).toHaveBeenCalledWith("API error");
    });
  });

  it("should include existing messages when sending new message", async () => {
    const existingMessages = [
      { role: "user" as const, content: "Previous message" },
      { role: "assistant" as const, content: "Previous response" },
    ];

    const { result } = renderHook(() =>
      useChatMessages({
        messages: existingMessages,
        model: "gpt-4o",
        ...mockCallbacks,
      })
    );

    await result.current.sendMessage("Hello");

    await waitFor(() => {
      expect(ChatService.sendMessage).toHaveBeenCalledWith(
        [...existingMessages, { role: "user", content: "Hello" }],
        "gpt-4o"
      );
    });
  });

  it("should call streaming callbacks in correct order", async () => {
    const callOrder: string[] = [];
    const trackingCallbacks = {
      onMessageStart: vi.fn().mockImplementation(() => callOrder.push("start")),
      onMessageStream: vi.fn().mockImplementation(() => callOrder.push("stream")),
      onMessageComplete: vi.fn().mockImplementation(() => callOrder.push("complete")),
      onMessageError: vi.fn(),
    };

    mockStreamReader.mockImplementation(async (_, { onChunk, onComplete }) => {
      onChunk("Chunk 1");
      onChunk("Chunk 2");
      onComplete();
      return { content: "Complete response", error: null };
    });

    const { result } = renderHook(() =>
      useChatMessages({
        messages: [],
        model: "gpt-4o",
        ...trackingCallbacks,
      })
    );

    await result.current.sendMessage("Hello");

    await waitFor(() => {
      expect(trackingCallbacks.onMessageStart).toHaveBeenCalledWith("Hello");
      expect(trackingCallbacks.onMessageStream).toHaveBeenCalledWith("Chunk 1");
      expect(trackingCallbacks.onMessageStream).toHaveBeenCalledWith("Chunk 2");
      expect(trackingCallbacks.onMessageComplete).toHaveBeenCalled();
      expect(callOrder).toEqual(["start", "stream", "stream", "complete"]);
    });
  });
});
