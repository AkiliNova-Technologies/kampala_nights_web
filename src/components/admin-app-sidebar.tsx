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
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import dashboardLogo from "@/assets/images/favicon.png";

const data = {
  navHeader: [
    {
      title: "KAMPALA NIGHTS",
      logo: dashboardLogo,
    },
  ],
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
      url: "/login",
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

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="p-0">
      <SidebarHeader>
              <NavHeader items={data.navHeader} />
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
