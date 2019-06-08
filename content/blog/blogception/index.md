---
title: Blogception
date: "2019-05-27T00:00:00.000Z"
featuredImage: "./featured-image.jpg"
---

Within this post I'm going to be venturing into the world of Gatsby, creating a blog and then documenting about the blog within that (see why the post is called blogception 😅). I'm basically going to be writing the post whilst doing it so I'll try and document my thoughts and struggles and they come and go. Lets begin…

First of all we are going to get the [gatsby blog starter](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fgatsbyjs%2Fgatsby-starter-blog) up and running locally.

```bash
$ npx gatsby new my-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

I'm using npx here because I prefer not to have any node modules installed globally.
Now let's cd into the project and start our dev environment

```bash
$ cd my-blog
$ code . (this opens the directory in vs code which is my text editor of choice)
$ npm start (we can do this straight away because the command we used before automagically installed all of the dependencies)
```

Now lets view it in the browser at http://localhost:8000/

and boom! we quickly have a simple blog up and running 👏

First let's sort out our typography. By default Gatsby uses Typography.js which I'm going to keep in this case to save fiddling with font sizes and spacing (It also does a really good job in setting everything up for you).

I would like to include my own touches so I'm going to remove the wordpress theme and use the below in my Typography.js file

```js
import Typography from "typography"

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: ["Public-sans"],
  bodyFontFamily: ["Public-sans"],
  overrideThemeStyles: ({ rhythm }, options, styles) => ({
    code: {
      fontSize: rhythm(1 / 2),
    },
    body: {
      fontKerning: "auto",
    },
    a: {
      color: "#6a42ed",
    },
  }),
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
```

You will notice I am adding my own font-family, I will show you how to set that up in a second. I am also overriding some of the styles which typography.js created. I’m changing the font size of any code blocks added in the markdown, changing the font kerning to prevent our next and previous links from wrapping and changing the link colours for the blog.

I wanted to try out a new font called [Public Sans](https://public-sans.digital.gov/) which is a new typeface developed recently by the US government. I stumbled upon this in a newsletter I’m signed up to called [Fresh Fonts](http://freshfonts.io/) (which I recommend checking out btw 😉). I grabbed a couple of the .woff2 files (which are smaller than .ttf and web optimised), created a font directory in our src and put them in there.

To make things a little bit easier (and because I kinda wanted to learn them) I added [styled components](https://www.styled-components.com/) to the project. To do this you need to run `npm install — save gatsby-plugin-styled-components styled-components babel-plugin-styled-components` in your terminal and then add `gatsby-plugin-styled-components` to your plugins in your gatsby-config.js.

Since the Layout component can be seen as a starting point for each page it made sense to put the global styles in there, it looked something like the below:

```js
import styled, { createGlobalStyle } from "styled-components"
import PublicSansMedium from "../fonts/PublicSans-Medium.woff2"
import PublicSansSemiBold from "../fonts/PublicSans-SemiBold.woff2"

const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: "Public-sans";
  font-style: normal;
  font-weight: normal;
  src: local("Public Sans"), local("Public Sans"),
    url(${PublicSansMedium}) format("woff2");
}
@font-face {
  font-family: "Public-sans";
  font-style: normal;
  font-weight: bold;
  src: local("Public Sans"), local("Public Sans"),
    url(${PublicSansSemiBold}) format("woff2");
}
`
```

An important thing to note here is the importing of the font files (without this it wont work). Then in our render method we just add `<GlobalStyle />` (I added it after our main element.)

And there we go! Our own font is now being used in the project 💃

Now we are going to add a featured image to each of our posts. Within our blog content directory we are going to add a featured image into each folder (alongside your index.md files), for now let’s call it featured-image.jpeg. We are then gonna add it to our frontmatter in our markdown file e.g:

```yaml
---
title: Creating a Masonry Layout using CSS Grid
date: "2019-05-26"
featuredImage: "./featured-image.png"
---

```

We are going to go into our blog post template file import Image from “gatsby-image” and make some changes to the graphql query.

```js
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage {
          childImageSharp {
            sizes(maxWidth: 680) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
    }
  }
`
```

notice the addition of the featuredImage field. The childImageSharp part is doing some image processing for us (to keep the image sizes nice and small) and …GatsbyImageSharpSizes utilises the gatsby image plugin which we imported earlier. Our image is going to be fluid so we are going to give it a max width value and then we are ready to add it into the render.

```js
{
  post.frontmatter.featuredImage && (
    <Image
      sizes={post.frontmatter.featuredImage.childImageSharp.sizes}
      style={{
        marginBottom: rhythm(1),
        borderRadius: "1%",
      }}
    />
  )
}
```

here we are checking if `post.frontmatter.featuredImage exists` and if it does we are going to render the gatsby `Image` component. If it doesn’t exist then nothing is rendered to the page. What the Image component actually does is create a picture element with a srcset of images so more relevantly sized images are served to the user making the page quicker.

When actually writing the posts I want a nice looking code block with some line highlighting (because it looks cool on the React documentation). The blog starter comes with `gatsby-remark-prismjs` installed already but no theme installed so it looks a little lame at first.

I like the look of the prism one dark theme which can be found here. I grabbed the CSS from the repo and created a file called `prism-one-dark.css` at the root of my project. In our gatsby-browser.js we need to `require(“./prism-one-dark.css”)` so our styles can pull through. Now we need to append some extra styles to our file:

```css
.gatsby-highlight-code-line {
  background-color: #2b2f36;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid #f99;
}

/**
 * Add back the container background-color, border-radius, padding, margin
 * and overflow that we removed from <pre>.
 */
.gatsby-highlight {
  background-color: #383e49;
  border-radius: 0.3em;
  margin: 1.666rem 0;
  padding: 1.5rem;
  overflow: auto;
  font-size: 14px;
}

/**
 * Remove the default PrismJS theme background-color, border-radius, margin,
 * padding and overflow.
 * 1. Make the element just wide enough to fit its content.
 * 2. Always fill the visible space in .gatsby-highlight.
 * 3. Adjust the position of the line numbers
 */
.gatsby-highlight pre[class*="language-"] {
  background-color: transparent;
  margin: 0;
  padding: 0;
  overflow: initial;
  float: left; /* 1 */
  min-width: 100%; /* 2 */
}
```

which sorts out our line highlighting and make sure everything is spaced nicely within the block.

Now I want to deploy the blog 🙌 Some like to use netlify but at the moment I am slightly obsessed with Zeit’s Now platform. To deploy our project I added `“now-build”: “npm run build”` and `"deploy": "now"` to our package.json scripts. We also need a now.json file in the root of our project which is like so:

```json
{
  "version": 2,
  "name": "my-blog",
  "builds": [
    {
      "src": "package.json",
      "use": "@now/static-build",
      "config": {
        "distDir": "public"
      }
    }
  ]
}
```

Now simple run npm run deploy and all sorts of magic will deploy your project and it will be accessible from the interwebs!

In this post I’ve tried to give you a little insight into how I created my blog, I’ll admit I’ve left out a lot of the small styling adjustments I made but I’ve pushed it all up to a Github repo [here](https://github.com/Adam-Collier/Blog) in case you fancy a gander. If you have any questions HMU up [twitter](https://github.com/Adam-Collier/Blog)

Peace ✌️
