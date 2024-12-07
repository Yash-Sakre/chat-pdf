"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";

function Header() {
  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4 md:px-8">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
