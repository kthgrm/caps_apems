import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, ChevronsRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => (
                    item.isDropdown ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            className="group/collapsible"
                            defaultOpen={page.url.startsWith(item.href)}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton isActive={page.url.startsWith(item.href)} tooltip={item.title} className="data-[active=true]:text-sidebar-accent-foreground">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.subItems?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild size="md" isActive={page.url === subItem.href} className="data-[active=true]:text-sidebar-accent-foreground">
                                                    <Link href={subItem.href} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : item.isGroup ? (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip={item.title} className="text-sm">
                                    {item.icon && <item.icon size={16} />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        subItem.isDropdown ? (
                                            <Collapsible
                                                key={subItem.title}
                                                asChild
                                                className="group/collapsible"
                                                defaultOpen={page.url.startsWith(subItem.href)}
                                            >
                                                <SidebarMenuSubItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuSubButton size="md" isActive={page.url.startsWith(subItem.href)} className="data-[active=true]:text-sidebar-accent-foreground">
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuSubButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {subItem.subItems?.map((nestedItem) => (
                                                                <SidebarMenuSubItem key={nestedItem.title}>
                                                                    <SidebarMenuSubButton asChild isActive={page.url === nestedItem.href} className="data-[active=true]:text-sidebar-accent-foreground">
                                                                        <Link href={nestedItem.href} prefetch>
                                                                            {nestedItem.icon && <nestedItem.icon />}
                                                                            <span>{nestedItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuSubItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild size="md" isActive={page.url === subItem.href} className="data-[active=true]:text-sidebar-accent-foreground">
                                                    <Link href={subItem.href} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )
                                    ))}
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenuItem>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }} className="data-[active=true]:text-sidebar-accent-foreground">
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
