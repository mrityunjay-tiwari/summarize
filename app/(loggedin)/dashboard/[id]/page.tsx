import {AppSidebar} from "@/components/app-sidebar";
import {ResizablePanelExample} from "@/components/examples/resizable-panel";
import {AnimatedThemeToggler} from "@/components/ui/animated-theme-toggler";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {PlusIcon} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 pr-5">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex gap-2 items-baseline justify-center">
            <Button
              size={"sm"}
              className="rounded-sm bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 group"
            >
              <Link href={"/upload"} className="flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" /> Upload PDF
              </Link>
            </Button>
            <AnimatedThemeToggler />
          </div>
        </header>
        <Separator />
        <ResizablePanelExample />
      </SidebarInset>
    </SidebarProvider>
  );
}
