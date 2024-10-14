import React from "react";
import {
  LayoutDashboard,
  BarChart2,
  Map,
  Activity,
  Database,
  Settings,
  HelpCircle,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
          <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
        </div>
        <span className="text-xl font-bold">VoicEraCX</span>
      </div>
      <nav>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <BarChart2 className="mr-2 h-4 w-4" />
          Performance
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Map className="mr-2 h-4 w-4" />
          Models
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Activity className="mr-2 h-4 w-4" />
          Monitoring
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Database className="mr-2 h-4 w-4" />
          Data
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">Alex Johnson</p>
            <p className="text-xs text-gray-400">AI RESEARCHER</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
