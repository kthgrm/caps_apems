import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Award, BookOpen, Building, Cpu, Folder, Handshake, LayoutGrid, Printer, School, User2 } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid,
    },
    {
        title: 'Technology Transfer', href: '/admin/technology-transfer', icon: Cpu,
    },
    {
        title: 'Project Activities', href: '#', icon: Folder, isDropdown: true,
        subItems: [
            { title: 'Impact Assessment', href: '/admin/impact-assessment' },
            { title: 'Modalities', href: '/admin/modalities' },
        ],
    },
    { title: 'International Partners', href: '/admin/international-partners', icon: Handshake },
    { title: 'Awards & Recognition', href: '/admin/awards-recognition', icon: Award },
    { title: 'Resolutions', href: '/admin/resolutions', icon: BookOpen },
    { title: 'Campus', href: '/admin/campus', icon: School },
    { title: 'College', href: '/admin/college', icon: Building },
    { title: 'Users', href: '/admin/users', icon: User2 },
    {
        title: 'Reports', href: '#', icon: Printer, isDropdown: true,
        subItems: [
            { title: 'Audit Trail', href: '/admin/report/audit-trail' },
            { title: 'Awards', href: '/admin/report/awards' },
            { title: 'Impact Assessments', href: '/admin/report/impact-assessments' },
            { title: 'International Partners', href: '/admin/report/international-partners' },
            { title: 'Modalities', href: '/admin/report/modalities' },
            { title: 'Projects', href: '/admin/report/projects' },
            { title: 'Resolutions', href: '/admin/report/resolutions' },
            { title: 'Users', href: '/admin/report/users' },
        ],
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Technology Transfer',
        href: '/user/technology-transfer',
        icon: Cpu,
    },
    {
        title: 'Project Activities', href: '#', icon: Folder, isDropdown: true,
        subItems: [
            { title: 'Impact Assessment', href: '/user/impact-assessments' },
            { title: 'Modalities', href: '/user/modalities' },
        ],
    },
    {
        title: 'International Partners',
        href: '/user/international-partners',
        icon: Handshake,
    },
    {
        title: 'Awards & Recognition',
        href: '/user/awards',
        icon: Award,
    },
];

const mainNavItems: NavItem[] = [];

export function AppSidebar() {
    const { props } = usePage();
    const user = (props.auth as { user: User }).user;
    const mainNavItems = user.is_admin ? adminNavItems : userNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={user.is_admin ? "/admin/dashboard" : "/user/dashboard"} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
