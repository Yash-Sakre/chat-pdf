"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";



export default function Home() {

  const {user} = useUser();
  const createUser = useMutation(api.user.createUser)

  useEffect(()=>{
    user && CheckUser()
  },[user])

  
  const CheckUser = async () => {
    const result = await createUser({
      email:user?.primaryEmailAddress?.emailAddress || "",
      userName: user?.fullName || "",
      imageUrl: user?.imageUrl || "",
    });

    console.log(result);
  } 

  
  
  return (
    <div>
      <h2>Hi</h2>

      <UserButton />
    </div>
  );  
}
