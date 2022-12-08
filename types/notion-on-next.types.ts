import {
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  RichTextItemResponse,
  MultiSelectPropertyItemObjectResponse,
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

export type DogsPageObjectResponse = NotionOnNextPageObjectResponse & {
  properties: {
    "Fur Type": SelectPropertyItemObjectResponse;
    Type: SelectPropertyItemObjectResponse;
    "Average Weight (lbs)": NumberPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};

export type ProgrammingPageObjectResponse = NotionOnNextPageObjectResponse & {
  properties: {
    Description: RichTextItemResponse;
    Tags: MultiSelectPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
