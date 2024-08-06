import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { code, p } from "./markdownRenderHelper";
import { codeLanguageSubset } from "@/lib/constants";

export const MarkdownParser = ({ message }: { message: string }) => {
  return (
    <Markdown
      // @ts-expect-error
      remarkPlugins={[remarkGfm, [remarkMath]]}
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
    >
      {message}
    </Markdown>
  );
};
