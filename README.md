# Notion-on-next

A library to help you use Notion as a CMS in your Next 13 App.

Why is this library just for Next 13? There are existing libraries out there to help you render Notion pages in React Apps. But I Notion and Next.js seemed like such an obvious pairing, I wanted to optimize the use together. Notion serves as a friendly CMS and Next takes that content and uses it to build static pages. The result is blazing fast pages. ISR makes this combo even more potent!

[Callout]

This library is built with Next 13, which is still experimental. Use this at your own risk. I cannot guarantee it will still work as Next 13 is updated and released.

# Setup

## Notion Integration

blah blah blah

## Install

`npm install notion-on-next`

`npx notion-on-next setup`

This function will

- Prompt you for a list of database IDs
- It then generates a config file, notion-on-next.config.js
- Create and download all images to a folder in /public
- Generate types from your databases

## To Get a list of posts

In the example below, `BlogPageObjectResponse` was a type that was automatically generated from a database titled Blog. You should check the automatically generated types and pick the type that corresponds with the databaseId you are passing in.

```
import { getParsedPages } from "../../notion-on-next";
import { BlogPageObjectResponse } from "../../types/types";
import { databaseId } from "./page";

const databaseId = "kdshfoishdfiosdhf"

export default async function Blog() {
  const pages = await getParsedPages<BlogPageObjectResponse>(databaseId);
  return <div>{pages.map((page) => page.title)}</div>;
}
```

## Generating Static Pages (Indiviudal Pages)

Notion-on-next is configured to work with slugs. These slugs are automatically generated and will be on any of your automatically generated `PageObjectResponse` types.

In the example below, we do the following

- Grab the slug from the route params
- Get all of the pages from `getParsedPages`. Don't worry, `getParsedPages` is a cached function, so calling it again will not actually make another call to the notion api to fetch all of your pages. We have to do this because there is no way to pass the page id through `generateStaticParams` and the Notion API requires a page id to fetch a page.
- Find the page with the matching slug

```
import { FC } from "react";
import { getBlocks, getPages, getParsedPages } from "../../../notion-on-next";
import { BlogPageObjectResponse } from "../../../types/types";
import { use } from "react";
import { databaseId } from "../page";
import { notFound } from "next/navigation";
import { data } from "autoprefixer";
import { NotionPageBody } from "../../../notion-on-next/components/NotionPageBody";

interface PageProps {
  params: {
    slug: string;
  };
}

const BlogPage: FC<PageProps> = ({ params }) => {
  const { slug } = params;
  // This may seem like a roundabout way to retrieve the page, but getParsedPages is a per-request cached function. You can read more about it here https://beta.nextjs.org/docs/data-fetching/caching#preload-pattern-with-cache
  // The reason why we have to get all of the pages and then filter is because the Notion API can only search for pages via page id and not slug.
  const pages = use(getParsedPages<BlogPageObjectResponse>(databaseId));
  const page = pages.find((page) => page.slug === slug);
  if (!page) {
    notFound();
  }

  return (
    <div>
      {/* {JSON.stringify(page)} */}
      <NotionPageBody databaseId={databaseId} pageId={page.id} />
    </div>
  );
};

export default BlogPage;

export async function generateStaticParams() {
  const pages = await getParsedPages<BlogPageObjectResponse>(databaseId);
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

```

You can do whatever you want with the data returned by `getBlocks`, or you can use some prebuilt components from this library to handle.

`NotionPageBody`
`Blocks`

You can add `@notion-on-next/blocks.css` to handle the styling for you, or you can copy the componeont [LINK TO BLOCK COMPONENT] and add your own styling.

Here is also a pre-styled version of the component with tailwind.

# When should I trigger a re-build?

- When you change the title of a page
- WHen you add new media, photos or images
