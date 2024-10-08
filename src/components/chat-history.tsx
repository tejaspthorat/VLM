import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { ChatBubbleOutline, Add } from "@mui/icons-material";

const ChatHistoryComponent = () => {
  // This is a mock chat history. In a real application, you'd fetch this data from your backend.
  const chatHistory = [
    { id: 1, title: "Previous Chat 1", date: "2023-06-01" },
    { id: 2, title: "Previous Chat 2", date: "2023-06-02" },
    { id: 3, title: "Previous Chat 3", date: "2023-06-03" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Add />}
          sx={{
            justifyContent: "flex-start",
            borderColor: "rgba(0,0,0,0.12)",
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          New chat
        </Button>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {chatHistory.map((chat) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 1,
                m: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ChatBubbleOutline sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText
                primary={
                  <Typography noWrap variant="body2" color="text.primary">
                    {chat.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {chat.date}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatHistoryComponent;
