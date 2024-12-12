"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {  Menu, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react";
import { UploadPdf } from "./UploadPdf";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { theme } = useTheme();
  const {user} = useUser();

  const files = useQuery(api.fileStorage.getallFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress as string,
  });

  const getuserInfo = useQuery(api.user.getUserInfo,{
    userEmail: user?.primaryEmailAddress?.emailAddress as string,
  })
  


  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`md:hidden fixed  top-3 left-4 z-50 ${isOpen ? "hidden" : "fixed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" size={30} />
      </Button>
      <div
        className={`
        fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
        transition duration-200 ease-in-out
        w-64 md:w-72 border-r p-4 flex flex-col bg-background
        z-40 md:z-auto
        
      `}
      >
        <div className="mb-6">
          <div className="h-8 mb-6 flex items-center px-4 py-7">
            <Image
              src={`${theme == "dark" ? "/logo.png" : "/LogoDark.png"}`}
              alt="logo"
              width={500}
              height={500}
            />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute  top-0 right-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              <X className="h-6 w-6 " />
            </Button>
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsUploadDialogOpen(true)}
            disabled={files && (files.length >= 5 && !getuserInfo?.upgrade )? true : false}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            Workspace
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            Upgrade
          </Link>
        </nav>
        {!getuserInfo?.upgrade && <div className="mt-auto">
          <div className="text-sm text-muted-foreground mb-2">
          {files ? `${files.length} PDF(s) out of 5 uploaded` : "Loading files..."}
          </div>
          <Progress  value={files ? (files.length / 5) * 100 : 0} className="h-1" />
        </div>}
      </div>
      <UploadPdf 
        isOpen={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)} 
      />
    </>
  );
}

export default Sidebar;
