"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Sidebar from "@/components/Sidebar"
import ChatComponent from "@/components/chatComponent"
import UploadComponent from "@/components/uploadComponent"
import { Button } from "@/components/ui/button"
import { Menu, Upload } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function ChatPage() {
  const [contexts, setContexts] = useState<string[]>([])
  const [loadingContexts, setLoadingContexts] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false)
  const { theme } = useTheme()

  const fetchContexts = async () => {
    try {
      const response = await fetch("/api/contexts")
      if (!response.ok) throw new Error("Failed to fetch contexts")
      const data = await response.json()
      console.log("Fetched contexts:", data)
      if (data && Array.isArray(data.contexts.users)) {
        setContexts(data.contexts.users)
      } else {
        console.error("Unexpected data structure:", data)
        setContexts([])
      }
    } catch (error) {
      console.error("Error fetching contexts:", error)
      setContexts([])
    } finally {
      setLoadingContexts(false)
    }
  }

  useEffect(() => {
    fetchContexts()
  }, [])

  const handleUploadSuccess = () => {
    fetchContexts()
  }

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
            <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-white">
              <UploadComponent onUploadSuccess={handleUploadSuccess} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl mx-auto">
            <ChatComponent contexts={contexts} loadingContexts={loadingContexts} />
          </div>
        </main>
      </div>
    </div>
  )
}