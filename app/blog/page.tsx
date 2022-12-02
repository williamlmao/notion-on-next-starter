import Image from "next/image";
import Link from "next/link";
import { getParsedPages } from "../../notion-on-next";
import NotionOnNextConfig from "../../notion-on-next/config.json";
import mediaMap from "../../public/notion-media/media-map.json";
import { BlogPageObjectResponse, mediaMapInterface } from "../../types/types";
let typedmediaMap: mediaMapInterface = mediaMap;

export const databaseId = NotionOnNextConfig.databases.blog.databaseId;

export default async function Blog() {
  const pages = await getParsedPages<BlogPageObjectResponse>(databaseId);

  return (
    <div>
      <main>
        <Link href="/blog" />
        <h1 className="text-center font-bold text-3xl m-6 md:m-12">Posts</h1>
        <div className="flex flex-col justify-center gap-8 max-w-[700px] mx-auto mb-12">
          {pages.map((page) => (
            <Link href={`/blog/${page.slug}`} key={page.id}>
              <div className="flex flex-col md:flex-row outline outline-2 outline-black rounded-md mx-6 md:mx-12 hover:shadow-xl hover:outline-4">
                <Image
                  alt={page.title || "Cover Image for " + page.id}
                  src={
                    typedmediaMap[NotionOnNextConfig.databases.blog.databaseId][
                      page.id
                    ].cover
                  }
                  className="h-auto w-full md:w-1/2 object-cover"
                  width={300}
                  height={300}
                />
                <div className="p-4 flex flex-col gap-4">
                  <div className="text-lg lg:text-2xl font-semibold">
                    {page.title}
                  </div>
                  <div className="">
                    {new Date(page.created_time).toLocaleDateString()}
                  </div>
                  <div className="">
                    {/* @ts-ignore -- Notion Team currently has incorrect type for RichTextObjectResponse. The API returns an an array of RichTextObjectResponse inside of RichTextPropertyItemObjectResponse, but the type definition is not aware of that yet  */}
                    {page.properties.Description.rich_text[0].plain_text}
                  </div>
                  <div className="">
                    {page.properties.Tags.multi_select.map((tag, index) => {
                      return (
                        <span
                          className={`mr-2 px-2 py-1 rounded-lg text-white`}
                          // can't use template literal to pull tag.color into a tailwind class, so we have to use the style prop.
                          style={{ backgroundColor: tag.color }}
                          key={tag.name + index}
                        >
                          {tag.name}{" "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
