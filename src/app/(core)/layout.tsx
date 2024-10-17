import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

          <body className="">
             <TooltipProvider>
              {children}    
          </TooltipProvider>
              
      </body>
    </html>
  );
}