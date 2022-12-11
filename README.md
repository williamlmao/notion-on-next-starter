# Notion-on-next

> **Warning**
> This repository uses Next.js version 13, which is currently in beta. Use at your own risk.

# Setup

To get started, clone the repository and install its dependencies:

```
git clone https://github.com/williamlmao/notion-on-next-starter.git
cd notion-on-next-starter
npm install
```

Next, create a new repository for yourself and [set its remote URL](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories) using the following command:

```
git remote set-url origin your_new_remote_url_here
```

Duplicate [this page](https://liuwill.notion.site/notion-on-next-3b6292c8a6fe4dbaa12f9af26cffe674) in your Notion account. It contains two databases that are used in this starter kit.

Next, [create an integration](https://developers.notion.com/docs/create-a-notion-integration) and connect it to the page you just duplicated. Adding a connection at that page will automatically add the connection to both databases.

Next, create a .env file in your root directory and add the following line to it, replacing 'yoursecret' with the secret you obtained when creating the integration:

```
NOTION_KEY=yoursecret
```

Next, run the following command to set up your databases:

```
npx non setup
```

You will be prompted to enter the IDs. You can find the IDs of your databases by clicking the share button in the top right corner of the database and copying the ID from the URL.

Next, replace the databaseId in the following files with your database ID:

- `app/programming/page.tsx`
- `app/programming/[slug]/page.tsx`
- `app/dogs/page.tsx`
- `app/dogs/[slug]/page.tsx`

Finally, start the development server with:

```
npm run start
```

You will notice that the site can be somewhat slow when you are developing locally. This is because your local server is fetching data from the Notion API whenever you refresh or load a new page. However, once you run a production build of the site, it will be much faster.

From here, you can edit the databases to suit your needs. If you update any database properties, run npx non types to regenerate your types. After adding any images or videos, run: npx non media. Note that media URLs from the Notion API expire after one hour, so notion-on-next downloads all of your media to your public folder.

# Understanding the code

The starter kit is a fairly barebones Next 13 app. If you're not familiar with Next 13, check out the [Next 13 docs](https://beta.nextjs.org/docs/getting-started) to get started.

This starter kit is connected to two databases which translate to the routes:

- localhost:3000/programing
- localhost:3000/dogs

Each of these routes correspond to a `page.tsx` file. These `page.tsx` files are responsible for fetching all of the pages in in their respective database and rendering links to each page.

- /app/programing/page.tsx
- /app/dogs/page.tsx

Within each /programming and /dogs, you'll more `page.tsx` files. These files are responsible for fetching the content for a single page from their respective database, and rendering it. They also contain the `generateStaticParams` function which is a Next 13 function that tells Next 13 which pages to generate at build time.

- /app/programing/[slug]/page.tsx | matching route: localhost:3000/programing/[slug]
- /app/dogs/[slug]/page.tsx | matching route: localhost:3000/dogs/[slug]

# Using notion-on-next

You can find more documentation on all of the functions and components available in the [main notion-on-next repo](https://github.com/williamlmao/notion-on-next)
