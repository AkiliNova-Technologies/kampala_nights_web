import * as React from "react";
import {
  CalendarDays,
  Handshake,
  ImageIcon,
  LayoutDashboardIcon,
  LogOut,
  Megaphone,
  PartyPopper,
  SettingsIcon,
  Wallet,
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

export function BusinessAppSidebar({
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
        url: "/business/",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Events",
        url: "/business/events",
        icon: PartyPopper,
      },
      {
        title: "Calendar",
        url: "/business/calendar",
        icon: CalendarDays,
      },
      {
        title: "Reservations",
        url: "/business/reservations",
        icon: Handshake,
      },
      {
        title: "Invoices",
        url: "/business/invoices",
        icon: Wallet,
      },
      {
        title: "Gallery",
        url: "/business/gallery",
        icon: ImageIcon,
      },
      {
        title: "Promotions",
        url: "/business/promotions",
        icon: Megaphone,
      },
      {
        title: "Settings",
        url: "/business/settings",
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
