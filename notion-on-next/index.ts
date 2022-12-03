import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import * as dotenv from "dotenv";
import { cache } from "react";
import Config from "./config.json";
import { fetchImages } from "./downloadMedia";
import { generateTypesFromDatabase, setupTypes } from "./generateTypes";

dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_KEY });

// This type later gets created in types.ts, but we need it here because this file generates types.ts
export interface NotionOnNextPageObjectResponse extends PageObjectResponse {
  slug: string | undefined;
  title: string | undefined;
  coverImage: string | undefined;
}

/**
 * This is a cached function that fetches all pages from a Notion database.
 */
export const getPages = cache(async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId as string,
  });
  return response.results;
});

/**
 * This function pulls out the required types for notion-on-next: slug, title, and cover image to make these properties more accessible.
 * It also accepts a generic type which is meant to be passed down from getParsedPages, but can be used elsewhere.
 */
export const parsePages = cache(
  async <Type>(
    pages: (PageObjectResponse | PartialPageObjectResponse)[]
  ): Promise<Type[]> => {
    const parsedPages = pages.map((page) => {
      if (!isFullPage(page)) {
        return page;
      }
      const slug = page.url
        .split("/")
        .slice(3)
        .join("/")
        .split("-")
        .slice(0, -1)
        .join("-");
      // Working around type errors: https://github.com/makenotion/notion-sdk-js/issues/154
      const nameProp = page.properties.Name;
      let title;
      if (nameProp?.type === "title") {
        title = nameProp?.title[0]?.plain_text;
      }
      return {
        ...page,
        slug: slug,
        title: title,
        coverImage:
          page?.cover?.type === "file"
            ? page?.cover?.file?.url
            : page?.cover?.external?.url,
      };
    });
    return parsedPages as Type[];
  }
);

/**
 * Gets all pages from a Notion database and parses them into a more usable format.
 * Accepts a generic type, which is generated for you after running setup in notion-on-next.
 * The generic type should be a version of PageObjectResponse, but with your database's properties.
 */
export const getParsedPages = cache(async <Type>(databaseId: string) => {
  const pages = await getPages(databaseId);
  const parsedPages = await parsePages<Type>(pages);
  return parsedPages;
});

export const getBlocks = cache(async (pageId: string) => {
  const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
    block_id: pageId,
  });
  return blocks;
});

// export const getChildBlocks = cache(
//   async (
//     blockId: string
//   ): Promise<
//     BlockObjectResponse[] | PartialBlockObjectResponse[] | undefined
//   > => {
//     const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
//       block_id: blockId as string,
//     });
//     return blocks;
//   }
// );

// Setup will recreate types.ts
// Will add types for all databases in config file
// Will download all media from all databases in config file
export const setup = async () => {
  await setupTypes();
  const databases = Object.entries(Config.databases);
  // Iterate through databases on Config.databases
  for (const [databaseName, database] of databases) {
    console.log('Setting up from database: "' + databaseName + '"');
    const pages = await getPages(database.databaseId);
    const parsedPages = await parsePages<NotionOnNextPageObjectResponse>(pages);
    await generateTypesFromDatabase(database.databaseId);
    await fetchImages(database.databaseId, parsedPages);
    console.log('Finished setting up from database: "' + databaseName + '"');
  }
};

const updateTypes = async () => {};

const updateMedia = async () => {};
