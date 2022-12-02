import mediaMap from "../../public/notion-media/media-map.json";
import { asyncComponent, mediaMapInterface } from "../types/types";
import { isFullBlock } from "@notionhq/client";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import { Code } from "./Code";
import { RichText } from "./RichText";
import { getBlocks } from "..";
let typedMediaMap: mediaMapInterface = mediaMap;

export const Block = asyncComponent(
  async ({
    block,
    databaseId,
    pageId,
    blocks,
  }: {
    block: BlockObjectResponse | PartialBlockObjectResponse;
    databaseId: string;
    pageId: string;
    blocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
  }) => {
    if (!isFullBlock(block)) {
      return <></>;
    }
    let children: React.ReactNode[] | undefined;
    if (block.has_children) {
      const childBlocks = await getBlocks(block.id);
      children = childBlocks?.map(
        (child: BlockObjectResponse | PartialBlockObjectResponse) => {
          if (child) {
            return (
              <Block
                block={child}
                databaseId={databaseId}
                pageId={pageId}
                key={child.id}
                blocks={childBlocks}
              />
            );
          } else {
            // Prevents undefined block error
            return <></>;
          }
        }
      );
    }
    // Add support for any block type here. You can add custom styling wherever you'd like.
    switch (block.type) {
      case "heading_1":
        return (
          <h1 className="font-sans">
            <RichText rich_text={block.heading_1.rich_text} />
          </h1>
        );
      case "heading_2":
        return (
          <h2 className="font-sans">
            <RichText rich_text={block.heading_2.rich_text} />
          </h2>
        );
      case "heading_3":
        return (
          <h3 className="font-sans">
            <RichText rich_text={block.heading_3.rich_text} />
          </h3>
        );
      case "paragraph":
        return (
          <p className="font-mono">
            <RichText rich_text={block.paragraph.rich_text} />
          </p>
        );
      case "image":
        return (
          <Image
            src={typedMediaMap[databaseId][pageId][block.id] || "/fallback.png"}
            alt={"Notion page image"} //TODO: Update this alt text
            width={400}
            height={400}
            className="h-auto w-full"
          />
        );
      case "video":
        const url = typedMediaMap[databaseId][pageId][block.id];
        if (url) {
          return <video controls src={url} />;
        } else {
          return <div className="">Video URL not found</div>;
        }

      case "bulleted_list_item":
        return (
          <ul>
            <li>
              <RichText rich_text={block.bulleted_list_item.rich_text} />
            </li>
            {children}
          </ul>
        );
      case "numbered_list_item":
        const itemPosition = blocks.findIndex(
          (blocksBlock) => block.id === blocksBlock.id
        );
        // Count backwards to find the number of numbered_list_item blocks before hitting a non-numbered_list_item block
        // Notions API does not give any information about the position of the block in the list so we need to calculate it
        let listNumber = 0;
        for (let i = itemPosition; i >= 0; i--) {
          let blocksBlock = blocks[i] as BlockObjectResponse;
          if (blocksBlock.type === "numbered_list_item") {
            listNumber++;
          } else {
            break;
          }
        }
        return (
          <ol start={listNumber}>
            <li>
              <RichText rich_text={block.numbered_list_item.rich_text} />
            </li>
            {children}
          </ol>
        );
      case "code":
        return (
          <div className="max-w-screen overflo-x-auto w-full">
            <Code
              text={block.code.rich_text[0].plain_text}
              language={"javascript"}
            />
          </div>
        );
      case "column_list":
        return <div className={`flex justify-between gap-2`}>{children}</div>;
      case "column":
        return <div className="word-wrap break-all p-4">{children}</div>;
      case "quote":
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4">
            <RichText rich_text={block.quote.rich_text} />
          </blockquote>
        );
      case "divider":
        return <hr />;
      case "to_do":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              className="mr-2"
            />
            <RichText rich_text={block.to_do.rich_text} />
          </div>
        );
      case "toggle":
        return (
          <details>
            <summary>
              <RichText rich_text={block.toggle.rich_text} />
            </summary>
            {children}
          </details>
        );

      default:
        return <div>Block {block.type} not supported</div>;
    }
  }
);
