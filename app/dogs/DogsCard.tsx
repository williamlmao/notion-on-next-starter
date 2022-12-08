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
  return (
    <Link href={`/dogs/${page.slug}`} key={page.id}>
      <div className="flex flex-col md:flex-row outline outline-2 outline-black rounded-md mx-6 md:mx-12 hover:shadow-xl hover:outline-4">
        <Image
          alt={page.title || "Cover Image for " + page.id}
          src={mediaMap[databaseId]?.[page.id]?.cover}
          className="h-auto w-full md:w-1/2 object-cover"
          width={300}
          height={300}
        />
        <div className="p-4 flex flex-col gap-4">
          <div className="text-lg lg:text-2xl font-semibold">{page.title}</div>
          <div className="">
            <span
              className={`mr-2 px-2 py-1 rounded-lg text-white`}
              // can't use template literal to pull tag.color into a tailwind class, so we have to use the style prop.
              style={{ backgroundColor: page.properties.Type.select?.color }}
              key={page.properties.Type.select?.name}
            >
              {page.properties.Type.select?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
