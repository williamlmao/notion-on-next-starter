import Link from "next/link";
import Image from "next/image";
import _mediaMap from "../../public/notion-media/media-map.json";
import { mediaMapInterface } from "notion-on-next/types/types";
import { DogsPageObjectResponse } from "../../types/notion-on-next.types";
const mediaMap: mediaMapInterface = _mediaMap;

export const DogsPageCard = ({
  page,
  databaseId,
}: {
  page: DogsPageObjectResponse;
  databaseId: string;
}) => {
  console.dir(page, { depth: null });
  return (
    <div className="w-[350px] h-[350px] relative group">
      <div className="w-[350px] h-[350px] rounded-md absolute group-hover:bg-black opacity-70 text-white transition ease-in-out"></div>
      <div className="w-[350px] h-[350px] absolute text-white">
        <div className="opacity-0 group-hover:opacity-100 p-4 transition ease-in-out">
          <div className="text-lg lg:text-2xl font-semibold">{page.title}</div>
          <div>
            Bred for{" "}
            <span className={`lowercase`}>
              {page.properties.Type.select?.name}
            </span>
          </div>
          <div>
            Weighs{" "}
            <span className={`lowercase`}>
              {page.properties["Average Weight (lbs)"].number}
            </span>{" "}
            lbs on average
          </div>
        </div>
        <div className="">
          {page.properties["Photo by URL"].url && (
            <a
              className="absolute bottom-2 left-2 drop-shadow-2xl shadow-2xl hover:text-blue-200"
              href={page.properties["Photo by URL"].url}
            >
              {/* @ts-ignore - Notion API is wrong about text types */}
              Photo by {page.properties["Photo By"].rich_text[0]?.plain_text}
            </a>
          )}
        </div>
      </div>
      <Image
        alt={page.title || "Cover Image for " + page.id}
        src={mediaMap[databaseId]?.[page.id]?.cover}
        className="w-[350px] h-[350px] object-cover rounded-md"
        width={350}
        height={350}
      />
    </div>
  );
};
