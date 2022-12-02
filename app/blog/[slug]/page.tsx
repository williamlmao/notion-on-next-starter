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
