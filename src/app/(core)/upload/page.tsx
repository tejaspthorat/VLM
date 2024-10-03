'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { 
  Button, 
  TextField, 
  IconButton, 
  Typography, 
  Box, 
  Container, 
  Paper,
  AppBar,
  Toolbar
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingAnimation from '../../../components/LoadingAnimation'
import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
    },
  },
})

interface ContextItem {
  contextId: string;
  urls: string[];
}

export default function DocumentUploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [contextList, setContextList] = useState<ContextItem[]>([{ contextId: '', urls: [''] }])
  const router = useRouter()

  const addNewContext = () => {
    setContextList([...contextList, { contextId: '', urls: [''] }])
  }

  const addNewUrl = (index: number) => {
    const newContextList = [...contextList]
    newContextList[index].urls.push('')
    setContextList(newContextList)
  }

  const handleContextIdChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newContextList = [...contextList]
    newContextList[index].contextId = e.target.value
    setContextList(newContextList)
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, contextIndex: number, urlIndex: number) => {
    const newContextList = [...contextList]
    newContextList[contextIndex].urls[urlIndex] = e.target.value
    setContextList(newContextList)
  }

  const removeUrl = (contextIndex: number, urlIndex: number) => {
    const newContextList = [...contextList]
    newContextList[contextIndex].urls.splice(urlIndex, 1)
    setContextList(newContextList)
  }

  const removeContext = (contextIndex: number) => {
    const newContextList = [...contextList]
    newContextList.splice(contextIndex, 1)
    setContextList(newContextList)
  }

  const handleUpload = async () => {
    setIsUploading(true)

    try {
      const formData = {
        contextList
      }

      const response = await fetch('/api/uploadPdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log('Form data submitted successfully')
        router.push("/chat")
      } else {
        console.error('Error submitting form data')
      }

      setIsUploading(false)
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Error uploading data')
      setIsUploading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="relative min-h-screen w-full flex flex-col bg-white">
        <AppBar position="fixed" color="transparent" elevation={0} className="backdrop-blur-md bg-white bg-opacity-70">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              VoicEraCX
            </Typography>
            <Button color="primary">About</Button>
            <Button color="primary">Services</Button>
            <Button color="primary">Contact</Button>
          </Toolbar>
        </AppBar>
        <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]")} />
        <Container maxWidth="md" className="mt-24 mb-12 relative z-10">
          <Typography variant="h4" component="h1" align="center" gutterBottom className="text-black mb-4">
            Start the Process by Adding Context IDs
          </Typography>

          <Paper elevation={3} className="bg-white p-8 shadow-lg rounded-xl">
            <Box>
              {contextList.map((context, contextIndex) => (
                <Box key={contextIndex} className="mt-6">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" className="text-black mb-2">
                      Context ID {contextIndex + 1}
                    </Typography>
                    <IconButton onClick={() => removeContext(contextIndex)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Context ID"
                    value={context.contextId}
                    onChange={(e) => handleContextIdChange(e, contextIndex)}
                    variant="outlined"
                    margin="normal"
                  />
                  {context.urls.map((url, urlIndex) => (
                    <Box key={urlIndex} display="flex" alignItems="center" marginBottom={1}>
                      <TextField
                        fullWidth
                        placeholder="URL"
                        value={url}
                        onChange={(e) => handleUrlChange(e, contextIndex, urlIndex)}
                        variant="outlined"
                        margin="dense"
                      />
                      <IconButton onClick={() => removeUrl(contextIndex, urlIndex)} size="small" className="ml-2">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => addNewUrl(contextIndex)}
                    className="mt-2"
                  >
                    Add URL
                  </Button>
                </Box>
              ))}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addNewContext}
                className="mt-4"
              >
                Add Context ID
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4"
            >
              {isUploading ? 'Uploading...' : 'Submit'}
            </Button>
            {isUploading && <LoadingAnimation />}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}