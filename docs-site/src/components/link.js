import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

const GatsbyLink = ({ title, url, fullUrl }) => {
  let prefix = ''
  if (typeof window !== 'undefined') {
    prefix = window.location.pathname
  }
  const item = { title, url }
  // if using full url (url for different page) use gatsby link, else the prefix won't get added
  if (fullUrl) {
    return <StyledGatsbyLink to={fullUrl}>{item.title}</StyledGatsbyLink>
  }

  return <StyledLink href={prefix + item.url}>{item.title}</StyledLink>
}

const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.secondary};
  display: inline;
  padding: 0.2rem 0;
  width: 100%;
  text-decoration: none;
  transition: color ${(p) => p.theme.transition};
  &:hover,
  &:focus {
    color: ${(p) => p.theme.colors.primary};
  }
`

const StyledGatsbyLink = styled(Link)`
  color: ${(p) => p.theme.colors.secondary};
  display: inline;
  padding: 0.2rem 0;
  width: 100%;
  text-decoration: none;
  transition: color ${(p) => p.theme.transition};
  &:hover,
  &:focus {
    color: ${(p) => p.theme.colors.primary};
  }
`

Link.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  fullUrl: PropTypes.string
}

export default GatsbyLink
