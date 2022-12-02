import { data } from "autoprefixer";
import { getBlocks } from "..";
import { asyncComponent } from "../types/types";
import { Block } from "./Block";

export const NotionPageBody = asyncComponent(
  async ({ databaseId, pageId }: { databaseId: string; pageId: string }) => {
    const blocks = await getBlocks(pageId);
    return (
      <div className="base:prose-base prose prose-invert mx-auto mt-8 w-full font-mono font-light sm:prose-sm lg:max-w-[900px] lg:prose-lg">
        {blocks.map((block) => {
          if (block) {
            return (
              <Block
                block={block}
                databaseId={databaseId}
                pageId={databaseId}
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
