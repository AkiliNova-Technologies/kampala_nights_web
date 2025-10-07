import * as React from "react";
import {
  Building2,
  CalendarDays,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  Flame,
  HelpCircleIcon,
  Landmark,
  LayoutDashboardIcon,
  LogOut,
  Megaphone,
  MessageCircleQuestionMark,
  SearchIcon,
  SettingsIcon,
  Shield,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Businesses",
      url: "/admin/businesses",
      icon: Building2,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Users Roles",
      url: "/admin/users-management",
      icon: Users,
    },
    {
      title: "Campaigns",
      url: "/admin/campaigns",
      icon: Megaphone,
    },
    {
      title: "Hot and Cold",
      url: "/admin/hot-and-cold",
      icon: Flame,
    },
    {
      title: "Revenue",
      url: "/admin/revenue",
      icon: Landmark,
    },
    {
      title: "Moderation",
      url: "/admin/moderation",
      icon: Shield,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: MessageCircleQuestionMark,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
  navUser: [
    {
      title: "Sign Out",
      url: "#",
      icon: LogOut,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 [&_span]:text-white hover:[&_span]:text-white hover:border-0 hover:bg-transparent"
            >
              {/* <img src="" alt="" className="h-6 w-6" /> */}
              <span className="text-base font-semibold">Logo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser items={data.navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
