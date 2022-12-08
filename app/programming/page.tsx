import Link from "next/link";
import { ProgrammingPageObjectResponse } from "../../types/notion-on-next.types";
import { cachedGetParsedPages } from "../get";
import { ProgrammingPageCard } from "./ProgrammingPageCard";

const databaseId = "5b3247dc-63b8-4fd1-b610-5e5a8aabd397";

export default async function Blog() {
  const pages = await cachedGetParsedPages<ProgrammingPageObjectResponse>(
    databaseId
  );
  return (
    <div>
      <main>
        <Link href="/blog" />
        <h1 className="text-center font-bold text-3xl m-6 md:m-12">Posts</h1>
        <div className="flex flex-col justify-center gap-8 max-w-[700px] mx-auto mb-12">
          {pages.map((page) => (
            <ProgrammingPageCard
              page={page}
              databaseId={databaseId}
              key={page.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
