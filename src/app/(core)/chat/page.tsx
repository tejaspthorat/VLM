'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  width: '100%',
  maxWidth: 800,
  zIndex: 10,
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  justifyContent: isUser ? 'flex-end' : 'flex-start',
}));

const MessageContent = styled(Box)(({ theme, isUser }) => ({
  background: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1, 2),
  borderRadius: 20,
  maxWidth: '80%',
  wordWrap: 'break-word',
  marginLeft: isUser ? 0 : theme.spacing(1),
  marginRight: isUser ? theme.spacing(1) : 0,
}));

const ChatContainer = styled(Box)({
  height: 400,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

interface ChatMessage {
  role: string;
  content: string;
}

export default function Chat() {
  const [selectedContext, setSelectedContext] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [contexts, setContexts] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const response = await fetch('/api/contexts');
        if (!response.ok) throw new Error('Failed to fetch contexts');
        const data = await response.json();
        setContexts(data.contexts);
      } catch (error) {
        console.error('Error fetching contexts:', error);
      }
    };

    fetchContexts();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && selectedContext) {
      setIsLoading(true);
      const newMessage = { role: "user", content: inputMessage };
      setChatHistory((prev) => [...prev, newMessage]);

      try {
        const response = await fetch('https://d7f2-2402-e280-3e1b-1b4-8d7-2362-752-fb14.ngrok-free.app/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: selectedContext,
            message: inputMessage,
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, there was an error processing your request." },
        ]);
      } finally {
        setIsLoading(false);
        setInputMessage("");
      }
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <DotPattern
        className={cn("[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]")}
      />
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom align="center" style={{ color: 'black' }}>
          VoicEraCX Chat
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="context-select-label">Select Context</InputLabel>
          <Select
            labelId="context-select-label"
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value as string)}
            label="Select Context"
          >
            {contexts.map((context) => (
              <MenuItem key={context} value={context}>{context}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <ChatContainer ref={chatContainerRef}>
          <AnimatePresence>
            {chatHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble isUser={message.role === 'user'}>
                  {message.role === 'assistant' && (
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <SmartToyIcon />
                    </Avatar>
                  )}
                  <MessageContent isUser={message.role === 'user'}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
                  </MessageContent>
                </MessageBubble>
              </motion.div>
            ))}
          </AnimatePresence>
        </ChatContainer>

        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message here..."
            disabled={!selectedContext || isLoading}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            onClick={handleSendMessage}
            disabled={!selectedContext || isLoading || !inputMessage.trim()}
            style={{ marginLeft: '8px' }}
          >
            Send
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
}