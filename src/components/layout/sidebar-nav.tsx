
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
  Waves,
  ChevronRight,
  Package,
  Database,
  BrainCircuit,
  Wand2,
  Signal,
  Award,
  Armchair,
  ClipboardCheck,
  Wrench,
  PlusSquare,
  BadgeCheck,
  Building,
  Users,
  CreditCard,
  ReceiptText,
  BarChartHorizontal,
  FileText,
  MessageSquare,
  Send,
  Archive,
  Landmark,
  GitCompare,
  KeyRound,
  UserCheck,
  PlaneTakeoff,
  Truck,
  Target,
  Megaphone,
} from 'lucide-react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import React from 'react';

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    href: '/offers',
    label: 'Offers',
    icon: Ticket,
    subItems: [
      { href: '/offers/dashboard', label: 'Offers Dashboard', icon: LayoutDashboard },
      {
        href: '/catalog',
        label: 'Catalogue',
        icon: BookOpen,
        subItems: [
          { href: '/catalog', label: 'Fare Products', icon: Package },
          {
            href: '/pricing',
            label: 'Pricing',
            icon: DollarSign,
            subItems: [
              { href: '/fares', label: 'Fares', icon: DollarSign },
              { href: '/pricing/filing', label: 'Fare Filing', icon: FileJson },
              { href: '/pricing/ancillary', label: 'Ancillaries', icon: Container },
              { href: '/pricing/seat', label: 'Seats', icon: Armchair },
            ],
          },
          { href: '/promotions', label: 'Promotions', icon: Gift },
          { href: '/loyalty-program', label: 'Loyalty Program', icon: Award },
          { href: '/corporate', label: 'Corporate Contracts', icon: Briefcase },
          { href: '/channels', label: 'Channels', icon: RadioTower },
          { href: '/nsa', label: 'Negotiated Agreements', icon: Handshake },
        ],
      },
      {
        href: '/offers',
        label: 'Offer Management',
        icon: Ticket,
        subItems: [
          { href: '/offers/cohorts', label: 'Cohorts', icon: Users },
          { href: '/bundles', label: 'Bundles Studio', icon: Package },
          { href: '/offers', label: 'Offers Config', icon: Layers },
          { href: '/pricing/rules', label: 'Dynamic Pricing', icon: Target },
          { href: '/offer-composer', label: 'Composer', icon: Layers },
          { href: '/optimisation', label: 'Offer Optimisation', icon: Wand2 },
          { href: '/disruption-waivers', label: 'Disruption Waivers', icon: Waves },
        ],
      },
      {
        href: '/inventory',
        label: 'Stock Keeping',
        icon: Plane,
        subItems: [
          { href: '/inventory', label: 'Flight & Inventory', icon: Plane },
          { href: '/atpco', label: 'ATPCO', icon: Database },
          { href: '/capacity', label: 'Capacity', icon: Signal },
          { href: '/stock-keeper', label: 'Stock Keeper', icon: Package },
        ],
      },
       {
        href: '/analytics',
        label: 'Analytics & AI',
        icon: BarChart3,
        subItems: [
          { href: '/analytics', label: 'Offer Performance', icon: BarChart3 },
          { href: '/fare-change-forecast', label: 'Fare Change Forecast', icon: BrainCircuit },
        ],
      },
      { href: '/campaigns', label: 'Campaign Management', icon: Megaphone },
    ],
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: ShoppingCart,
    subItems: [
      {
        href: '/orders',
        label: 'Order Management',
        icon: ShoppingCart,
        subItems: [
          { href: '/orders', label: 'Order Dashboard', icon: LayoutDashboard },
          { href: '/orders/creation', label: 'Creation', icon: PlusSquare },
          { href: '/orders/delivery', label: 'Delivery', icon: Send },
          { href: '/orders/finalisation', label: 'Finalisation & Closure', icon: BadgeCheck },
          { href: '/orders/servicing', label: 'Servicing', icon: Wrench },
          { href: '/orders/supplier-orders', label: 'Supplier Orders', icon: Building },
          { href: '/orders/large-party', label: 'Large Party Orders', icon: Users },
          { href: '/loyalty', label: 'Loyalty Orders', icon: Award },
        ],
      },
      {
        href: '/delivery-fulfilment',
        label: 'Delivery & Fulfilment',
        icon: Truck,
        subItems: [
          { href: '/check-in', label: 'Check-in', icon: UserCheck },
          { href: '/boarding', label: 'Boarding Gate', icon: PlaneTakeoff },
          { href: '/orders/ground-handling', label: 'Ground Handling', icon: Truck },
          { href: '/service-consumption', label: 'Service Consumption', icon: ClipboardCheck },
          { href: '/communication', label: 'Communication', icon: MessageSquare },
          { href: '/documentation', label: 'Documentation', icon: FileText },
        ],
      },
      {
        href: '/accounting',
        label: 'Accounting',
        icon: BookOpen,
        subItems: [
          { href: '/accounting', label: 'Reconciliation', icon: GitCompare },
          { href: '/payments', label: 'Payments', icon: CreditCard },
          { href: '/airline-revenue', label: 'Airline Revenue', icon: Landmark },
          { href: '/reporting', label: 'Reporting', icon: BarChartHorizontal },
        ],
      },
    ],
  },
];

const settingsItems: MenuItem[] = [
  { href: '/broker', label: 'Broker', icon: RadioTower },
  { href: '/settings/user-management', label: 'User Management', icon: KeyRound },
  { href: '/settings', label: 'General', icon: Settings },
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
              isActive={pathname === item.href || (item.href === '/' && pathname !== '/') ? false : pathname.startsWith(item.href)}
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
            <Shield className="text-primary-foreground size-5" />
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
            <SidebarMenuCollapsible defaultOpen={isItemActive({ href: '/settings', label: 'Settings', icon: Settings, subItems: settingsItems })}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="group/c-trigger"
                  isActive={isItemActive({ href: '/settings', label: 'Settings', icon: Settings, subItems: settingsItems })}
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
