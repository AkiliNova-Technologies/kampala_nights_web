import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export function NavUser({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    onPress?: () => void | Promise<void>;
  }[];
}) {
  const [loading, setLoading] = useState(false);

  const handlePress = async (item: any) => {
    if (item.onPress) {
      try {
        setLoading(true);
        await item.onPress();
      } catch (error) {
        console.error('Action failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.onPress ? (
                <SidebarMenuButton
                  tooltip={item.title}
                  className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white rounded-none hover:bg-[#1E293B] hover:border-0 bg-[#1E293B]"
                  onClick={() => handlePress(item)}
                  disabled={loading}
                >
                  {item.icon && <item.icon />}
                  <span>
                    {loading && item.title === "Sign Out" ? "Signing out..." : item.title}
                  </span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  className="h-11 [&_span]:text-white [&_svg]:text-white hover:[&_span]:text-white hover:[&_svg]:text-white data-[active=true]:[&_span]:text-white data-[active=true]:[&_svg]:text-white rounded-none hover:bg-[#1E293B] hover:border-0 bg-[#1E293B]"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}