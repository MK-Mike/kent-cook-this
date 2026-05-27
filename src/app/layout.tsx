import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "~/components/ui/sonner";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Family Recipes",
  description: "Delicious meals, passed down through generations.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <main className="flex-1 overflow-hidden">{children}</main>
              </SidebarProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
