// 'use client';

// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useRouter } from 'next/navigation';

// export default function Header() {
//   const router = useRouter();

//   return (
//     <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 backdrop-blur-sm lg:px-6">
//       <SidebarTrigger className="md:hidden" />

//       <div className="flex w-full items-center justify-end">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="relative h-9 w-9 rounded-full"
//               >
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIzNzk2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="User" data-ai-hint="person portrait" />
//                   <AvatarFallback>U</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">
//                     Guest User
//                   </p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     guest@example.com
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Profile</DropdownMenuItem>
//               <DropdownMenuItem>Settings</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//       </div>
//     </header>
//   );
// }



'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/onboarding/airlines': {
    title: 'Airline Onboarding',
    description: 'Map carrier PSS systems to ecosystem airport nodes.',
  },
  '/onboarding/airports': {
    title: 'Airport Onboarding',
    description: 'Manage participating airports and configure SITA hardware/carrier permissions.',
  },
  '/onboarding/partners': {
    title: 'Partner Onboarding',
    description: 'Manage authorized ecosystem vendors and their terminal deployments.',
  },
  '/pricing/ancillary':{
    title: "Airline Ancillary Master",
    description: "Manage core master details, categorization, and ownership for carrier-specific ancillaries.",
  },
  '/ancillary-products':{
    title:"Airport Ancillary Catalogue",
    description:"Manage exhaustive partner-driven hub services, terminal placement, and SLA governance.",
  },
  '/inventory/airline':{
    title:"Airline Ancillary Inventory",
    description:"Exhaustive stock control for carrier-specific ancillaries and real-time PSS synchronization.",
  },
  '/inventory/airport':{
    title:"Airport Ancillary Inventory",
    description:"Manage localized hub capacity and real-time vendor system synchronization.",
  },
  '/offers/ancillary-aggregates':{
    title:"Airline Ancillary Aggregate",
    description:"Manage exhaustive logic parameters and aggregate values for carrier services.",
  },
  '/offers/cohorts':{
    title:"Airline Cohorts",
    description:"Manage logical segments for targeted carrier-specific retailing orchestration.",
  },
  '/bundles':{
    title:"Airline Offers Cockpit",
    description:"Carrier Retailing & Dynamic Monetization Engine"
  },
  '/offers/airport-ancillary-aggregates':{
    title:"Airport Ancillary Aggregate",
    description:"Manage exhaustive logic parameters and aggregate values for hub-specific ecosystem services.",
  },
  '/offers/airport-cohorts':{
    title:"Airport Cohorts",
    description:"Manage logical segments for targeted hub-specific retailing and service orchestration.",
  },
  '/offers/airport-bundles':{
    title:"Airport Offers Cockpit",
    description:"Hub Retailing & Capacity-Based Monetization",
  },
  '/orders/stock-keeper':{
    title:"Airline Stock Keeper",
    description:"Operational Fulfillment & Availability Governance",
  },
  '/orders/airport-stock-keeper':{
    title:"Airport Stock Keeper",
    description:"Hub Fulfillment & Resource Orchestration",
  },
  '/orders':{
    title:"Order Management Console",
    description:"Unified oversight for ecosystem conversions, touchpoint attribution, and PSS fulfillment.",
  }
};

export default function Header() {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { title: '', description: '' };

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background px-4 backdrop-blur-sm lg:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex w-full items-center justify-between">
        {/* Left — Page Title & Description */}
        <div className="flex flex-col gap-1">
          {meta.title && (
            <h1 className="text-[22px] font-bold tracking-tight leading-none text-foreground">
              {meta.title}
            </h1>
          )}
          {meta.description && (
            <p className="text-[15px] text-muted-foreground">{meta.description}</p>
          )}
        </div>

        {/* Right — Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIzNzk2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="User"
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Guest User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  guest@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}