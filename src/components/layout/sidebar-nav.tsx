
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
  Plane,
  Settings,
  Layers,
  ChevronRight,
  Package,
  Database,
  BrainCircuit,
  Wand2,
  Signal,
  Building2,
  MapPin,
  QrCode,
  Store,
  Truck,
  Target,
  Megaphone,
  KeyRound,
  Boxes,
  ClipboardList,
} from 'lucide-react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import React from 'react';

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    href: '/',
    label: 'Main Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/ecosystem',
    label: 'Ecosystem Onboarding',
    icon: Building2,
    subItems: [
      { href: '/onboarding/airports', label: 'Manage Airports', icon: MapPin },
      { href: '/onboarding/airlines', label: 'Manage Airlines', icon: Plane },
      { href: '/onboarding/partners', label: 'Manage Vendors', icon: Store },
    ],
  },
  {
    href: '/catalog',
    label: 'Product Catalogue',
    icon: Database,
    subItems: [
      { href: '/pricing/ancillary', label: 'Airline Ancillaries', icon: Plane },
      { href: '/ancillary-products', label: 'Airport Ancillaries', icon: Store },
    ],
  },
  {
    href: '/inventory-mgmt',
    label: 'Inventory & Stock',
    icon: Boxes,
    subItems: [
      { href: '/inventory/airline', label: 'Airline Ancillary Inventory', icon: Plane },
      { href: '/inventory/airport', label: 'Airport Ancillary Inventory', icon: Store },
    ],
  },
  {
    href: '/offers',
    label: 'Offers & Retailing',
    icon: Ticket,
    subItems: [
      { href: '/offer-composer', label: 'Airport Offer Composer', icon: QrCode },
      { href: '/bundles', label: 'Offers & Bundles Studio', icon: Package },
      { href: '/offers/cohorts', label: 'Retailing Cohorts', icon: Target },
      { href: '/promotions', label: 'Campaigns & Promos', icon: Megaphone },
    ],
  },
  {
    href: '/orders',
    label: 'Orders & Fulfillment',
    icon: ShoppingCart,
    subItems: [
      { href: '/orders', label: 'Order Dashboard', icon: LayoutDashboard },
      { href: '/orders/servicing', label: 'Order Servicing', icon: Settings },
      { href: '/orders/delivery', label: 'Fulfillment Queue', icon: Truck },
      { href: '/service-consumption', label: 'Service Consumption', icon: Signal },
    ],
  },
  {
    href: '/analytics',
    label: 'Analytics & AI',
    icon: BarChart3,
    subItems: [
      { href: '/analytics', label: 'Retailing Analytics', icon: BarChart3 },
      { href: '/optimisation', label: 'AI Offer Optimisation', icon: Wand2 },
      { href: '/fare-change-forecast', label: 'Forecasting', icon: BrainCircuit },
    ],
  },
];

const settingsItems: MenuItem[] = [
  { href: '/settings/user-management', label: 'User Management', icon: KeyRound },
  { href: '/settings', label: 'System Settings', icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href === '/' && pathname === '/') return true;
    if (item.href !== '/' && pathname.startsWith(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some(isItemActive);
    }
    return false;
  };

  const renderNav = (items: MenuItem[], isSubmenu = false) => {
    return items.map((item) => {
      const Comp = isSubmenu ? SidebarMenuSubItem : SidebarMenuItem;
      const ButtonComp = isSubmenu ? SidebarMenuSubButton : SidebarMenuButton;
      const isActive = isItemActive(item);

      if (item.subItems) {
        return (
          <Comp key={item.label} asChild>
            <SidebarMenuCollapsible defaultOpen={isActive}>
              <CollapsibleTrigger asChild>
                <ButtonComp
                  className="group/c-trigger"
                  isActive={isActive}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
                </ButtonComp>
              </CollapsibleTrigger>
              <SidebarMenuCollapsibleContent>
                <SidebarMenuSub>{renderNav(item.subItems, true)}</SidebarMenuSub>
              </SidebarMenuCollapsibleContent>
            </SidebarMenuCollapsible>
          </Comp>
        );
      }

      return (
        <Comp key={item.href} asChild>
          <Link href={item.href}>
            <ButtonComp
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: 'right' }}
            >
              <item.icon />
              <span>{item.label}</span>
            </ButtonComp>
          </Link>
        </Comp>
      );
    });
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
            <LayoutDashboard className="text-primary-foreground size-5" />
          </div>
          <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Offersense
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{renderNav(menuItems)}</SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem asChild>
            <SidebarMenuCollapsible defaultOpen={pathname.startsWith('/settings')}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="group/c-trigger"
                  isActive={pathname.startsWith('/settings')}
                  tooltip={{ children: 'Settings', side: 'right' }}
                >
                  <Settings />
                  <span>Settings</span>
                  <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <SidebarMenuCollapsibleContent>
                <SidebarMenuSub>{renderNav(settingsItems, true)}</SidebarMenuSub>
              </SidebarMenuCollapsibleContent>
            </SidebarMenuCollapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
