import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    exactMatch?: boolean; // Optional: if you want exact matching for specific items
  }[];
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if the current path matches the item URL
  const isActiveItem = (itemUrl: string, exactMatch?: boolean) => {
    if (exactMatch) {
      return currentPath === itemUrl;
    }
    
    // For non-exact matches, check if current path starts with item URL
    // This handles sub-routes like /events/123 being active for /events
    if (currentPath === itemUrl) {
      return true;
    }
    
    // Check if current path starts with item URL and the next character is / or it's the end
    // This prevents /event from matching /events
    return currentPath.startsWith(itemUrl + '/') || currentPath.startsWith(itemUrl + '?');
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu></SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveItem(item.url, item.exactMatch);
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white"
                    isActive={isActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}