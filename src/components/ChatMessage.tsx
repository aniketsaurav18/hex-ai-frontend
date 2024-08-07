"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { useMarkdownProcessor } from "@/hooks/MarkdownParser";
import { code, p } from "../hooks/markdownRenderHelper";
import { codeLanguageSubset } from "@/lib/constants";
import Image from "next/image";

const MemoizedMarkdown = React.memo(({ content }: { content: string }) => (
  <Markdown
    // @ts-expect-error
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[
      rehypeKatex,
      [
        // @ts-expect-error
        rehypeHighlight,
        {
          detect: true,
          ignoreMissing: true,
          subset: codeLanguageSubset,
        },
      ],
    ]}
    className="flex flex-col gap-2"
    components={{
      h1: ({ node, ...props }) => <h1 className="margin-y-2" {...props} />,
      h2: ({ node, ...props }) => <h2 className="margin-y-2" {...props} />,
      h3: ({ node, ...props }) => <h3 className="margin-y-2" {...props} />,
      h4: ({ node, ...props }) => <h4 className="margin-y-2" {...props} />,
      h5: ({ node, ...props }) => <h5 className="margin-y-2" {...props} />,
      h6: ({ node, ...props }) => <h6 className="margin-y-2" {...props} />,
      p: ({ node, ...props }) => <p className="margin-y-2" {...props} />,
      ul: ({ node, ...props }) => <ul className="margin-y-2" {...props} />,
      ol: ({ node, ...props }) => <ol className="margin-y-2" {...props} />,
      li: ({ node, ...props }) => <li className="margin-y-2" {...props} />,
      blockquote: ({ node, ...props }) => (
        <blockquote className="margin-y-2" {...props} />
      ),
      pre: ({ node, ...props }) => <pre className="margin-y-2" {...props} />,
      code: ({ node, ...props }) => <code className="margin-y-2" {...props} />,
    }}
  >
    {content}
  </Markdown>
));

const UserMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-row mt-4 mb-4">
      <div className="mr-5">
        <div className="w-9 h-9 overflow-hidden grid place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 6.35 6.35"
            id="user"
            height={30}
            width={30}
          >
            <path
              d="M3.176 2.117c-.874 0-1.588.714-1.588 1.588A1.59 1.59 0 0 0 3.176 5.29c.874 0 1.585-.712 1.585-1.586a1.59 1.59 0 0 0-1.585-1.588zm0 .529c.588 0 1.056.471 1.056 1.059A1.05 1.05 0 0 1 3.176 4.76a1.053 1.053 0 0 1-1.059-1.056c0-.588.471-1.06 1.059-1.06zM3.175 5.82c-.862 0-1.642.281-2.217.714C.382 6.97 0 7.565 0 8.202a.265.265 0 0 0 .265.265h5.82a.265.265 0 0 0 .265-.265c0-.638-.382-1.233-.958-1.667-.575-.433-1.355-.714-2.217-.714Zm0 .529c.746 0 1.42.248 1.899.608.38.287.582.636.667.98H.61c.085-.344.287-.693.667-.98.479-.36 1.153-.608 1.899-.608Z"
              color="#ffffff"
              transform="translate(0 -2.117)"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex-grow text-white">
        <p className="break-words">{text}</p>
      </div>
    </div>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const useStreamData = (data: string) => {
  const [streamData, setStreamData] = useState<string>("");
  const dataRef = useRef(data);
  const streamRef = useRef(streamData);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const updateStreamData = useCallback(() => {
    if (dataRef.current.length > streamRef.current.length) {
      const diff = dataRef.current.length - streamRef.current.length;
      const newStreamData = dataRef.current.slice(
        0,
        streamRef.current.length + randomIntFromInterval(1, Math.min(7, diff)) //experiment with this number see what looks good.
      );
      setStreamData(newStreamData);
      streamRef.current = newStreamData;
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const hasUpdate = updateStreamData();
    }, 5);

    return () => clearInterval(intervalId);
  }, []);

  return streamData;
};

function ChatMessage({
  message,
}: {
  message: { text: string; isBot: boolean };
}) {
  return (
    <>
      {message.isBot ? (
        <div className="flex flex-row mt-4 mb-4 w-full">
          <div className="flex-shrink-0 mr-5">
            <div className="w-9 h-9 overflow-hidden grid place-items-center">
              <svg
                fill="#ffffff"
                viewBox="0 0 32 32"
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>chat-bot</title>
                <path d="M16,19a6.9908,6.9908,0,0,1-5.833-3.1287l1.666-1.1074a5.0007,5.0007,0,0,0,8.334,0l1.666,1.1074A6.9908,6.9908,0,0,1,16,19Z" />
                <path d="M20,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,0,20,8Z" />
                <path d="M12,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,0,12,8Z" />
                <path d="M17.7358,30,16,29l4-7h6a1.9966,1.9966,0,0,0,2-2V6a1.9966,1.9966,0,0,0-2-2H6A1.9966,1.9966,0,0,0,4,6V20a1.9966,1.9966,0,0,0,2,2h9v2H6a3.9993,3.9993,0,0,1-4-4V6A3.9988,3.9988,0,0,1,6,2H26a3.9988,3.9988,0,0,1,4,4V20a3.9993,3.9993,0,0,1-4,4H21.1646Z" />
                <rect
                  id="_Transparent_Rectangle_"
                  data-name="&lt;Transparent Rectangle&gt;"
                  className="fill-none"
                  width="32"
                  height="32"
                />
              </svg>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="text-base prose prose-invert prose-h1:text-2xl prose-h2:text-xl max-w-none w-full overflow-x-auto">
              <MemoizedMarkdown content={useStreamData(message.text)} />
            </div>
          </div>
        </div>
      ) : (
        <UserMessage text={message.text} />
      )}
    </>
  );
}

export default ChatMessage;
