"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/Sidebar";
import ChatComponent from "@/components/chatComponent";
import UploadComponent from "@/components/uploadComponent";
import { Button } from "@/components/ui/button";
import { Menu, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ChatPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const { theme } = useTheme();

  const handleUploadSuccess = () => {
    // You might want to add some logic here to refresh the chat component
    // or notify the user of successful upload
    console.log("Upload successful");
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 border-b">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl font-bold">Playground</h1>
          <Sheet open={isUploadDrawerOpen} onOpenChange={setIsUploadDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Upload className="h-6 w-6" />
                <span className="sr-only">Open upload</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <UploadComponent onUploadSuccess={handleUploadSuccess} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatComponent />
        </main>
      </div>
    </div>
  );
}
