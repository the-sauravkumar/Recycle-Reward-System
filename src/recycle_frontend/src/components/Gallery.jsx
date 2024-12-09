import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {
  const [items, setItems] = useState([]);

  // Function to add a new NFT dynamically
  const addItem = (NFTId) => {
    setItems((prevItems) => [
      ...prevItems,
      <Item id={NFTId} key={NFTId.toText()} role={props.role} />,
    ]);
  };

  useEffect(() => {
    if (props.ids && props.ids.length > 0) {
      setItems(
        props.ids.map((NFTId) => (
          <Item id={NFTId} key={NFTId.toText()} role={props.role} />
        ))
      );
    }
  }, [props.ids]);

  // Expose the addItem function via props
  props.onAddItem(addItem);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
