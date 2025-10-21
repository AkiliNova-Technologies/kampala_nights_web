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
  collapsed,
}: {
  items: {
    icon?: LucideIcon;
    logo1?: string;
    logo2?: string;
    title?: string;
  }[];
  collapsed?: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem key={item.logo1 || idx}>
              <SidebarMenuButton className="h-12 text-white rounded-none hover:bg-transparent translated-x-0 hover:border-0">
                {item.icon ? (
                  <item.icon />
                ) : (
                  <>
                    {!collapsed && item.logo1 ? (
                      <img
                        src={item.logo1}
                        alt=""
                        className="h-9 w-9 min-w-6"
                      />
                    ) : (
                      <img
                        src={item.logo1}
                        alt=""
                        className="h-6 w-6 min-w-6 max-h-6"
                      />
                    )}
                    {!collapsed && item.logo2 && (
                      <img
                        src={item.logo2}
                        alt=""
                        className="h-10 w-28 min-w-6 ml-1"
                      />
                    )}
                  </>
                )}
                {!collapsed && <span className="text-lg">{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
