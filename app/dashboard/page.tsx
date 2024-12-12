"use client";

import React from "react";

import { FileCard } from "./_components/FileCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function page() {
  const { user } = useUser();

  console.log(user?.primaryEmailAddress?.emailAddress);

  const files = useQuery(api.fileStorage.getallFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress as string,
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return `Uploaded on ${formattedDate}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 md:p-4">
      <h1 className="text-4xl font-semibold mb-4 md:mb-8">Workspace</h1>
      <div className="grid gap-4 md:gap-8 grid-cols-2  md:grid-cols-2 lg:grid-cols-3">
        {files && files.length > 0 ? (
          files?.map((file, index) => {
            return (
              <Link href={`/workspace/${file.fileId}`} key={index}>
                <FileCard
                  name={file.fileName}
                  uploadedDate={formatTimestamp(file._creationTime)}
                />
              </Link>
            );
          })
        ) : (
          <div >
            <Skeleton className="h-[150px] w-full rounded-xl" />
            
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
