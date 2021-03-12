import React from 'react'

type typeRaneItems = {
  url: string
  source: string
}
type typeImageListProps = {
  raneItems: typeRaneItems[]
}

class ImageList extends React.Component<typeImageListProps> {
  listItems = (items: typeRaneItems[]) => {
    return (
      <div className="flex flex-col">
        {items.map((item: typeRaneItems, index: number) => {
          return (
            <div key={index} id="hov_img">
              <div className="m-1 max-w-xs" id="hov_img">
                <ListItem url={item.url} source={item.source} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return <div>{this.listItems(this.props.raneItems)}</div>
  }
}
export default ImageList

function ListItem(props: typeRaneItems) {
  return (
    <a href={props.source} target="_blank" rel="noopener noreferrer">
      <img className="hov_img" src={props.url} alt="" />
    </a>
  )
}
