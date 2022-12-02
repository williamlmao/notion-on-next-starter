import { isFullBlock } from "@notionhq/client";
import fs from "fs";
import request from "request";
import {
  getPageBlocks,
  getPages,
  NotionOnNextPageObjectResponse,
  parsePages,
} from ".";
import { createFolderIfDoesNotExist, getFileExtension } from "./utils";

export const downloadMediaToFolder = async (
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

type MediaMap = {
  [key: string]: MediaMapPage | {};
};

type MediaMapPage = {
  cover: string;
  [key: string]: string;
};
export async function fetchImages(
  databaseId: string,
  pages?: NotionOnNextPageObjectResponse[],
  update?: boolean
) {
  const mediaMap: MediaMap = {};
  const basePath = `../public/notion-media`;
  await createFolderIfDoesNotExist(`${basePath}`);
  const databasePath = `${basePath}/${databaseId}`;
  if (!mediaMap[databaseId]) {
    mediaMap[databaseId] = {};
  }
  await createFolderIfDoesNotExist(`${databasePath}`);
  if (!pages) {
    const unparsedPages = await getPages(databaseId);
    pages = await parsePages(unparsedPages);
  }
  for (const page of pages) {
    const mediaMapDb = mediaMap[databaseId];
    // @ts-ignore -- TODO: Fix this type error
    mediaMapDb[page.id] = {};
    const pageFolderPath = `${databasePath}/${page.id}`;
    await createFolderIfDoesNotExist(`${pageFolderPath}`);
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
