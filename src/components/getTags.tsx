import React from 'react'
import Link from 'next/link'
import { getTagLink } from '../lib/blog-helpers'

type typeTag = {
  tag: string
}

class TagList extends React.Component<typeTag> {
  constructor(props: typeTag) {
    super(props)
    this.state = {
      updatedTag: '',
    }
  }

  componentDidMount() {
    this.setState({
      updatedTag: this.props.tag,
    })
  }

  render() {
    return (
      <div
        key={this.props.tag}
        style={{
          marginRight: '10px',
          fontSize: '16px',
          display: 'inline-block',
        }}
      >
        <Link href={'/blog/tag/[tag]'} as={getTagLink(this.props.tag)}>
          <a>#{this.props.tag}</a>
        </Link>
      </div>
    )
  }
}

export default TagList
