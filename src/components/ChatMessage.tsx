import React, { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { useMarkdownProcessor } from "@/hooks/MarkdownParser";
import { code, p } from "../hooks/markdownRenderHelper";
import { codeLanguageSubset } from "@/lib/constants";
import Image from "next/image"

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
    className="flex flex-col gap-2 w-full"
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

const UserMessage = ({text}: {text: string}) => {
  return (
    <div className="flex flex-row">
      <div>
        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>chat-bot</title><path d="M16,19a6.9908,6.9908,0,0,1-5.833-3.1287l1.666-1.1074a5.0007,5.0007,0,0,0,8.334,0l1.666,1.1074A6.9908,6.9908,0,0,1,16,19Z"/><path d="M20,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,0,20,8Z"/><path d="M12,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,0,12,8Z"/><path d="M17.7358,30,16,29l4-7h6a1.9966,1.9966,0,0,0,2-2V6a1.9966,1.9966,0,0,0-2-2H6A1.9966,1.9966,0,0,0,4,6V20a1.9966,1.9966,0,0,0,2,2h9v2H6a3.9993,3.9993,0,0,1-4-4V6A3.9988,3.9988,0,0,1,6,2H26a3.9988,3.9988,0,0,1,4,4V20a3.9993,3.9993,0,0,1-4,4H21.1646Z"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/></svg>
      </div>
      <div className="min-w-full text-white">
        <p>{text}</p>
      </div>
    </div>
  )
}

function ChatMessage({
  message
}: {
  message: { text: string; isBot: boolean };
}) {
  const content = useMarkdownProcessor(message.text);

  const memoizedContent = useMemo(() => message.text, [message.text]);

  return (
    <>
    {message.isBot ? <div className="text-base prose prose-invert prose-h1:text-2xl prose-h2:text-xl prose:min-w-full min-w-full">
      <MemoizedMarkdown content={memoizedContent} />
    </div>:<UserMessage text={message.text} />}
    </>
  );
}

export default ChatMessage;
