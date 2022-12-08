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
        <h1 className="text-center font-bold text-3xl m-6 md:m-12">
          Dog Breeds
        </h1>
        <div className="flex flex-col justify-center gap-8 max-w-[700px] mx-auto mb-12">
          {pages.map((page) => (
            <DogsPageCard page={page} databaseId={databaseId} key={page.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
