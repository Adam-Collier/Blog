---
title: Creating a Blog with Vuepress
date: "2018-08-05T00:00:00.000Z"
featuredImage: "./featured-image.jpeg"
---

Vuepress is the new hotness when it comes to static site generators. Vue creator Evan You developed this tool to write documentation, however it is so powerful and flexible it can be fully customised to fit your needs 💪. Today I’m going to show you how to create a blog using Vuepress.

This tutorial presumes you have a basic understanding of Vuepress.

The structure of this project:

```bash
.
├── docs
│   ├── .vuepress
│   │   ├── components
│   │   │   └── Posts.vue
│   │   ├── config.js
│   │   └── public
│   │       ├── image.jpg
│   │       ├── image-1.jpg
│   │       └── image-2.jpg
│   ├── README.md
│   └── interviews
│       ├── README.md
│       ├── post-1.md
│       ├── post-2.md
│       ├── post-3.md
│       └── post-4.md
├── package-lock.json
└── package.json

```

## Creating the posts

Make a new directory with a name of your choice inside docs, in this instance we will call it interviews. Inside interviews we can create our markdown files and call them whatever we like with one exception, if a README.md exists that acts as the base path for that route.

e.g theREADME.md in the interviews directory will be shown at /interviews/

In order for us to gather and order our posts we are going to utilise how Vuepress uses frontmatter. At the top of every markdown file we created in the interview directory we are going to add some yaml:

```yaml
---
image: /example-image.jpg
title: Example title
description: This is the example description for our first post.
date: 03-25-18 (mm-dd-yy)
---

```

The property and values should be swapped and changed depending on the post. This should be all be pretty self evident, however if it isn’t it will make sense later on.

## Vue Component

If you look at the structure of the project earlier in this post you will see a .vuepress directory, this is where we are able to customise Vuepress.

Note: If you wanted to create your own theme you could eject Vuepress and use the default theme as a starting point.

In the components folder create a Posts.vue file with the following code:

```vue
<template>
  <div class="posts" v-if="posts.length">
    <div class="post" v-for="post in posts">
      <router-link :to="post.path">
        <div>
          <img
            v-if="post.frontmatter.image"
            :src="$withBase(post.frontmatter.image)"
            alt=""
          />
        </div>
        <h2>{{ post.frontmatter.title }}</h2>
        <p>{{ post.frontmatter.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["page"],
  computed: {
    posts() {
      let currentPage = this.page ? this.page : this.$page.path
      let posts = this.$site.pages
        .filter(x => {
          return x.path.match(new RegExp(`(${currentPage})(?=.*html)`))
        })
        .sort((a, b) => {
          return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
        })
      return posts
    },
  },
}
</script>
```

When Vue files are created in /components they are automatically registered as global, async components (Make sure a custom component’s name either contains a hyphen or is in PascalCase).

Note: When we use the component in our markdown it will look like <Posts page="interviews"> (where the page prop is optional)

To explain a little bit what is going on here in our script tags we are first making our props value available to our component. We then declared a computed property posts. currentPage then either takes the value of the page prop which has been passed down or the current path base name (in this example that would be /interviews/)

this.\$site.pages grabs the metadata for each page of the site and from that we can access the path for each page. The filter method iterates over all of the pages and returns only those that match the value of currentPage and has a .html extension. We do this so our grid/list only shows posts from the directory we want.

Now this is where the front matter data comes in. We access the date via .frontMatter.date, create a new Date object and then return an array with the all of the posts ordered latest to oldest.

In our template the v-if directive checks if any posts exist, if no posts exist then the div doesn’t render. The v-for directive loops through all of the posts, each one becoming available within the scope of the loop as a post. This concept should feel very familiar if you have used for of in javascript. For SPA we use router-link instead of <a href=""></a> since we want to intercept the click event so that the browser doesn’t try to reload the page.

Now its plain sailing from here, we create elements for an image, header and description and use the frontmatter from each post to populate each one with data.

Note: the img src presumes you have all of your images within the public folder of your .vuepress directory.

## Config.js

Next we are going to create a config.js file in .vuepress directory with the following:

```js
module.exports = {
  title: "Example",
  description: "test",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Interviews", link: "/interviews/" },
    ],
  },
}
```

This is a very basic config which adds your site title and some links to your nav. You can explore the options available in more detail at [https://vuepress.vuejs.org/config/](https://vuepress.vuejs.org/config/)

## Bringing it all together

Now we have written our component we can use it in our markdown. In our Interviews README.md we can add<Posts /> and all of the posts from interviews will be rendered, hoorah! Notice how we didn’t pass any props? This is because we only want the posts within that directory. However, if we wanted posts from interviews to show on the homepage we would add<Posts page="interviews" /> to our docs README.md and it would show all of our interview posts on our homepage!

The component it is totally reusable and we can use it any number of times, this means if we have multiple directories full of posts we could do something like:

```js
<Posts page="interviews" />
<Posts page="travel" />
```

and it would render the posts from each collection 🙌

## Styles

Bear in mind this example is just using the native Vuepress styles. To customise further (which i recommend you do) you can add your own styles, more about that can be found at [https://vuepress.vuejs.org/default-theme-config/#simple-css-override](https://vuepress.vuejs.org/default-theme-config/#simple-css-override).

## Le fin

I hope this post has been useful and helps improve your understanding of one possible solution to create a blog in Vuepress.

I have created a more complete example at [https://adam-collier.github.io/Midl/](https://adam-collier.github.io/Midl/) however this was firstly ejected and a lot of the default styles and components were changed.

A benefit of following the approach dictated in this post is that none of the default Vuepress code has been modified, therefore you have the option to update Vuepress without any implications.

If you have any questions hit me up on twitter! [@collieradam](https://twitter/com/collieradam)
