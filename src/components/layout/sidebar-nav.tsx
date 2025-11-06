"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
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
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/offers", label: "Offer Management", icon: Ticket },
  { href: "/orders", label: "Order Management", icon: ShoppingCart },
  { href: "/offer-composer", label: "Offer Composer", icon: Layers },
  { href: "/fares", label: "Fare Management", icon: DollarSign },
  { href: "/analytics", label: "Analytics & Simulation", icon: BarChart3 },
  { href: "/offer-rules", label: "Offer Rule Builder", icon: FileJson },
  { href: "/pricing/dynamic", label: "Dynamic Pricing", icon: DollarSign },
  { href: "/pricing/ancillary", label: "Ancillary Pricing", icon: Container },
  { href: "/channels", label: "Channel Management", icon: RadioTower },
  { href: "/inventory", label: "Flight & Inventory", icon: Plane },
  { href: "/catalog", label: "Catalogue", icon: BookOpen },
  { href: "/corporate", label: "Corporate Contracts", icon: Briefcase },
  { href: "/atpco", label: "ATPCO Integration", icon: Plane },
];

export default function SidebarNav() {
  const pathname = usePathname();

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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton 
                isActive={pathname.startsWith('/settings')}
                tooltip={{children: 'Settings', side: 'right'}}
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
