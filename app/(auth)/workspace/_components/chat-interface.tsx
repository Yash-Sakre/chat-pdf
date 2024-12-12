"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/config/Aimodel";
import { useUser } from "@clerk/nextjs";

interface Message {
  question: string;
  answer: string;
  timestamp: string;
}

interface Conversation {

  messages: Message[];
}

export default function ChatInterface() {
  const [conversation, setConversation] = useState<Conversation>({
    messages: [],
  });
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { fileId } = useParams();
  const { user } = useUser();


  const searchfromAi = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.SaveNotes)
  const getNotes = useQuery(api.notes.GetNotes,{
    fileId:fileId as string,
  })


  // console.log(getNotes?.[0].notes)


  const handleSendMessage = async () => {
    try {
      const result = await searchfromAi({
        query: inputValue,
        fileId: fileId as string,
      });

      const unformattedResponse = JSON.parse(result);

      let unFormattedAnswer = "";
      unformattedResponse &&
        unformattedResponse.forEach((item: { pageContent: string }) => {
          unFormattedAnswer += item.pageContent;
        });

      const prompt = `
You are an intelligent assistant designed to provide helpful and informative responses. 
The user has asked the following question: "${inputValue}". 
The AI should generate a response based on the provided content, which includes the following information: "${unFormattedAnswer}". 

If the provided content adequately addresses the user's question, please rephrase the answer in a clear and concise manner. If the content does not sufficiently answer the question, provide a detailed and insightful answer based on your knowledge and expertise.

Ensure that your response is engaging and appropriate for the context of a conversation. 
Remember to keep the tone friendly and professional. 
`;

      const formattedAnswer = await chatSession.sendMessage(prompt);
      console.log("formatted answer " + formattedAnswer.response.text());

      const newMessage: Message = {
        question: inputValue.trim(),
        answer: formattedAnswer.response.text(),
        timestamp: (new Date()).toString(),
      };

      const existingNotes = getNotes?.[0]?.notes || [];

      const updatedMessages = [...existingNotes, newMessage];
      setConversation({
        ...conversation,
        
        messages: updatedMessages,
      });

      console.log("conv",updatedMessages);

       saveNotes({
        fileId: fileId as string,
        notes:updatedMessages,
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown-user",
      })


      setInputValue("");

      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error calling searchfromAi:", error);
    }

  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toUpperCase();
  };

  const renderAnswer = (answer: string) => {
    // Replace bold markers with <strong> tags
    const formattedAnswer = answer.replace(
      /(\*\*|__)(.*?)\1/g,
      "<strong>$2</strong>"
    );
    // Replace new lines with <br />
    const finalAnswer = formattedAnswer.replace(/\n/g, "<br />");
    return finalAnswer;
  };


  const getFileData = useQuery(api.fileStorage.getFileData, {
    fileId: fileId as string,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]  mx-auto">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 ">
          <div className=" text-sm font-medium flex items-center justify-between">
            {getFileData?.[0].fileName}
            
          </div>
          {getNotes?.[0]?.notes.map((message:Message, index:number) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <span className="text-sm">
                    {" "}
                    • {formatTime(new Date(message.timestamp))}
                  </span>
                  <div className="mt-1 ">{message.question}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/logo2.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">ChatPdf</span>
                  <span className="text-sm">
                    {" "}
                    • {formatTime( new Date(message.timestamp))}
                  </span>
                  <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                      __html: renderAnswer(message.answer),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-5 w-full">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question..."
          className="w-full"
        />
        <Button onClick={() => handleSendMessage()}>Send</Button>
      </div>
    </div>
  );
}
