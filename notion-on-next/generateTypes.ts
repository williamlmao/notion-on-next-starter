import fs from "fs";
import Config from "./config.json";
import { notion } from ".";
import { appendToFile } from "./utils";

export const generateTypesFromDatabase = async (databaseId: string) => {
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
  )} } from`;

  const filePath = `${Config.typesPath}/types.ts`;
  await replaceImports(filePath, importsText);
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
  await appendToFile(filePath, typeDef, () => {
    console.log("Appended files to" + filePath);
  });
};

export const replaceImports = (filePath: string, newImports: string) => {
  // return a promise
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", function (err, contents) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log("contents", contents);
      // const newContents is replacing anything between "import {" and "} from"
      const newContents = contents.replace(
        /import \{(.|\n)*?\} from/g,
        newImports
      );

      fs.writeFile(filePath, newContents, "utf-8", function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Updated imports in ", filePath);
        resolve("done");
      });
    });
  });
};

export const setupTypes = async () => {
  fs.writeFileSync(
    `${Config.typesPath}/types.ts`,
    `
  import {
    PageObjectResponse,
  } from "@notionhq/client/build/src/api-endpoints";
  
  export interface NotionOnNextPageObjectResponse extends PageObjectResponse {
    slug: string | undefined;
    title: string | undefined;
    coverImage: string | undefined;
  }
  export interface mediaMapInterface {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  }
  `
  );
  console.log("Created types.ts");
};
