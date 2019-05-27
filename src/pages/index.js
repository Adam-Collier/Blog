import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

import styled from "styled-components"

const PostTitle = styled.h3`
  margin-bottom: ${rhythm(1 / 4)};

  a {
    text-decoration: none;
    color: #296eca;
    box-shadow: none;
  }
`

const Excerpt = styled.p`
  margin-bottom: ${rhythm(1 / 4)};
`

const Caption = styled.small`
  color: #c2c2c2;
  margin-bottom: ${rhythm(1)};
  display: block;

  p {
    display: inline;
    margin-right: ${rhythm(1 / 2)};
  }
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <PostTitle>
                <Link to={node.fields.slug}>{title}</Link>
              </PostTitle>
              <Excerpt
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
              <Caption>
                <p>{node.frontmatter.date}</p>
                <p>{node.timeToRead} min read</p>
              </Caption>
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
