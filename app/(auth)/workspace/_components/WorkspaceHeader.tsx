import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";

function WorkspaceHeader() {
  const { theme } = useTheme();

  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4 md:px-8">
        <Link href={"/dashboard"}>
          <Image
            src={`${theme == "dark" ? "/logo.png" : "/LogoDark.png"}`}
            alt="logo"
            width={150}
            height={150}
          />
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
