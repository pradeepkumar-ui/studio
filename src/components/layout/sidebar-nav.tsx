
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuCollapsible,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuCollapsibleContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Ticket,
  ShoppingCart,
  DollarSign,
  BarChart3,
  RadioTower,
  FileJson,
  Plane,
  BookOpen,
  Settings,
  Briefcase,
  Layers,
  Container,
  Shield,
  Gift,
  Handshake,
  CalendarDays,
  Waves,
  ChevronRight,
  Package,
  Database,
  BrainCircuit,
  Wand2,
} from 'lucide-react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import React from 'react';

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: Omit<MenuItem, 'subItems'>[];
};

const menuItems: MenuItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/offers',
    label: 'Offer Management',
    icon: Ticket,
    subItems: [
      { href: '/offers', label: 'Offer Catalogue', icon: Layers },
      { href: '/offer-composer', label: 'Composer', icon: Layers },
      { href: '/fares', label: 'Fare Management', icon: DollarSign },
      { href: '/pricing/dynamic', label: 'Dynamic Pricing', icon: DollarSign },
      {
        href: '/pricing/ancillary',
        label: 'Ancillary Pricing',
        icon: Container,
      },
      { href: '/promotions', label: 'Promotions', icon: Gift },
      { href: '/nsa', label: 'Negotiated Agreements', icon: Handshake },
      { href: '/compliance', label: 'Offer Compliance', icon: Shield },
      { href: '/disruption-waivers', label: 'Disruption Waivers', icon: Waves },
      { href: '/offer-data', label: 'Data Management', icon: Database },
    ],
  },
  {
    href: '/optimisation',
    label: 'Offer Optimisation',
    icon: Wand2,
  },
  {
    href: '/orders',
    label: 'Order Management',
    icon: ShoppingCart,
  },
  {
    href: '/catalog',
    label: 'Catalogue',
    icon: BookOpen,
    subItems: [
      { href: '/catalog', label: 'Fare Products', icon: Package },
      { href: '/corporate', label: 'Corporate Contracts', icon: Briefcase },
      { href: '/channels', label: 'Channels', icon: RadioTower },
    ]
  },
  {
    href: '/inventory',
    label: 'Stock Keeping',
    icon: Plane,
     subItems: [
      { href: '/inventory', label: 'Flight & Inventory', icon: Plane },
      { href: '/allotments', label: 'Allotments', icon: CalendarDays },
      { href: '/atpco', label: 'ATPCO', icon: Plane },
    ]
  },
  {
    href: '/analytics',
    label: 'Analytics & AI',
    icon: BarChart3,
    subItems: [
        { href: '/analytics', label: 'Offer Performance', icon: BarChart3 },
        { href: '/fare-change-forecast', label: 'Fare Change Forecast', icon: BrainCircuit },
        { href: '/offer-rules', label: 'Offer Rule Builder', icon: FileJson },
    ]
  }
];


export default function SidebarNav() {
  const pathname = usePathname();

  const isSubItemActive = (subItems: Omit<MenuItem, 'subItems'>[] | undefined) => {
    if (!subItems) return false;
    // Check if the current path is exactly one of the sub-items' hrefs.
    // This is more specific than startsWith to avoid parent-child conflicts.
    return subItems.some(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
  };
  
  const isPricingActive = () => {
    return pathname.startsWith('/pricing');
  }
  
  const isAnalyticsActive = () => {
    return pathname.startsWith('/analytics') || pathname.startsWith('/fare-change-forecast') || pathname.startsWith('/offer-rules');
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
            <Shield className="text-primary-foreground size-5" />
          </div>
          <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            OOSD
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) =>
            item.subItems ? (
              <SidebarMenuItem key={item.label} asChild>
                <SidebarMenuCollapsible
                  defaultOpen={isSubItemActive(item.subItems) || (item.href === '/catalog' && isSubItemActive(item.subItems)) || (item.href === '/inventory' && isSubItemActive(item.subItems)) || (item.label === 'Analytics & AI' && isAnalyticsActive())}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="group/c-trigger"
                      isActive={isSubItemActive(item.subItems) || (item.label === 'Analytics & AI' && isAnalyticsActive())}
                      tooltip={{ children: item.label, side: 'right' }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                      <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <SidebarMenuCollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href} asChild>
                           <Link href={subItem.href} legacyBehavior passHref>
                            <SidebarMenuSubButton
                              isActive={
                                subItem.href === '/'
                                  ? pathname === subItem.href
                                  : pathname.startsWith(subItem.href) || (subItem.href === '/pricing/dynamic' && isPricingActive())
                              }
                            >
                              <subItem.icon className={cn(
                                'transition-transform ease-in-out',
                                (pathname.startsWith(subItem.href) || (subItem.href === '/pricing/dynamic' && isPricingActive())) && 'text-primary'
                              )} />
                              <span>{subItem.label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuCollapsibleContent>
                </SidebarMenuCollapsible>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={
                      item.href === '/'
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith('/settings')}
                tooltip={{ children: 'Settings', side: 'right' }}
              >
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
