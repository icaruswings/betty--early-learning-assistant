import { UserButton } from "@clerk/remix";
import { Binoculars, Blocks, Book, Home, MessageSquare, MessageSquarePlus, Settings, History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { useTheme } from "remix-themes";
import { dark } from "@clerk/themes";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export function AppSidebar() {
  const [theme] = useTheme();
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();

  const onClick = () => {
    setOpenMobile(false);
  };

  const handleNewChat = () => {
    navigate("/chat");
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-12">
        <div className="flex items-center justify-start">
          <SidebarTrigger className="size-8 [&_svg]:size-5" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup className="border-t">
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link className="flex flex-row gap-3" to="/" onClick={onClick}>
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupLabel className="h-10">Learning</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link
                    className="flex flex-row gap-3"
                    to="/learning/observations"
                    onClick={onClick}
                  >
                    <Binoculars />
                    <span>Observations</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                      Coming Soon
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link className="flex flex-row gap-3" to="/learning/stories" onClick={onClick}>
                    <Book />
                    <span>Stories</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                      Coming Soon
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link className="flex flex-row gap-3" to="/learning/activities" onClick={onClick}>
                    <Blocks />
                    <span>Play-to-learn</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                      Coming Soon
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupLabel className="h-10">Practice Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <div className="flex w-full flex-row items-center gap-3">
                    <Link className="flex flex-1 flex-row gap-3" to="/chat" onClick={onClick}>
                      <MessageSquare />
                      <span>Ask Betty ...</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNewChat}
                      className="ml-auto size-8 shrink-0"
                      title="Start new chat"
                    >
                      <MessageSquarePlus className="size-4" />
                    </Button>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link className="flex flex-row gap-3" to="/chat-history" onClick={onClick}>
                    <History />
                    <span>Chat History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link className="flex flex-row gap-3" to="/settings" onClick={onClick}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
