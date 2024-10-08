"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingAnimation from "@/components/LoadingAnimation";

interface ContextItem {
  contextId: string;
  urls: Array<{
    type: string;
    value: string | File;
  }>;
}

interface UploadComponentProps {
  onUploadSuccess: () => void;
}

const urlTypes = ["webpage", "pdf", "doc", "txt"];

export default function UploadComponent({
  onUploadSuccess,
}: UploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [contextList, setContextList] = useState<ContextItem[]>([
    { contextId: "", urls: [{ type: "webpage", value: "" }] },
  ]);

  const addNewContext = () => {
    setContextList([
      ...contextList,
      { contextId: "", urls: [{ type: "webpage", value: "" }] },
    ]);
  };

  const addNewUrl = (index: number) => {
    const newContextList = [...contextList];
    newContextList[index].urls.push({ type: "webpage", value: "" });
    setContextList(newContextList);
  };

  const handleContextIdChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newContextList = [...contextList];
    newContextList[index].contextId = e.target.value;
    setContextList(newContextList);
  };

  const handleUrlTypeChange = (
    value: string,
    contextIndex: number,
    urlIndex: number
  ) => {
    const newContextList = [...contextList];
    newContextList[contextIndex].urls[urlIndex].type = value;
    newContextList[contextIndex].urls[urlIndex].value = "";
    setContextList(newContextList);
  };

  const handleUrlValueChange = (
    value: string | File,
    contextIndex: number,
    urlIndex: number
  ) => {
    const newContextList = [...contextList];
    newContextList[contextIndex].urls[urlIndex].value = value;
    setContextList(newContextList);
  };

  const removeUrl = (contextIndex: number, urlIndex: number) => {
    const newContextList = [...contextList];
    newContextList[contextIndex].urls.splice(urlIndex, 1);
    setContextList(newContextList);
  };

  const removeContext = (contextIndex: number) => {
    const newContextList = [...contextList];
    newContextList.splice(contextIndex, 1);
    setContextList(newContextList);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("contextList", JSON.stringify(contextList));

      contextList.forEach((context, contextIndex) => {
        context.urls.forEach((url, urlIndex) => {
          if (url.type !== "webpage" && url.value instanceof File) {
            formData.append(`file_${contextIndex}_${urlIndex}`, url.value);
          }
        });
      });

      const response = await fetch("/api/uploadPdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Form data submitted successfully");
        onUploadSuccess();
      } else {
        console.error("Error submitting form data");
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Error uploading data");
      setIsUploading(false);
    }
  };

  return (
    <Card
      sx={{
        width: 350,
        maxWidth: "100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader title="Upload Context" />
      <CardContent
        sx={{
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {contextList.map((context, contextIndex) => (
          <Box key={contextIndex} sx={{ mb: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle1">
                Context ID {contextIndex + 1}
              </Typography>
              <IconButton
                onClick={() => removeContext(contextIndex)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              placeholder="Context ID"
              value={context.contextId}
              onChange={(e) => handleContextIdChange(e, contextIndex)}
              variant="outlined"
              margin="dense"
            />
            {context.urls.map((url, urlIndex) => (
              <Box
                key={urlIndex}
                display="flex"
                alignItems="center"
                mt={1}
                mb={1}
              >
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 120, mr: 1 }}
                >
                  <InputLabel id={`url-type-label-${contextIndex}-${urlIndex}`}>
                    Type
                  </InputLabel>
                  <Select
                    labelId={`url-type-label-${contextIndex}-${urlIndex}`}
                    value={url.type}
                    onChange={(e) =>
                      handleUrlTypeChange(
                        e.target.value as string,
                        contextIndex,
                        urlIndex
                      )
                    }
                    label="Type"
                  >
                    {urlTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {url.type === "webpage" ? (
                  <TextField
                    fullWidth
                    placeholder="URL"
                    value={url.value as string}
                    onChange={(e) =>
                      handleUrlValueChange(
                        e.target.value,
                        contextIndex,
                        urlIndex
                      )
                    }
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <TextField
                    fullWidth
                    type="file"
                    onChange={(e) =>
                      handleUrlValueChange(
                        (e.target as HTMLInputElement).files?.[0] || "",
                        contextIndex,
                        urlIndex
                      )
                    }
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton component="span" size="small">
                          <CloudUploadIcon />
                        </IconButton>
                      ),
                    }}
                  />
                )}
                <IconButton
                  onClick={() => removeUrl(contextIndex, urlIndex)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addNewUrl(contextIndex)}
              size="small"
              sx={{ mt: 1 }}
            >
              Add URL
            </Button>
          </Box>
        ))}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addNewContext}
          sx={{ mt: 2 }}
        >
          Add Context ID
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpload}
          disabled={isUploading}
          sx={{ mt: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
        {isUploading && <LoadingAnimation />}
      </CardContent>
    </Card>
  );
}
