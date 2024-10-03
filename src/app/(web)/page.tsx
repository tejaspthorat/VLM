"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AppBar, Toolbar, Typography, Button as MuiButton } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { GlobeDemo } from '@/components/Globe'
import { cn } from "@/lib/utils"
import DotPattern from "@/components/ui/dot-pattern"
import BlurIn from "@/components/ui/blur-in"

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const MotionDiv = motion.div

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <main className="bg-white">
        <AppBar position="fixed" color="transparent" elevation={0} className="backdrop-blur-md bg-white bg-opacity-70">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              VoicEraCX
            </Typography>
            <MuiButton color="primary">About</MuiButton>
            <MuiButton color="primary">Services</MuiButton>
            <MuiButton color="primary">Contact</MuiButton>
          </Toolbar>
        </AppBar>

        <div className="z-0 relative w-full min-h-screen overflow-hidden pt-16">
          <DotPattern
            className={cn("[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]")}
          />
          <MotionDiv
            className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-64px)] space-y-6 lg:space-y-0 lg:space-x-12 px-4 lg:px-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left: Text Section */}
            <motion.div variants={itemVariants} className="lg:w-1/2">
              <BlurIn
                word="VoicEraCX"
                className="font-display text-left lg:text-left text-4xl font-bold text-black w-full max-w-3xl z-10"
                duration={1}
              />
              <motion.h2
                className="text-xl text-black text-opacity-60 tracking-normal text-left max-w-2xl z-10 mt-4"
                variants={itemVariants}
              >
                GenAI for better Customer Experience
              </motion.h2>

              <div className="z-20 mt-6">
                <Link href="/upload" passHref>
                  <MuiButton variant="contained" color="primary" size="large">
                    Get Started
                  </MuiButton>
                </Link>
              </div>
            </motion.div>

            {/* Right: Image Section */}
            <motion.div variants={itemVariants} className="lg:w-1/2">
              <div className="relative -mt-16 lg:-mt-32">
                <GlobeDemo />
              </div>
            </motion.div>
          </MotionDiv>
        </div>
      </main>
    </ThemeProvider>
  )
}