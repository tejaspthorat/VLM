"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ChatMessage {
  role: string;
  content: string;
}

export default function ChatComponent() {
  const [selectedContext, setSelectedContext] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contexts, setContexts] = useState<string[]>([]);
  const [isLoadingContexts, setIsLoadingContexts] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchContexts = async () => {
    if (contexts.length === 0 && !isLoadingContexts) {
      setIsLoadingContexts(true);
      try {
        const response = await fetch("/api/contexts");
        if (!response.ok) throw new Error("Failed to fetch contexts");
        const data = await response.json();
        if (data && Array.isArray(data.contexts.users)) {
          setContexts(data.contexts.users);
        } else {
          console.error("Unexpected data structure:", data);
          setContexts([]);
        }
      } catch (error) {
        console.error("Error fetching contexts:", error);
        setContexts([]);
      } finally {
        setIsLoadingContexts(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && selectedContext) {
      setIsLoading(true);
      const newMessage = { role: "user", content: inputMessage };
      setChatHistory((prev) => [...prev, newMessage]);

      try {
        const response = await fetch(
          "http://ec2-3-222-101-98.compute-1.amazonaws.com:8000/search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              call_sid: "playground",
              user_id: selectedContext,
              message: inputMessage,
            }),
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.completion },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
        setInputMessage("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-none p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          VoicEraCX Chat
        </h1>
      </div>
      <div className="flex-grow flex flex-col p-4 space-y-4 overflow-hidden">
        <Select
          value={selectedContext}
          onValueChange={setSelectedContext}
          onOpenChange={(open) => {
            if (open) {
              fetchContexts();
            }
          }}
        >
          <SelectTrigger className="w-full bg-white border border-gray-300">
            <SelectValue placeholder="Select Context" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300">
            {isLoadingContexts ? (
              <SelectItem value="loading">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading contexts...
              </SelectItem>
            ) : contexts.length === 0 ? (
              <SelectItem value="no-contexts">No contexts available</SelectItem>
            ) : (
              contexts.map((context) => (
                <SelectItem key={context} value={context}>
                  {context}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto space-y-4 pr-4"
        >
          <AnimatePresence>
            {chatHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 shadow"
                  }`}
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex-none flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message here..."
            disabled={!selectedContext || isLoading}
            className="flex-grow bg-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!selectedContext || isLoading || !inputMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
