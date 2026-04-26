// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   SidebarHeader,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarFooter,
//   SidebarMenuCollapsible,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
//   SidebarMenuSubButton,
//   SidebarMenuCollapsibleContent,
// } from '@/components/ui/sidebar';
// import {
//   LayoutDashboard,
//   Ticket,
//   ShoppingCart,
//   BarChart3,
//   Plane,
//   Settings,
//   ChevronRight,
//   Package,
//   Database,
//   Signal,
//   Building2,
//   MapPin,
//   QrCode,
//   Store,
//   Truck,
//   Target,
//   KeyRound,
//   Boxes,
//   Layers,
//   Archive,
// } from 'lucide-react';
// import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
// import React from 'react';

// type MenuItem = {
//   href: string;
//   label: string;
//   icon: React.ElementType;
//   subItems?: MenuItem[];
// };

// const menuItems: MenuItem[] = [
//   {
//     href: '/',
//     label: 'Main Dashboard',
//     icon: LayoutDashboard,
//   },
//   {
//     href: '/ecosystem',
//     label: 'Ecosystem Onboarding',
//     icon: Building2,
//     subItems: [
//       { href: '/onboarding/airlines', label: 'Manage Airlines', icon: Plane },
//       { href: '/onboarding/airports', label: 'Manage Airports', icon: MapPin },
//       { href: '/onboarding/partners', label: 'Manage Vendors', icon: Store },
//     ],
//   },
//   {
//     href: '/catalog',
//     label: 'Product Catalogue',
//     icon: Database,
//     subItems: [
//       { href: '/pricing/ancillary', label: 'Airline Ancillaries', icon: Plane },
//       { href: '/ancillary-products', label: 'Airport Ancillaries', icon: Store },
//     ],
//   },
//   {
//     href: '/inventory-mgmt',
//     label: 'Inventory & Stock',
//     icon: Boxes,
//     subItems: [
//       { href: '/inventory/airline', label: 'Airline Ancillary Inventory', icon: Plane },
//       { href: '/inventory/airport', label: 'Airport Ancillary Inventory', icon: Store },
//     ],
//   },
//   {
//     href: '/offers',
//     label: 'Offers & Retailing',
//     icon: Ticket,
//     subItems: [
//       {
//         href: '/offers/airline-group',
//         label: 'Airline',
//         icon: Plane,
//         subItems: [
//           { href: '/offers/ancillary-aggregates', label: 'Ancillary Aggregator', icon: Layers },
//           { href: '/offers/cohorts', label: 'Cohorts', icon: Target },
//           { href: '/bundles', label: 'Offers and Dynamic pricing', icon: Package },
//         ]
//       },
//       {
//         href: '/offers/airport-group',
//         label: 'Airport',
//         icon: Building2,
//         subItems: [
//           { href: '/offers/airport-ancillary-aggregates', label: 'Ancillary Aggregator', icon: Building2 },
//           { href: '/offers/airport-cohorts', label: 'Cohorts', icon: MapPin },
//           { href: '/offers/airport-bundles', label: 'Offers and Dynamic pricing', icon: Package },
//         ]
//       },
//       { href: '/offer-composer', label: 'Offersense Composer', icon: QrCode },
//     ],
//   },
//   {
//     href: '/orders',
//     label: 'Orders & Fulfillment',
//     icon: ShoppingCart,
//     subItems: [
//       { href: '/orders/stock-keeper', label: 'Stock Keeper (Airline)', icon: Archive },
//       { href: '/orders/airport-stock-keeper', label: 'Stock Keeper (Airport)', icon: Store },
//       { href: '/orders', label: 'Order Dashboard', icon: LayoutDashboard },
//       { href: '/orders/servicing', label: 'Order Servicing', icon: Settings },
//     ],
//   },
//   {
//     href: '/analytics',
//     label: 'Retailing Analytics',
//     icon: BarChart3,
//   },
// ];

// const settingsItems: MenuItem[] = [
//   { href: '/settings/user-management', label: 'User Management', icon: KeyRound },
//   { href: '/settings', label: 'System Settings', icon: Settings },
// ];

// export default function SidebarNav() {
//   const pathname = usePathname();

//   const isItemActive = (item: MenuItem): boolean => {
//     if (item.href === '/' && pathname === '/') return true;
//     if (item.href !== '/' && pathname.startsWith(item.href)) return true;
//     if (item.subItems) {
//       return item.subItems.some(isItemActive);
//     }
//     return false;
//   };

//   const renderNav = (items: MenuItem[], isSubmenu = false) => {
//     return items.map((item) => {
//       const Comp = isSubmenu ? SidebarMenuSubItem : SidebarMenuItem;
//       const ButtonComp = isSubmenu ? SidebarMenuSubButton : SidebarMenuButton;
//       const isActive = isItemActive(item);

//       if (item.subItems) {
//         return (
//           <Comp key={item.label} asChild>
//             <SidebarMenuCollapsible defaultOpen={isActive}>
//               <CollapsibleTrigger asChild>
//                 <ButtonComp
//                   className="group/c-trigger"
//                   isActive={isActive}
//                   tooltip={{ children: item.label, side: 'right' }}
//                 >
//                   <item.icon />
//                   <span>{item.label}</span>
//                   <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
//                 </ButtonComp>
//               </CollapsibleTrigger>
//               <SidebarMenuCollapsibleContent>
//                 <SidebarMenuSub>{renderNav(item.subItems, true)}</SidebarMenuSub>
//               </SidebarMenuCollapsibleContent>
//             </SidebarMenuCollapsible>
//           </Comp>
//         );
//       }

//       return (
//         <Comp key={item.href} asChild>
//           <Link href={item.href}>
//             <ButtonComp
//               isActive={pathname === item.href}
//               tooltip={{ children: item.label, side: 'right' }}
//             >
//               <item.icon />
//               <span>{item.label}</span>
//             </ButtonComp>
//           </Link>
//         </Comp>
//       );
//     });
//   };

//   return (
//     <>
//       <SidebarHeader>
//         <div className="flex items-center gap-2">
//           <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
//             <LayoutDashboard className="text-primary-foreground size-5" />
//           </div>
//           <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
//             Offersense
//           </span>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarMenu>{renderNav(menuItems)}</SidebarMenu>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem asChild>
//             <SidebarMenuCollapsible defaultOpen={pathname.startsWith('/settings')}>
//               <CollapsibleTrigger asChild>
//                 <SidebarMenuButton
//                   className="group/c-trigger"
//                   isActive={pathname.startsWith('/settings')}
//                   tooltip={{ children: 'Settings', side: 'right' }}
//                 >
//                   <Settings />
//                   <span>Settings</span>
//                   <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/c-trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
//                 </SidebarMenuButton>
//               </CollapsibleTrigger>
//               <SidebarMenuCollapsibleContent>
//                 <SidebarMenuSub>{renderNav(settingsItems, true)}</SidebarMenuSub>
//               </SidebarMenuCollapsibleContent>
//             </SidebarMenuCollapsible>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </>
//   );
// }



'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  BarChart3,
  Plane,
  Settings,
  ChevronRight,
  Package,
  Database,
  Building2,
  MapPin,
  Store,
  Target,
  KeyRound,
  Boxes,
  Layers,
  Archive,
} from 'lucide-react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import React from 'react';
import Logo from "../Logo/Logo";

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
      { href: '/onboarding/airlines', label: 'Manage Airlines', icon: Plane },
      { href: '/onboarding/airports', label: 'Manage Airports', icon: MapPin },
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
      {
        href: '/offers/airline-group',
        label: 'Airline',
        icon: Plane,
        subItems: [
          { href: '/offers/ancillary-aggregates', label: 'Ancillary Aggregator', icon: Layers },
          { href: '/offers/cohorts', label: 'Cohorts', icon: Target },
          { href: '/bundles', label: 'Offers and Dynamic pricing', icon: Package },
        ]
      },
      {
        href: '/offers/airport-group',
        label: 'Airport',
        icon: Building2,
        subItems: [
          { href: '/offers/airport-ancillary-aggregates', label: 'Ancillary Aggregator', icon: Building2 },
          { href: '/offers/airport-cohorts', label: 'Cohorts', icon: MapPin },
          { href: '/offers/airport-bundles', label: 'Offers and Dynamic pricing', icon: Package },
        ]
      },
      { href: '/offer-composer', label: 'Offersense Composer', icon: LayoutDashboard },
    ],
  },
  {
    href: '/orders',
    label: 'Orders & Fulfillment',
    icon: ShoppingCart,
    subItems: [
      { href: '/orders/stock-keeper', label: 'Stock Keeper (Airline)', icon: Archive },
      { href: '/orders/airport-stock-keeper', label: 'Stock Keeper (Airport)', icon: Store },
      { href: '/orders', label: 'Order Dashboard', icon: LayoutDashboard },
      { href: '/orders/servicing', label: 'Order Servicing', icon: Settings },
    ],
  },
  {
    href: '/analytics',
    label: 'Retailing Analytics',
    icon: BarChart3,
  },
];

const settingsItems: MenuItem[] = [
  { href: '/settings/user-management', label: 'User Management', icon: KeyRound },
  { href: '/settings', label: 'System Settings', icon: Settings },
];

interface SidebarNavProps {
  username?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function SidebarNav({ 
  username = "Admin User",
  userRole = "Administrator",
}: SidebarNavProps) {
  const pathname = usePathname();

  // initials from username
  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
      <style jsx global>{`
        .sidebar-nav::-webkit-scrollbar { display: none; }
        .sidebar-nav { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <aside className="flex flex-col flex-shrink-0 h-full bg-primary">
        {/* ── Brand ── */}
        <SidebarHeader className="px-4 py-[17px] min-h-[56px] flex-shrink-0 border-0">
          <div className="flex items-center gap-3">
            <div
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.4)",
              }}
            >
              <Logo
                logoConfig={{
                  link: "/",
                  maxWidth: "28px",
                  showlogo: true,
                  text: undefined,
                }}
              />
            </div>
            <span className="text-[23px] font-semibold text-white tracking-wide truncate group-data-[collapsible=icon]:hidden">
              Offersense
            </span>
          </div>
        </SidebarHeader>

        {/* ── Nav ── */}
        <SidebarContent className="sidebar-nav overflow-y-auto py-2 px-2">
          <SidebarMenu>{renderNav(menuItems)}</SidebarMenu>
        </SidebarContent>

        {/* ── Footer with Profile ── */}
        <SidebarFooter className="px-2 py-2 border-t border-white/10">
          <SidebarMenu>
            <SidebarMenuItem asChild>
              <button
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-150 group text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.2)" }}
                  >
                    <span className="text-[12px] font-bold text-white leading-none">{initials}</span>
                  </div>

                  {/* Name + role */}
                  <div className="flex flex-col gap-0 min-w-0 group-data-[collapsible=icon]:hidden">
                    <span className="text-[13px] font-semibold text-white truncate leading-tight">
                      {username}
                    </span>
                    <span className="text-[11px] text-white/50 truncate leading-tight capitalize">
                      {userRole}
                    </span>
                  </div>
                </div>
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </aside>
    </>
  );
}