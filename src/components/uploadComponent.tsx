"use client"

import React, { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ContextItem {
  contextId: string
  urls: Array<{
    type: string
    value: string | File
  }>
}

interface UploadComponentProps {
  onUploadSuccess: () => void
}

const urlTypes = ["webpage", "pdf", "doc", "txt"]

export default function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [contextList, setContextList] = useState<ContextItem[]>([
    { contextId: "", urls: [{ type: "webpage", value: "" }] },
  ])

  const addNewContext = () => {
    setContextList([...contextList, { contextId: "", urls: [{ type: "webpage", value: "" }] }])
  }

  const addNewUrl = (index: number) => {
    const newContextList = [...contextList]
    newContextList[index].urls.push({ type: "webpage", value: "" })
    setContextList(newContextList)
  }

  const handleContextIdChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newContextList = [...contextList]
    newContextList[index].contextId = e.target.value
    setContextList(newContextList)
  }

  const handleUrlTypeChange = (value: string, contextIndex: number, urlIndex: number) => {
    const newContextList = [...contextList]
    newContextList[contextIndex].urls[urlIndex].type = value
    newContextList[contextIndex].urls[urlIndex].value = ""
    setContextList(newContextList)
  }

  const handleUrlValueChange = (value: string | File, contextIndex: number, urlIndex: number) => {
    const newContextList = [...contextList]
    newContextList[contextIndex].urls[urlIndex].value = value
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
      const formData = new FormData()
      formData.append("contextList", JSON.stringify(contextList))

      contextList.forEach((context, contextIndex) => {
        context.urls.forEach((url, urlIndex) => {
          if (url.type !== "webpage" && url.value instanceof File) {
            formData.append(`file_${contextIndex}_${urlIndex}`, url.value)
          }
        })
      })

      const response = await fetch("/api/uploadPdf", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        console.log("Form data submitted successfully")
        onUploadSuccess()
      } else {
        console.error("Error submitting form data")
      }

      setIsUploading(false)
    } catch (error) {
      console.error("Error uploading:", error)
      alert("Error uploading data")
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full h-full flex flex-col bg-white"> {/* Added bg-white for white background */}
      <CardHeader>
        <CardTitle>Upload Context</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {contextList.map((context, contextIndex) => (
            <div key={contextIndex} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Context ID {contextIndex + 1}</h3>
                <Button variant="ghost" size="icon" onClick={() => removeContext(contextIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Context ID"
                value={context.contextId}
                onChange={(e) => handleContextIdChange(e, contextIndex)}
                className="mb-2"
              />
              {context.urls.map((url, urlIndex) => (
                <div key={urlIndex} className="bg-white flex items-center space-x-2 mb-2">
                  <Select
                    value={url.type}
                    onValueChange={(value) => handleUrlTypeChange(value, contextIndex, urlIndex)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {urlTypes.map((type) => (
                        <SelectItem key={type} value={type} >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {url.type === "webpage" ? (
                    <Input
                      placeholder="URL"
                      value={url.value as string}
                      onChange={(e) => handleUrlValueChange(e.target.value, contextIndex, urlIndex)}
                      className="flex-grow"
                    />
                  ) : (
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleUrlValueChange(
                          (e.target as HTMLInputElement).files?.[0] || "",
                          contextIndex,
                          urlIndex
                        )
                      }
                      className="flex-grow"
                    />
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeUrl(contextIndex, urlIndex)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addNewUrl(contextIndex)} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add URL
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <Button variant="outline" onClick={addNewContext} className="w-full mb-2">
          <Plus className="h-4 w-4 mr-2" /> Add Context ID
        </Button>
        <Button variant="default" onClick={handleUpload} disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Submit
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
