import * as React from "react";
import {
  Building2,
  CalendarDays,
  Flame,
  Landmark,
  LayoutDashboardIcon,
  LogOut,
  Megaphone,
  MessageCircleQuestionMark,
  SettingsIcon,
  Speaker,
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
import dashboardLogo1 from "@/assets/images/favicon.png";
import dashboardLogo2 from "@/assets/images/KN words.png";
import { useReduxAuth } from "@/hooks/UseReduxAuth";

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { signout } = useReduxAuth();

  const data = {
    navHeader: [
      {
        logo1: dashboardLogo1,
        logo2: dashboardLogo2,
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
        title: "Hot or Not",
        url: "/admin/hot-or-cold",
        icon: Flame,
      },
      {
        title: "Find your DJ",
        url: "/admin/find-your-dj",
        icon: Speaker,
      },
      {
        title: "Revenue",
        url: "/admin/revenue",
        icon: Landmark,
      },
      {
        title: "Helpdesk",
        url: "/admin/helpdesk",
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
        icon: LogOut,
        onPress: signout,
      },
    ],
  };

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
