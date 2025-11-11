
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
  Signal,
  Workflow,
  Palette,
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
  GitBranch,
  Target,
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
      { href: '/offers', label: 'Offers', icon: Layers },
      { href: '/offer-composer', label: 'Composer', icon: Layers },
      { href: '/optimisation', label: 'Offer Optimisation', icon: Wand2 },
      { href: '/bundles', label: 'Bundles Studio', icon: Package },
      { href: '/fares', label: 'Fare Management', icon: DollarSign },
      { href: '/pricing/filing', label: 'Fare Filing', icon: FileJson },
      {
        href: '/pricing/ancillary',
        label: 'Ancillary Pricing',
        icon: Container,
      },
       { href: '/pricing/rules', label: 'Dynamic Pricing', icon: Target },
      { href: '/promotions', label: 'Promotions & Products', icon: Gift },
      { href: '/nsa', label: 'Negotiated Agreements', icon: Handshake },
      { href: '/disruption-waivers', label: 'Disruption Waivers', icon: Waves },
    ],
  },
  {
    href: '/orders',
    label: 'Order Management',
    icon: ShoppingCart,
    subItems: [
        { href: '/orders', label: 'Order Dashboard', icon: LayoutDashboard },
        { href: '/orders/creation', label: 'Creation', icon: PlusSquare },
        { href: '/orders/delivery', label: 'Delivery', icon: Send },
        { href: '/orders/finalisation', label: 'Finalisation & Closure', icon: BadgeCheck },
        { href: '/orders/supplier-orders', label: 'Supplier Orders', icon: Building },
        { href: '/orders/large-party', label: 'Large Party Orders', icon: Users },
        { href: '/orders/servicing', label: 'Servicing', icon: GitBranch },
    ]
  },
  {
    href: '/check-in',
    label: 'Order Delivery',
    icon: Truck,
    subItems: [
        { href: '/check-in', label: 'Check-in', icon: UserCheck },
        { href: '/boarding', label: 'Boarding Gate', icon: PlaneTakeoff },
        { href: '/orders/ground-handling', label: 'Ground Handling', icon: Truck },
        { href: '/consumption', label: 'Service Consumption', icon: ClipboardCheck },
        { href: '/communication', label: 'Communication', icon: MessageSquare },
        { href: '/documentation', label: 'Documentation', icon: FileText },
    ]
  },
   {
    href: '/orchestration',
    label: 'Orchestration',
    icon: Workflow,
    subItems: [
        { href: '/orchestration', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/orchestration/create', label: 'Create Request', icon: PlusSquare },
    ]
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
    href: '/accounting',
    label: 'Accounting',
    icon: BookOpen,
    subItems: [
      { href: '/accounting', label: 'Reconciliation', icon: GitCompare },
      { href: '/invoicing', label: 'Invoicing', icon: ReceiptText },
      { href: '/payments', label: 'Payments', icon: CreditCard },
      { href: '/airline-revenue', label: 'Airline Revenue', icon: Landmark },
      { href: '/reporting', label: 'Reporting', icon: BarChartHorizontal },
    ],
  },
  { href: '/compliance', label: 'Compliance', icon: Shield },
  { href: '/offer-data', label: 'Data Management', icon: Database },
  { href: '/loyalty', label: 'Loyalty', icon: Award },
  {
    href: '/inventory',
    label: 'Stock Keeping',
    icon: Plane,
     subItems: [
      { href: '/inventory', label: 'Flight & Inventory', icon: Plane },
      { href: '/allotments', label: 'Seat Entitlements', icon: CalendarDays },
      { href: '/capacity', label: 'Capacity', icon: Signal },
      { href: '/stock-keeper', label: 'Stock Keeper', icon: Package },
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
  },
];


export default function SidebarNav() {
  const pathname = usePathname();

  const isSubItemActive = (subItems: Omit<MenuItem, 'subItems'>[] | undefined) => {
    if (!subItems) return false;
    return subItems.some(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
  };
  
  const isPricingActive = () => {
    return pathname.startsWith('/pricing');
  }
  
  const isAnalyticsActive = () => {
    return pathname.startsWith('/analytics') || pathname.startsWith('/fare-change-forecast') || pathname.startsWith('/offer-rules');
  }
  
  const isAccountingActive = () => {
    return pathname.startsWith('/accounting') || pathname.startsWith('/invoicing') || pathname.startsWith('/payments') || pathname.startsWith('/airline-revenue') || pathname.startsWith('/reporting');
  }

  const isSettingsActive = () => {
      return pathname.startsWith('/settings') || pathname.startsWith('/broker') || pathname.startsWith('/offer-construction-settings');
  }
  
  const isOrderDeliveryActive = () => {
    return pathname.startsWith('/check-in') || pathname.startsWith('/boarding') || pathname.startsWith('/consumption') || pathname.startsWith('/documentation') || pathname.startsWith('/communication') || pathname.startsWith('/orders/ground-handling');
  }
  
  const isOrchestrationActive = () => {
    return pathname.startsWith('/orchestration');
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
                  defaultOpen={isSubItemActive(item.subItems) || (item.href === '/catalog' && isSubItemActive(item.subItems)) || (item.href === '/inventory' && isSubItemActive(item.subItems)) || (item.label === 'Analytics & AI' && isAnalyticsActive()) || (item.label === 'Accounting' && isAccountingActive()) || (item.label === 'Order Delivery' && isOrderDeliveryActive()) || (item.label === 'Orchestration' && isOrchestrationActive())}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="group/c-trigger"
                      isActive={isSubItemActive(item.subItems) || (item.label === 'Analytics & AI' && isAnalyticsActive()) || (item.label === 'Accounting' && isAccountingActive()) || (item.label === 'Order Delivery' && isOrderDeliveryActive()) || (item.label === 'Orchestration' && isOrchestrationActive())}
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
                           <Link href={subItem.href}>
                            <SidebarMenuSubButton
                              isActive={
                                pathname === subItem.href || (subItem.href !== '/' && pathname.startsWith(subItem.href))
                              }
                            >
                              <subItem.icon className={cn(
                                'transition-transform ease-in-out',
                                (pathname.startsWith(subItem.href)) && 'text-primary'
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
              <SidebarMenuItem key={item.href} asChild>
                <Link href={item.href}>
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
          <SidebarMenuItem asChild>
             <SidebarMenuCollapsible
                  defaultOpen={isSettingsActive()}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="group/c-trigger"
                      isActive={isSettingsActive()}
                      tooltip={{ children: 'Settings', side: 'right' }}
                    >
                      <Settings />
                      <span>Settings</span>
                      <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <SidebarMenuCollapsibleContent>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem asChild>
                           <Link href="/broker">
                            <SidebarMenuSubButton
                              isActive={pathname.startsWith('/broker')}
                            >
                              <RadioTower className={cn('transition-transform ease-in-out', pathname.startsWith('/broker') && 'text-primary')} />
                              <span>Integrations</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem asChild>
                           <Link href="/offer-construction-settings">
                            <SidebarMenuSubButton
                              isActive={pathname.startsWith('/offer-construction-settings')}
                            >
                              <FileJson className={cn('transition-transform ease-in-out', pathname.startsWith('/offer-construction-settings') && 'text-primary')} />
                              <span>Construction Settings</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem asChild>
                           <Link href="/settings/user-management">
                            <SidebarMenuSubButton
                              isActive={pathname.startsWith('/settings/user-management')}
                            >
                              <KeyRound className={cn('transition-transform ease-in-out', pathname.startsWith('/settings/user-management') && 'text-primary')} />
                              <span>User Management</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem asChild>
                           <Link href="/settings">
                            <SidebarMenuSubButton
                              isActive={pathname === '/settings'}
                            >
                              <Settings className={cn('transition-transform ease-in-out', pathname === '/settings' && 'text-primary')} />
                              <span>General</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuCollapsibleContent>
                </SidebarMenuCollapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
