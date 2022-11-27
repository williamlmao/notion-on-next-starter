import {
  Client,
  collectPaginatedAPI,
  isFullBlock,
  isFullPage,
} from "@notionhq/client";
import * as dotenv from "dotenv";
import fs from "fs";
import request from "request";
import Config from "./config.json";
import { NotionOnNextPageObjectResponse } from "../types/types";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_KEY });

export const getPages = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId as string,
  });
  let pages: NotionOnNextPageObjectResponse[] = [];
  response.results.forEach((page) => {
    if (!isFullPage(page)) {
      return;
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
    const descriptionProp = page.properties.Description;
    let description;
    if (descriptionProp?.type === "rich_text") {
      description = descriptionProp?.rich_text[0]?.plain_text;
    }
    pages.push({
      ...page,
      title: title,
      description: description,
      slug: slug,
      coverImage:
        page?.cover?.type === "file"
          ? page?.cover?.file?.url
          : page?.cover?.external?.url,
    });
  });
  return pages;
};

const generateTypesFromDatabase = async (databaseId: string) => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  // @ts-ignore -- Notion API types are not consistent with the actual API
  const databaseName = response.title[0].plain_text;
  const databaseProperties = response.properties;
  const propertyTypeMap = {
    rich_text: "RichTextItemResponse",
    select: "SelectPropertyItemObjectResponse",
    title: "TitlePropertyItemObjectResponse",
    multi_select: "MultiSelectPropertyItemObjectResponse",
    checkbox: "CheckboxPropertyItemObjectResponse",
    url: "UrlPropertyItemObjectResponse",
    email: "EmailPropertyItemObjectResponse",
    date: "DatePropertyItemObjectResponse",
    person: "PersonPropertyItemObjectResponse",
  };
  const allBlockTypesFromResponse = Object.keys(databaseProperties).map(
    (key) => {
      const property = databaseProperties[key];

      return property.type;
    }
  );

  const allBlockTypes = Array.from(new Set(allBlockTypesFromResponse));
  const allBlockTypeImports = allBlockTypes
    .map((type) => propertyTypeMap[type as keyof typeof propertyTypeMap])
    .filter(Boolean); // filter out undefined
  const importsText = `import { PageObjectResponse, ${allBlockTypeImports.join(
    ", "
  )} } from '@notionhq/client/build/src/api-endpoints';`;

  await replaceImports("./types.ts", importsText);
  const typeDefStart = `export type ${databaseName}PageObjectResponse = NotionOnNextPageObjectResponse & {\n\tproperties: {\n`;
  const typeDefEnd = `\n\t}\n}`;
  const typeDefProperties = Object.keys(databaseProperties).map((key) => {
    const property = databaseProperties[key];
    const propertyType = property.type;
    const propertyTypeMapped =
      propertyTypeMap[propertyType as keyof typeof propertyTypeMap];
    return `\t\t${key}: ${propertyTypeMapped};`;
  });

  const typeDef = typeDefStart + typeDefProperties.join("\n") + typeDefEnd;
  await appendToFile("types.ts", typeDef);
};

const replaceImports = (filename: string, newImports: string) => {
  // return a promise
  return new Promise((resolve, reject) => {
    fs.readFile(`./types/types.ts`, "utf-8", function (err, contents) {
      if (err) {
        console.log(err);
        return reject(err);
      }

      const newContents = contents.replace(
        /import { PageObjectResponse } from "@notionhq\/client\/build\/src\/api-endpoints";/g,
        newImports
      );
      fs.writeFile(`./types/types.ts`, newContents, "utf-8", function (err) {
        if (err) {
          console.log(err);
          return;
        }
        resolve("done");
      });
    });
  });
};

const downloadMediaToFolder = async (
  url: string,
  path: string,
  callback: () => void,
  update?: boolean
) => {
  if (fs.existsSync(path) && !update) {
    console.log("File already exists, skipping download");
    callback();
    return;
  }
  // overwrite if file already exists
  await request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const createFolderIfDoesNotExist = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const appendToFile = async (fileName: string, data: string) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(fileName, data, (err) => {
      if (err) reject(err);
      resolve("done");
    });
  });
};

async function getPageBlocks(pageId: string) {
  const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
    block_id: pageId,
  });
  return blocks;
}

const getFileExtension = (url: string) => {
  return url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)?.[1];
};

type MediaMap = {
  [key: string]: MediaMapPage | {};
};

type MediaMapPage = {
  cover: string;
  [key: string]: string;
};
async function fetchImages(
  databaseId: string,
  pages?: NotionOnNextPageObjectResponse[],
  update?: boolean
) {
  const mediaMap: MediaMap = {};
  const basePath = `../public/notion-media`;
  const databasePath = `${basePath}/${databaseId}`;
  if (!mediaMap[databaseId]) {
    mediaMap[databaseId] = {};
  }
  createFolderIfDoesNotExist(`${databasePath}`);
  if (!pages) {
    pages = await getPages(databaseId);
  }
  for (const page of pages) {
    const mediaMapDb = mediaMap[databaseId];
    // @ts-ignore -- TODO: Fix this type error
    mediaMapDb[page.id] = {};
    const pageFolderPath = `${databasePath}/${page.id}`;
    createFolderIfDoesNotExist(`${pageFolderPath}`);
    // Download cover images
    if (page.coverImage) {
      // Regex to get the file extension from the URL (e.g. png, jpg, jpeg, etc)
      const fileExtension = getFileExtension(page.coverImage);
      const coverImagePath = `${pageFolderPath}/cover.${fileExtension}`;
      // Remove /public from the mediamap path so it can be used in the Next App (you don't need to include /public in the paths)
      const coverImagePathWithoutPublic = `/notion-media/${databaseId}/${page.id}/cover.${fileExtension}`;
      // @ts-ignore -- TODO: Fix this type error
      mediaMap[databaseId][page.id].cover = coverImagePathWithoutPublic;

      await downloadMediaToFolder(
        page.coverImage,
        coverImagePath,
        () => {
          console.log(`Downloaded cover image for ${page.id}`);
        },
        update
      );
    }
    // Download all blocks and their images
    const blocks = await getPageBlocks(page.id);
    for (const block of blocks) {
      if (!isFullBlock(block)) {
        continue;
      }
      let url;
      if (block.type === "image") {
        const image = block.image;
        url = image.type === "external" ? image.external.url : image.file.url;
      }

      if (block.type === "video") {
        const video = block.video;
        url = video.type === "external" ? video.external.url : video.file.url;
      }
      if (!url) {
        continue;
      }
      const fileExtension = getFileExtension(url);
      const blockImagePath = `${pageFolderPath}/${block.id}.${fileExtension}`;
      const blockImagePathWithoutPublic = `/notion-media/${databaseId}/${page.id}/${block.id}.${fileExtension}`;
      // @ts-ignore -- TODO: Fix this type error
      mediaMap[databaseId][page.id][block.id] = blockImagePathWithoutPublic;
      downloadMediaToFolder(
        url,
        blockImagePath,
        () => {
          console.log(`Downloaded image for ${block.id}`);
        },
        update
      );
    }
  }
  // // Write the image map to a .json file
  fs.writeFileSync(`${basePath}/media-map.json`, JSON.stringify(mediaMap));
}

// Setup will recreate types.ts
// Will add types for all databases in config file
// Will download all media from all databases in config file
const setup = async () => {
  const databases = Object.entries(Config.databases);
  // Iterate through databases on Config.databases
  for (const [databaseName, database] of databases) {
    await fetchImages(database.databaseId);
  }
};

const updateTypes = async () => {};

const updateMedia = async () => {};

setup();
