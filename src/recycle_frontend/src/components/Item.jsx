import React, { useEffect, useState } from "react";
import logo from "../../public/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { recycle_backend } from "../../../declarations/recycle_backend";
import { useAuth } from "../context/AuthContext";
import PriceLabel from "./PriceLabel";


function Item(props) {
  const { principal: currentUserId } = useAuth();
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();

  const id = props.id;

  const localHost = "http://127.0.0.1:3000/";
  const agent = new HttpAgent({ host: localHost });
  
  //remove this line when live deploy (only work locally)
  agent.fetchRootKey();

  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    if (!imageData || imageData.length === 0) {
      console.error("No image data found for this NFT");
      return;
    }
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    if(props.role == "collection"){
    
    const nftListed = await recycle_backend.isListed(props.id);

    if(nftListed){
      setOwner("Recycle");
      setBlur({filter: "blur(4px)"});
      setSellStatus("Listed");
    }else{

      setButton(<Button handleClick={handleSell} text={"Sell"}/>);
    }
  }else if(props.role == "marketplace") {
    const originalOwner = await recycle_backend.getOriginalOwner(props.id);
    if(originalOwner.toText() != currentUserId.toText()){
      setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
    }

    const price = await recycle_backend.getListedNFTPrice(props.id);
    setPriceLabel(<PriceLabel sellPrice={price.toString()}/>);

  }
    
  }

  useEffect(() => {
    loadNFT();
  }, []);


  let price;
  function handleSell(){
    console.log("Sell Clicked");
    setPriceInput(
      <input
        placeholder="Price in RCT"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>);
  };

  async function sellItem(){
    setBlur({filter: "blur(4px)"});
    setLoaderHidden(false);
    console.log("Set Price" + price);
    const listingResult = await recycle_backend.listItem(props.id, Number(price));
    console.log("listing: "+listingResult);
    if(listingResult == "Success"){
      const recycleId = await recycle_backend.getRecycleCanisterID();
      const transferResult = await NFTActor.transferOwnership(recycleId);
      console.log(transferResult);
      if (transferResult == "Success"){
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("Recycle");
        setSellStatus("Listed")
      }
    }
    
  };

  async function handleBuy(){
    console.log("Buy clicked");
  };

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
