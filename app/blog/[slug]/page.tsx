import { notFound } from "next/navigation";
import React from "react";
import { getBlocks, getParsedPages } from "../../../notion-on-next";
import { NotionPageBody } from "../../../notion-on-next/components/NotionPageBody";
import { BlogPageObjectResponse } from "../../../types/types";
import { databaseId } from "../page";
// import "../../../notion-on-next/components/Block/block.css";

interface PageProps {
  slug: string;
}

const BlogPage = async ({
  params,
}: {
  params: PageProps;
}): Promise<React.ReactNode> => {
  const { slug } = params;
  // This may seem like a roundabout way to retrieve the page, but getParsedPages is a per-request cached function. You can read more about it here https://beta.nextjs.org/docs/data-fetching/caching#preload-pattern-with-cache
  // The reason why we have to get all of the pages and then filter is because the Notion API can only search for pages via page id and not slug.
  const pages = await getParsedPages<BlogPageObjectResponse>(databaseId);
  const page = pages.find((page) => page.slug === slug);
  if (!page) {
    notFound();
  }
  const blocks = await getBlocks(page.id);
  return (
    <div>
      <NotionPageBody
        blocks={blocks}
        pageId={page.id}
        databaseId={databaseId}
      />
    </div>
  );
};

export default BlogPage;

export async function generateStaticParams() {
  // This generates routes using the slugs created from getParsedPages
  const pages = await getParsedPages<BlogPageObjectResponse>(databaseId);
  return pages.map((page) => ({
    slug: page.slug,
  }));
}
