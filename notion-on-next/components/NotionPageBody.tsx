import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { data } from "autoprefixer";
import { getBlocks } from "..";
import { asyncComponent } from "../types/types";
import { Block } from "./Block";

export const NotionPageBody = asyncComponent(
  async ({
    blocks,
    databaseId,
    pageId,
  }: {
    blocks: (PartialBlockObjectResponse | BlockObjectResponse)[];
    databaseId: string;
    pageId: string;
  }) => {
    return (
      <div className="notion-page-body">
        {blocks.map((block) => {
          if (block) {
            return (
              <Block
                block={block}
                databaseId={databaseId}
                pageId={pageId}
                key={block.id}
                blocks={blocks}
              />
            );
          } else {
            // Prevents undefined block error
            return <></>;
          }
        })}
      </div>
    );
  }
);
