
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
  Luggage,
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
          {
            href: '/promotions',
            label: 'Product Hub',
            icon: Briefcase,
            subItems: [
              { href: '/promotions', label: 'Promotions', icon: Gift },
              { href: '/ancillary-products', label: 'Ancillary Products', icon: Layers },
            ],
          },
          {
            href: '/pricing',
            label: 'Pricing',
            icon: DollarSign,
            subItems: [
              { href: '/fares', label: 'Fares', icon: DollarSign },
              { href: '/catalog', label: 'Branded Fares', icon: Package },
              { href: '/pricing/filing', label: 'Fare Filing', icon: FileJson },
              { href: '/pricing/seat', label: 'Seats', icon: Armchair },
              { href: '/pricing/rules', label: 'Dynamic Pricing', icon: Target },
            ],
          },
        ],
      },
      {
        href: '/offers',
        label: 'Offer Management',
        icon: Ticket,
        subItems: [
          { href: '/offers/cohorts', label: 'Cohorts', icon: Users },
          { href: '/bundles', label: 'Bundle Studio and Offer Creation', icon: Package },
          { href: '/group-offer-rules', label: 'Group Offer Rules', icon: Users },
          { href: '/nsa', label: 'Negotiated Space', icon: Handshake },
          { href: '/offer-composer', label: 'Composer', icon: Layers },
          { href: '/group-composer', label: 'Group Composer', icon: Users },
          { href: '/offers/automated-creation', label: 'AI Offer Configuration', icon: Wand2 },
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
          { href: '/orders/servicing', label: 'Servicing', icon: Wrench },
          { href: '/orders/supplier-orders', label: 'Supplier Orders', icon: Building },
          { href: '/orders/large-party', label: 'Large Party Orders', icon: Users },
          { href: '/loyalty', label: 'Loyalty Orders', icon: Award },
        ],
      },
      {
        href: '/delivery-fulfilment',
        label: 'Delivery &amp; Fulfilment',
        icon: Truck,
        subItems: [
          { href: '/orders/delivery', label: 'Delivery Queue', icon: Send },
          { href: '/check-in', label: 'Check-in', icon: UserCheck },
          { href: '/boarding', label: 'Boarding Gate', icon: PlaneTakeoff },
          { href: '/orders/ground-handling', label: 'Ground Handling', icon: Truck },
          { href: '/service-consumption', label: 'Service Consumption', icon: ClipboardCheck },
          { href: '/communication', label: 'Communication', icon: MessageSquare },
          { href: '/baggage', label: 'Baggage Reconciliation & Tracking', icon: Luggage },
        ],
      },
      {
        href: '/accounting',
        label: 'Accounting',
        icon: BookOpen,
        subItems: [
          { href: '/orders/finalisation', label: 'Finalisation &amp; Closure', icon: BadgeCheck },
          { href: '/payments', label: 'Payments', icon: CreditCard },
          { href: '/accounting', label: 'Reconciliation', icon: GitCompare },
          { href: '/airline-revenue', label: 'Airline Revenue', icon: Landmark },
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
            <SidebarMenuCollapsible defaultOpen={pathname.startsWith('/settings') || pathname === '/broker'}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="group/c-trigger"
                  isActive={pathname.startsWith('/settings') || pathname === '/broker'}
                  tooltip={{ children: 'Settings', side: 'right' }}
                >
                  <Settings />
                  <span>Settings</span>
                  <ChevronRight className="ml-auto size-4-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
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
