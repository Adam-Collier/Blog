import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
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

const Footer = styled.footer`
  padding-top: ${rhythm(1)};
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <GlobalStyle />
        <header>{header}</header>
        <main>{children}</main>

        <Footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Footer>
      </div>
    )
  }
}

export default Layout
