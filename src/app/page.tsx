"use client";
import React, { useEffect, useState, useRef } from "react";
import InputBar from "@/components/InputBar";
import ChatMessage from "@/components/ChatMessage";
import { dummyData } from "@/lib/dummyData";

const serverBaseURL = "http://localhost:8000";

const useStreamData = (data: string) => {
  const [streamData, setStreamData] = useState<string>("");
  const dataRef = useRef(data);
  const streamRef = useRef(streamData);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dataRef.current.length > streamRef.current.length) {
        setStreamData(dataRef.current.slice(0, streamRef.current.length + 1));
        streamRef.current = dataRef.current.slice(
          0,
          streamRef.current.length + 6
        );
      }
    }, 1);

    return () => clearInterval(intervalId);
  }, []);

  return streamData;
};

export default function Home() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("http://localhost:3002/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        if (response.body !== null) {
          const reader = response.body.getReader();
          let text = "";

          const readChunks = async () => {
            const { done, value } = await reader.read();
            if (done) {
              setData(text);
              return;
            }
            text += new TextDecoder().decode(value);
            setData(text);
            readChunks();
            console.log("data: ", text);
          };

          readChunks();
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchContent();
  }, []);

  const streamData = useStreamData(data);

  return (
    <main className="relative flex flex-col h-screen max-w-screen-lg w-full mx-auto bg-background-black p-2">
      <div className="flex flex-col flex-grow overflow-y-auto mb-16 ml-8 hide-scrollbar">
        {dummyData.map((d,idx)=>{
          return <ChatMessage key={idx} message={d.message}/>
        })}
        {/* <div className="text-white">
          <ChatMessage message={{ text: streamData, isBot: true }} />
        </div> */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background-black p-2">
        <InputBar />
      </div>
    </main>
  );
}
