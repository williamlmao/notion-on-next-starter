import Link from "next/link";
import { DogsPageObjectResponse } from "../../types/notion-on-next.types";
import { cachedGetParsedPages } from "../get";
import { DogsPageCard } from "./DogsCard";

const databaseId = "12c9bf14-4f9a-429b-8fff-d63c58694c54";

export default async function Dogs() {
  const pages = await cachedGetParsedPages<DogsPageObjectResponse>(databaseId);
  return (
    <div>
      <main>
        <Link href="/dogs" />
        <div className="text-center  m-6 md:m-12">
          <h1 className="font-bold text-3xl">Dog Breeds</h1>
          <p className="text-gray-400 text-center">
            Hover for more information
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-[1600px] mx-auto mb-12">
          {pages.map((page) => (
            <DogsPageCard page={page} databaseId={databaseId} key={page.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
