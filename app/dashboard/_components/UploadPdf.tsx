"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, File, X } from 'lucide-react'

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadPdf({ isOpen, onClose }: UploadDialogProps) {
  const [files, setFiles] = useState<File[]>([])
  const [fileName, setFileName] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name.replace(/\.[^/.]+$/, "")) 
    }
  }, [])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleUpload = () => {
    if (fileName.trim() === "") return
    // Handle file upload logic here
    console.log("Uploading file:", { name: fileName, file: files[0] })
    // Reset state and close dialog after upload
    setFiles([])
    setFileName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Drag and drop a PDF file here or click to select one.
          </DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
            isDragActive ? "border-primary" : "border-muted-foreground"
          }`}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <File className="h-6 w-6 mr-2" />
                <span className="text-sm">{files[0].name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setFiles([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drop your PDF file here or click to browse
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="fileName">File Name</Label>
          <Input
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            required
          />
        </div>
        <Button onClick={handleUpload} disabled={files.length === 0} className="mt-4">
          Upload PDF
        </Button>
      </DialogContent>
    </Dialog>
  )
}

