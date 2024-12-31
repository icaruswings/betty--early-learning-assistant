// import { MessageSquare, Book, Settings, Menu, PanelLeftOpen, PanelLeftClose } from "lucide-react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { cn } from "~/lib/utils";
// import { Button } from "~/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
// import { HTMLAttributes, useState } from "react";
// import { NavLink } from "@remix-run/react";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";

// const sidebarItems = [
//   {
//     title: "Ask Betty",
//     icon: MessageSquare,
//     href: "/chat",
//   },
//   {
//     title: "Learning",
//     icon: Book,
//     href: "/learning",
//   },
//   {
//     title: "Settings",
//     icon: Settings,
//     href: "/settings",
//   },
// ];

// export function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(true);

//   const toggleExpanded = () => {
//     if (size === "large") {
//       setIsExpanded(!isExpanded);
//     }
//   };

//   const sidebarContent = (
//     <aside>
//       <div
//         className={cn(sidebarVariants({ size }), className)}
//         data-expanded={isExpanded}
//         {...props}
//       >
//         <div className="space-y-1 px-4">
//           <div className="flex justify-between items-center px-4 py-2">
//             <h2 className="text-lg font-semibold tracking-tight text-center">
//               {isExpanded ? "Betty" : "B"}
//             </h2>
//           </div>

//           {sidebarItems.map((item) => (
//             <NavLink
//               key={item.href}
//               to={item.href}
//               end={true}
//               className={cn(
//                 "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
//                 isExpanded ? "justify-start" : "justify-center"
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {isExpanded && <span className="ml-2">{item.title}</span>}
//             </NavLink>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col items-start p-4">
//         {size === "large" && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               toggleExpanded();
//             }}
//           >
//             {isExpanded ? (
//               <PanelLeftClose className="h-6 w-6" />
//             ) : (
//               <PanelLeftOpen className="h-6 w-6" />
//             )}

//             <span className="sr-only">Toggle Sidebar</span>
//           </Button>
//         )}

//         <SignedIn>
//           <UserButton />
//         </SignedIn>

//         <SignedOut>
//           <SignInButton>Sign In</SignInButton>
//         </SignedOut>
//       </div>
//     </aside>
//   );

//   if (size === "default") {
//     return (
//       <Sheet open={isOpen} onOpenChange={setIsOpen}>
//         <SheetTrigger asChild>
//           <Button
//             variant="ghost"
//             className="md:hidden"
//             size="icon"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <Menu className="h-6 w-6" />
//             <span className="sr-only">Toggle Sidebar</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="p-0 w-64">
//           {sidebarContent}
//         </SheetContent>
//       </Sheet>
//     );
//   }

//   return sidebarContent;
// }

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import { Binoculars, Book, Home, LogIn, MessageSquare, Settings } from "lucide-react";
import { useMemo } from "react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useTheme } from "remix-themes";
import { dark } from "@clerk/themes";
import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import Logo from "./logo";

export function AppSidebar() {
  const [theme] = useTheme();
  const { open, state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo />
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
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/learning/stories">
                    <Book />
                    <span>Stories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="border-t">
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/chat">
                    <MessageSquare />
                    <span>Ask Betty</span>
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
      <SidebarFooter>
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                userButtonBox: {
                  flexDirection: "row-reverse",
                  flexShrink: "0",
                },
              },
            }}
            showName={true}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <Button variant="ghost" className="justify-start">
              <LogIn />
              <span>Sign In</span>
            </Button>
          </SignInButton>
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  );
}
