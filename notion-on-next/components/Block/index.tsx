import mediaMap from "../../../public/notion-media/media-map.json";
import { asyncComponent, mediaMapInterface } from "../../types/types";
import { isFullBlock } from "@notionhq/client";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import { Code } from "../Code";
import { RichText } from "../RichText";
import { getBlocks } from "../..";
let typedMediaMap: mediaMapInterface = mediaMap;

/**
 * A recursive component that renders a Notion block and child blocks.
 */
export const Block = asyncComponent(
  async ({
    block,
    blocks,
    databaseId,
    pageId,
  }: {
    block: BlockObjectResponse | PartialBlockObjectResponse;
    blocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
    databaseId?: string;
    pageId?: string;
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
          <h1 className={`notion_${block.type}`} style={{ fontSize: "32px" }}>
            <RichText rich_text={block.heading_1.rich_text} />
          </h1>
        );
      case "heading_2":
        return (
          <h2 className={`notion_${block.type}`}>
            <RichText rich_text={block.heading_2.rich_text} />
          </h2>
        );
      case "heading_3":
        return (
          <h3 className={`notion_${block.type}`}>
            <RichText rich_text={block.heading_3.rich_text} />
          </h3>
        );
      case "paragraph":
        return (
          <p className={`notion_${block.type}`}>
            <RichText rich_text={block.paragraph.rich_text} />
          </p>
        );
      case "image":
        const imageUrl: string =
          databaseId && pageId
            ? (typedMediaMap[databaseId][pageId][block.id] as string)
            : block.image.type == "external"
            ? block.image.external.url
            : block.image.file.url;
        return (
          <Image
            src={imageUrl || "/fallback.png"}
            alt={"Notion page image"} //TODO: Update this alt text
            width={400}
            height={400}
            className={`notion_${block.type}`}
          />
        );
      case "video":
        const videoUrl: string =
          databaseId && pageId
            ? (typedMediaMap[databaseId][pageId][block.id] as string)
            : block.video.type == "external"
            ? block.video.external.url
            : block.video.file.url;
        if (videoUrl) {
          return (
            <video controls src={videoUrl} className={`notion_${block.type}`} />
          );
        } else {
          return <div className="">Video URL not found</div>;
        }

      case "bulleted_list_item":
        return (
          <ul>
            <li className={`notion_${block.type}`}>
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
            <li className={`notion_${block.type}`}>
              <RichText rich_text={block.numbered_list_item.rich_text} />
            </li>
            {children}
          </ol>
        );
      case "code":
        return (
          // className="max-w-screen overflo-x-auto w-full"
          <div className={`notion_${block.type}`}>
            <Code
              text={block.code.rich_text[0].plain_text}
              language={"javascript"}
            />
          </div>
        );
      case "column_list":
        // className={`flex justify-between gap-2`}
        return <div className={`notion_${block.type}`}>{children}</div>;
      case "column":
        // className="word-wrap break-all p-4"
        return <div className={`notion_${block.type}`}>{children}</div>;
      case "quote":
        // className="border-l-4 border-gray-300 pl-4
        return (
          <blockquote className={`notion_${block.type}`}>
            <RichText rich_text={block.quote.rich_text} />
          </blockquote>
        );
      case "divider":
        return <hr />;
      case "to_do":
        return (
          // className="flex items-center"
          // className="mr-2"
          <div className={`notion_${block.type}_container`}>
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              className={`notion_${block.type}`}
            />
            <RichText rich_text={block.to_do.rich_text} />
          </div>
        );
      case "toggle":
        return (
          <details className={`notion_${block.type}_container`}>
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
