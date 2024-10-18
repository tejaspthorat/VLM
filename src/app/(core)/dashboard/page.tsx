"use client"

import React, { useEffect, useState } from "react";
import {
  Search,
  LayoutDashboard,
  BarChart2,
  Map,
  Activity,
  Database,
  Settings,
  HelpCircle,
  MoreVertical,
  ChevronRight,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ClientSideChart from "@/components/clientSideCharts";
import Sidebar from "@/components/Sidebar";

const tokenUsageData = [
  { name: "May", usage: 65 },
  { name: "Jun", usage: 59 },
  { name: "Jul", usage: 80 },
  { name: "Aug", usage: 81 },
  { name: "Sep", usage: 56 },
  { name: "Oct", usage: 55 },
];

const modelPerformanceData = [
  {
    id: 1,
    model: "Gemma 2b",
    type: "LANGUAGE",
    tokenUsage: 1181,
    resolutionTime: 217,
    wter: 1.5,
    bleuScore: 0.78,
    rougeScore: 0.82,
  },
  {
    id: 1,
    model: "VLM",
    type: "LANGUAGE",
    tokenUsage: 1181,
    resolutionTime: 217,
    wter: 1.5,
    bleuScore: 0.78,
    rougeScore: 0.82,
  }
];

const requestsPerChannelData = [
  { name: "Voice", value: 1500, color: "#a3e635" },
  { name: "Chat", value: 1200, color: "#e879f9" },
  { name: "Other", value: 300, color: "#c084fc" },
];

export default function AIAnalyticsDashboard() {
  const [kpiData, setKpiData] = useState({
    average_bleu_score: 0,
    average_resolution_time: 0,
    average_rouge_l_score: 0,
    average_token_usage_rate: 0,
    average_word_token_error_rate: 0
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchKPIData = async () => {
    try {
      const response = await fetch('http://ec2-3-222-101-98.compute-1.amazonaws.com:8000/calculate_kpi');
      const data = await response.json();
      setKpiData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  };

  useEffect(() => {
    fetchKPIData(); // Fetch data immediately on mount

    const intervalId = setInterval(fetchKPIData, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  const tooltipInfo = {
    tokenUsageRate: "The percentage of tokens used in relation to the total available tokens for a given model or task.",
    avgResolutionTime: "The average time taken to process and respond to a request, measured in nanoseconds.",
    wter: "Word Token Error Rate: The percentage of incorrectly tokenized words in the model's output.",
    bleuScore: "Bilingual Evaluation Understudy: A metric for evaluating the quality of machine-translated text, ranging from 0 to 1.",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Analytics Dashboard</h1>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-8 w-64" />
          </div>
        </div>
        {lastUpdated && (
          <div className="text-sm text-gray-500 mb-4">
            Last updated: {lastUpdated}
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <TooltipProvider>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Token Usage Rate
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipInfo.tokenUsageRate}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(kpiData.average_token_usage_rate * 100).toFixed(2)}%</div>
                <p className="text-xs text-green-500">+2.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Avg. Resolution Time
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipInfo.avgResolutionTime}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(kpiData.average_resolution_time * 1e9).toFixed(2)}ns</div>
                <p className="text-xs text-red-500">+15ns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">WTER</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipInfo.wter}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(kpiData.average_word_token_error_rate * 100).toFixed(2)}%</div>
                <p className="text-xs text-green-500">-0.3%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Avg. BLEU Score
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipInfo.bleuScore}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.average_bleu_score.toFixed(4)}</div>
                <p className="text-xs text-green-500">+0.02</p>
              </CardContent>
            </Card>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-8 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Token Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientSideChart
                type="line"
                data={tokenUsageData}
                dataKey="usage"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle>Requests per Channel</CardTitle>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <ClientSideChart type="pie" data={requestsPerChannelData} />
              <div className="mt-4 flex justify-center">
                <div className="text-2xl font-bold">4,000</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {requestsPerChannelData.map((channel) => (
                  <div key={channel.name} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: channel.color }}
                    ></div>
                    <span className="text-sm">{channel.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle>Model Performance</CardTitle>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">All Models</span>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>MODEL</TableHead>
                  <TableHead>TOKEN USAGE</TableHead>
                  <TableHead>RESOLUTION TIME (ms)</TableHead>
                  <TableHead>WTER (%)</TableHead>
                  <TableHead>BLEU SCORE</TableHead>
                  <TableHead>ROUGE SCORE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelPerformanceData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs">
                          {row.model.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{row.model}</div>
                          <div className="text-xs text-gray-500">
                            {row.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{row.tokenUsage}</TableCell>
                    <TableCell>{row.resolutionTime}</TableCell>
                    <TableCell>{row.wter}</TableCell>
                    <TableCell>{row.bleuScore}</TableCell>
                    <TableCell>{row.rougeScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}