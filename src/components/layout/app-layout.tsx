import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import Header from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6 bg-[hsl(var(--white))]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
