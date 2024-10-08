"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import ChatComponent from "@/components/chatComponent";
import UploadComponent from "@/components/uploadComponent";
import ChatHistoryComponent from "@/components/chat-history";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    background: {
      default: "#ffffff",
    },
  },
});

const drawerWidth = 300;
const uploadDrawerWidth = 350;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
  uploadOpen?: boolean;
}>(({ theme, open, uploadOpen }) => ({
  flexGrow: 1,
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  marginRight: 0,
  ...(open && {
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(uploadOpen && {
    marginRight: `${uploadDrawerWidth}px`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Component() {
  const [contexts, setContexts] = useState<string[]>([]);
  const [loadingContexts, setLoadingContexts] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isSmallScreen);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(!isSmallScreen);

  const fetchContexts = async () => {
    try {
      const response = await fetch("/api/contexts");
      if (!response.ok) throw new Error("Failed to fetch contexts");
      const data = await response.json();
      console.log("Fetched contexts:", data);
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
      setLoadingContexts(false);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  useEffect(() => {
    setIsDrawerOpen(!isSmallScreen);
    setIsUploadDrawerOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleUploadDrawerToggle = () => {
    setIsUploadDrawerOpen(!isUploadDrawerOpen);
  };

  const handleUploadSuccess = () => {
    fetchContexts();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="flex h-screen overflow-hidden bg-white">
        <AppBar
          position="fixed"
          sx={{
            width: {
              sm: `calc(100% - ${drawerWidth}px - ${uploadDrawerWidth}px)`,
            },
            ml: { sm: `${drawerWidth}px` },
            mr: { sm: `${uploadDrawerWidth}px` },
          }}
          color="transparent"
          elevation={0}
          className="backdrop-blur-md bg-white bg-opacity-70"
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              VoicEraCX Chat
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open upload drawer"
              edge="end"
              onClick={handleUploadDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#f7f7f8",
            },
          }}
        >
          <Toolbar />
          <ChatHistoryComponent />
        </Drawer>
        <Main
          open={isDrawerOpen && !isSmallScreen}
          uploadOpen={isUploadDrawerOpen && !isSmallScreen}
        >
          <Toolbar />
          <Box className="relative flex-grow overflow-hidden flex items-center justify-center">
            <DotPattern
              className={cn(
                "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]"
              )}
            />
            <Box className="relative z-10 w-full max-w-4xl h-full overflow-auto p-4">
              <ChatComponent
                contexts={contexts}
                loadingContexts={loadingContexts}
              />
            </Box>
          </Box>
        </Main>
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          anchor="right"
          open={isUploadDrawerOpen}
          onClose={handleUploadDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: uploadDrawerWidth,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <UploadComponent onUploadSuccess={handleUploadSuccess} />
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
