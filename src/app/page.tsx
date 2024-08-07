"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import InputBar from "@/components/InputBar";
import ChatMessage from "@/components/ChatMessage";
import { dummyData } from "@/lib/dummyData";

const serverBaseURL = "http://localhost:8000";

type Message = { text: string; isBot: boolean };

export default function Home() {
  const [data, setData] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const fetchContent = async (userquery: string) => {
    try {
      setChatHistory((p: Message[]) => {
        return [...p, { text: userquery, isBot: false }];
      });
      const response = await fetch("http://localhost:3002/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userquery }),
      });
      if (!response.ok) {
        setChatHistory((p: Message[]) => {
          return [
            ...p,
            {
              text: "Sorry, It looks like server is not responding well",
              isBot: true,
            },
          ];
        });
        throw new Error("Network response was not ok");
      }
      setChatHistory((p: Message[]) => {
        return [...p, { text: "", isBot: true }];
      });
      if (response.body !== null) {
        const reader = response.body?.getReader();
        let done = false;
        while (!done && reader) {
          const { value, done: d } = await reader.read();
          done = d;

          const txt = new TextDecoder().decode(value);
          setChatHistory((prevChatHistory) => {
            if (prevChatHistory.length === 0) return prevChatHistory;

            return prevChatHistory.map((chat, index) => {
              if (index === prevChatHistory.length - 1) {
                // This is the last item, update its text
                return { ...chat, text: chat.text + txt };
              }
              // For all other items, return as is
              return chat;
            });
          });
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const memoizedChatMessages = useMemo(() => {
    return chatHistory?.map((d, idx) => <ChatMessage key={idx} message={d} />);
  }, [chatHistory]);

  return (
    <main className="relative flex flex-col h-screen max-w-screen-lg w-full mx-auto bg-background-black p-2">
      <div className="flex flex-col flex-grow overflow-y-auto mb-16 hide-scrollbar">
        {memoizedChatMessages}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background-black p-2">
        <InputBar fetchContent={fetchContent} />
      </div>
    </main>
  );
}
