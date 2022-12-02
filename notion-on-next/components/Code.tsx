"use client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicSyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter"),
  {
    suspense: true,
  }
);

export const Code = ({
  text,
  language,
}: {
  text: string;
  language: string;
}) => {
  return (
    <div className="w-full">
      <Suspense fallback={"Loading..."}>
        <DynamicSyntaxHighlighter language={language} style={atomOneDark}>
          {text}
        </DynamicSyntaxHighlighter>
      </Suspense>
    </div>
  );
};
