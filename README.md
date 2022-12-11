# Notion-on-next

```
WARNING: This repo uses Next 13, which is still in beta at time of writing. Use at your own risk.
```

# Setup

1. `git clone https://github.com/williamlmao/notion-on-next-starter.git`
2. `cd notion-on-next-starter`
3. Create a new repo for yourself and [switch the remote](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories) using `git remote set-url origin your_new_remote_url_here`
4. Duplicate this page into your Notion account. It contains two databases used in this starter kit.
5. [Create an integration](https://developers.notion.com/docs/create-a-notion-integration) with both of the databases.
6. `npm install`
7. Create .env file in your root directory and add `NOTION_KEY=yoursecret` (you should have gotten your secret in the step above)
8. `npx non setup`. Enter the two database IDs that you duplicated when prompted.
9. `npm run start`

You'll notice that the site can be somewhat slow when you are developing locally. This is because your local server is fetching data from the Notion API whenever you are refreshing or loading a new page. However, once you run a production build of the site, it will be super fast!

From here, you can edit the databases to suit your needs. If you update any database properties, run `npx non types` to regenerate your types. After adding any images/videos, run: `npx non media`. [Media URLs from the Notion API expire after an hour](https://developers.notion.com/docs/working-with-files-and-media#retrieving-files-and-media-via-the-notion-api), which is why notion-on-next downloads all of your media to your public folder.

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
