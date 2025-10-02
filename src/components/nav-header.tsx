import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavHeader({
  items,
}: {
  items: {
    title: string;
    icon?: LucideIcon;
    logo?: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu></SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="h-11 text-white rounded-none hover:bg-transparent translated-x-0 hover:border-0"
              >
                {item.icon ? (
                  <item.icon />
                ) : (
                  item.logo && (
                    <img src={item.logo} alt="" className="h-6 w-6 min-w-6" />
                  )
                )}
                <span className="text-lg">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
