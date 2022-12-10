import {
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
  RichTextItemResponse,
  NumberPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
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
    "Photo By": RichTextPropertyItemObjectResponse;
    "Average Weight (lbs)": NumberPropertyItemObjectResponse;
    "Photo by URL": UrlPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
export type ProgrammingPageObjectResponse = NotionOnNextPageObjectResponse & {
  properties: {
    Description: RichTextPropertyItemObjectResponse;
    Tags: MultiSelectPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
