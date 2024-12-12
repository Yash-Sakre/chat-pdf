"use client";

import React from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import { useParams } from "next/navigation";
import PdfViewer from "../_components/pdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChatInterface from "../_components/chat-interface";

function Workspace() {
  const { fileId } = useParams();

  const getFileData = useQuery(api.fileStorage.getFileData, {
    fileId: fileId as string,
  });

  return (
    <div>
      <div>
        {" "}
        <WorkspaceHeader />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="">
          <PdfViewer fileUrl={getFileData?.[0].fileUrl} />
        </div>
        <div>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
