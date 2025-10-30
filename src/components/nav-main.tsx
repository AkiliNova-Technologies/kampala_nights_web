import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    exactMatch?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      exactMatch?: boolean;
    }[];
  }[];
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActiveItem = (itemUrl?: string, exactMatch?: boolean) => {
    if (!itemUrl) return false;
    
    if (exactMatch) {
      return currentPath === itemUrl;
    }
    
    if (currentPath === itemUrl) {
      return true;
    }
    
    return currentPath.startsWith(itemUrl + '/') || currentPath.startsWith(itemUrl + '?');
  };

  const hasSubItems = (item: typeof items[0]) => {
    return item.items && item.items.length > 0;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveItem(item.url, item.exactMatch);
            
            // If item has sub-items, render as non-navigable collapsible
            if (hasSubItems(item)) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false} // Remove the isActive dependency here
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white rounded-none hover:border-0 cursor-pointer"
                        // Remove isActive prop - parent should never show active state
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = isActiveItem(subItem.url, subItem.exactMatch);
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isSubActive} 
                                className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white rounded-none hover:border-0"
                              >
                                <Link to={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
            
            // If item has no sub-items, render as navigable button
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url!}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white rounded-none hover:border-0"
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