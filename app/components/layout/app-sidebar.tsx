import { UserButton } from "@clerk/remix";
import { Binoculars, Blocks, Book, Home, MessageSquare, Settings, History } from "lucide-react";
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
} from "~/components/ui/sidebar";
import { useTheme } from "remix-themes";
import { dark } from "@clerk/themes";
import { Link } from "@remix-run/react";

export function AppSidebar() {
  const [theme] = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-12">
        <div className="flex items-center justify-start">
          <SidebarTrigger className="size-8 [&_svg]:size-4" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup className="border-t">
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupLabel>Learning</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/learning/observations">
                    <Binoculars />
                    <span>Observations</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                      Coming Soon
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/learning/stories">
                    <Book />
                    <span>Stories</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                      Coming Soon
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/learning/activities">
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
            <SidebarGroupLabel>Practice Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/chat" className="flex-1">
                    <MessageSquare />
                    <span>Ask Betty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/chat-history">
                    <History />
                    <span>Previous Chats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="md:hidden">
        <UserButton
          showName
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              userButtonPopoverCard: { pointerEvents: "initial" },
              userButtonBox: { flexDirection: "row-reverse" },
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
