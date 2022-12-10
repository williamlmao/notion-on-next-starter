import Link from "next/link";
import Image from "next/image";
import _mediaMap from "../../public/notion-media/media-map.json";
import { mediaMapInterface } from "notion-on-next/types/types";
import { ProgrammingPageObjectResponse } from "../../types/notion-on-next.types";
const mediaMap: mediaMapInterface = _mediaMap;

export const ProgrammingPageCard = ({
  page,
  databaseId,
}: {
  page: ProgrammingPageObjectResponse;
  databaseId: string;
}) => {
  return (
    <Link href={`/programming/${page.slug}`} key={page.id}>
      <div className="flex flex-col md:flex-row shadow-sm hover:shadow-lg  rounded-md outline-gray-100  outline-1 outline transition ease-in-out hover:-translate-y-1">
        <div className="md:w-1/2 h-[300px]  overflow-hidden">
          <Image
            alt={page.title || "Cover Image for " + page.id}
            src={mediaMap[databaseId]?.[page.id]?.cover}
            className="h-full w-full rounded-t-md md:rounded-l-md  md:rounded-tr-none object-cover object-center"
            width={800}
            height={800}
          />
        </div>

        <div className="p-4 flex flex-col gap-4 md:w-1/2">
          <div className="text-lg lg:text-2xl font-semibold">{page.title}</div>
          <div className="text-gray-400">
            {new Date(page.created_time).toLocaleDateString()}
          </div>
          <div className="">
            {/* @ts-ignore -- Notion Team currently has incorrect type for RichTextObjectResponse. The API returns an an array of RichTextObjectResponse inside of RichTextPropertyItemObjectResponse, but the type definition is not aware of that yet  */}
            {page.properties?.Description?.rich_text[0]?.plain_text}
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
  );
};
