import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <main>
        <div className="mx-auto  flex justify-center items-center">
          <div className="max-w-[700px] p-12 mb-[200px]">
            <h1 className="text-4xl font-bold md:pt-24">
              <span className="">Build Next + Notion apps easily with</span>{" "}
              <span className="text-gray-500">notion-on-next</span>
            </h1>
            <Section title="Why?">
              <ul className="flex flex-wrap gap-2">
                <Tag text="⚡️ Fast" />
                <Tag text="💵 Free" />
                <Tag text="📖 Open Source" />
                <Tag text="💯 Lighthouse Scores" />
                <Tag text="🖍 Edit in Notion" />
                <Tag text="⌨️ Automatic Types" />
                <Tag text="🏞 Automatic Image Optimization" />
                <Tag text="🔧 Customizable" />
              </ul>
            </Section>
            <hr />
            <Section
              title="Examples"
              description="You can use notion-on-next to connect to multiple databases! The
              examples below show two different databases being used in
              different ways."
            >
              <div className="grid md:grid-cols-1 gap-4">
                <Card
                  url={"/programming"}
                  title="Programming Blog"
                  description="An example to show how you would use notion-on-next to build a blog."
                />
                <Card
                  url={"/dogs"}
                  title="Dog Breeds"
                  description="You can use notion-on-next for content other than blog posts too! This example displays a database of dog breed info."
                />
                <Card
                  url="https://notion-on-next-starter.vercel.app/programming/Notion-on-next-Supported-Blocks-Examples"
                  title={"Supported Block Examples"}
                  description="Clone this repo and follow the setup instructions to connect and deploy your app in minutes!"
                />
              </div>
            </Section>
            <hr />
            <Section
              title="Repositories"
              description="You can find documentation in either readme"
            >
              <div className="grid md:grid-cols-2 md:grid-rows-1 gap-4">
                <Card
                  url={"https://github.com/williamlmao/notion-on-next"}
                  title={<TitleWithGithubIcon text="notion-on-next" />}
                  description="The primary repo for this library. Use this if you want to install in an existing app, or if you want to build a new app from scratch."
                />
                <Card
                  url="https://github.com/williamlmao/notion-on-next-starter"
                  title={<TitleWithGithubIcon text="notion-on-next-starter" />}
                  description="Use this repo if you want most of the setup handled for you. Clone it, connect your databases, and customize from there. Comes preloaded with Tailwind."
                />
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

const Tag = ({ text }: { text: string }) => {
  return (
    <li className="whitespace-nowrap bg-gray-100 py-2 px-4 rounded-md">
      {text}
    </li>
  );
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p>{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
};

const Card = ({
  url,
  title,
  description,
}: {
  url: string;
  title?: string | React.ReactNode;
  description?: string;
}) => {
  return (
    <div className="w-full h-full shadow-sm hover:shadow-lg  rounded-md outline-gray-100  outline-1 outline transition ease-in-out hover:-translate-y-1">
      <Link href={url}>
        <div className="p-8 md:p-12">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </Link>
    </div>
  );
};

const TitleWithGithubIcon = ({ text }: { text: string }) => {
  return (
    <div className="">
      <div className="h-8 w-8 ">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="#24292f"
          />
        </svg>
      </div>
      <div className="whitespace-nowrap">{text}</div>
    </div>
  );
};
