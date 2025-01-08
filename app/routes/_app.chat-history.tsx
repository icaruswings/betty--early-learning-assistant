import { useUser } from "@clerk/remix";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@remix-run/react";
import { usePageHeader } from "~/hooks/use-page-header";
import { MessageSquare, MessageSquareMore, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

export default function ChatHistory() {
  const { user } = useUser();
  const userId = user?.id;

  const { setTitle, setIcon } = usePageHeader();
  useEffect(() => {
    setIcon(MessageSquare);
    setTitle("Chat History");

    return () => {
      setIcon(null);
      setTitle("");
    };
  }, [setTitle, setIcon]);

  const recentChats = usePaginatedQuery(
    api.chats.getRecentConversations,
    userId ? { userId } : "skip",
    { initialNumItems: 20 }
  );

  const rename = useMutation(api.chats.renameConversation);
  const deleteChat = useMutation(api.chats.deleteConversation);

  const [renamingChat, setRenamingChat] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  if (recentChats.status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

  const handleRename = async () => {
    if (!renamingChat) return;

    try {
      await rename({
        conversationId: renamingChat.id as any,
        title: renamingChat.title,
      });
      toast.success("Conversation renamed");
    } catch (error) {
      toast.error("Failed to rename conversation");
    }
    setRenamingChat(null);
  };

  const handleDelete = async () => {
    if (!deletingChatId) return;

    try {
      await deleteChat({
        conversationId: deletingChatId as any,
      });
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
    setDeletingChatId(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {recentChats.results?.map((chat) => (
            <div
              key={chat._id}
              className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link to={`/chat/${chat._id}`} className="flex-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-card-foreground">{chat.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(chat.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {chat.latestMessage && (
                  <div className="mt-2">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      <span className="font-medium text-card-foreground">
                        {chat.latestMessage.role === "assistant" ? "Betty" : "You"}:{" "}
                      </span>
                      {chat.latestMessage.content}
                    </p>
                  </div>
                )}
              </Link>

              <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                <Link to={`/chat/${chat._id}`} className="flex items-center hover:text-foreground">
                  <MessageSquareMore className="mr-1.5 h-4 w-4" />
                  {chat.latestMessage ? "Continue conversation" : "Start chatting"}
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setRenamingChat({ id: chat._id, title: chat.title })}
                    >
                      <PencilLine className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeletingChatId(chat._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {recentChats.results?.length === 0 && (
            <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
              <h3 className="text-lg font-medium text-card-foreground">No conversations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new conversation to get help with your early childhood education questions
              </p>
              <div className="mt-6">
                <Link
                  to="/chat"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                >
                  Start a new conversation
                </Link>
              </div>
            </div>
          )}

          {recentChats.status === "CanLoadMore" && (
            <div className="mt-4 text-center">
              <button
                onClick={() => recentChats.loadMore(20)}
                className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
              >
                Load more conversations
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!renamingChat} onOpenChange={() => setRenamingChat(null)}>
        <DialogContent className="sm:max-w-[425px] flex flex-col gap-0">
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>Enter a new title for this conversation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={renamingChat?.title ?? ""}
              onChange={(e) =>
                setRenamingChat((prev) => (prev ? { ...prev, title: e.target.value } : null))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingChat(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingChatId} onOpenChange={() => setDeletingChatId(null)}>
        <DialogContent className="sm:max-w-[425px] flex flex-col gap-0">
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDeletingChatId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
