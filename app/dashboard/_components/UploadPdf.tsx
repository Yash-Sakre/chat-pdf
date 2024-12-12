"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, File, X } from "lucide-react";

import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

import axios from "axios";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadPdf({ isOpen, onClose }: UploadDialogProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const uploadfileInDB = useMutation(api.fileStorage.UploadFileData);
  const getFileurl = useMutation(api.fileStorage.getFileUrl);
  const embeddedData = useAction(api.myActions.ingest)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles);
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    setLoading(true);

    if (fileName.trim() === "") return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file[0]?.type },
      body: file[0],
    });

    const { storageId } = await result.json();
    const fileId = uuidv4();
    const fileUrl = await getFileurl({ StorageId: storageId }) as string;

    await uploadfileInDB({
      StorageId: storageId,
      fileName: fileName??'Untitled File',
      fileId: fileId,
      fileUrl:fileUrl, 
      createdBy: user?.primaryEmailAddress?.emailAddress || "unknown-user",
    });

  

    const pdfContent = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl)

    await embeddedData({
      splitText: pdfContent.data.result,
      fileId: fileId,
    })

    setFile([]);
    setFileName("");
    setLoading(false);
    onClose();
  };

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
          {file.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <File className="h-6 w-6 mr-2" />
                <span className="text-sm">{file[0].name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile([]);
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
        <Button
          onClick={handleUpload}
          disabled={file.length === 0}
          className="mt-4"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" />
            </>
          ) : (
            <div>Upload PDF</div>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
