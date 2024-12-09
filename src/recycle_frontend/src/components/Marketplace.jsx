import React, { useState, useEffect } from "react";
import "./Marketplace.css"; // Import the CSS for styling

function Marketplace() {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the NFT marketplace data
    const fetchNfts = async () => {
      try {
        setIsLoading(true);
        // Simulate fetching NFT data
        const marketplaceData = [
          { id: 1, name: "EcoEagle", image: "/images/EcoEagle.png" }, // Local image path
          { id: 2, name: "GreenGiraffe", image: "/images/GreenGiraffe.png" }, // Local image path
          { id: 3, name: "RecyclingRaccoon", image: "/images/RecyclingRaccoon.png" }, // Local image path
          { id: 4, name: "SolarSeal", image: "/images/SolarSeal.png" }, // Local image path
          { id: 5, name: "CarbonCrane", image: "/images/CarbonCrane.png" }, // Local image path
          { id: 6, name: "BioBeaver", image: "/images/BioBeaver.png" }, // Local image path
          { id: 7, name: "WindWhale", image: "/images/WindWhale.png" }, // Local image path
          { id: 8, name: "EcoElephant", image: "/images/EcoElephant.png" }, // Local image path
          { id: 9, name: "ForestFox", image: "/images/ForestFox.png" }, // Local image path
          { id: 10, name: "RiverOtter", image: "/images/RiverOtter.png" }, // Local image path
          { id: 11, name: "SustainableSloth", image: "/images/SustainableSloth.png" }, // Local image path
          { id: 12, name: "PlanetPanda", image: "/images/PlanetPanda.png" }, // Local image path
        ];
        setNfts(marketplaceData);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNfts();
  }, []);

  const handleBuy = async (id, name) => {
    try {
      // Simulate recording transaction
      console.log(`Purchased NFT: ${name}`);
      // Optionally, send the transaction to the backend:
      // await recycle_backend.recordTransaction({ id, name });

      // Remove the purchased NFT from the list
      setNfts((prevNfts) => prevNfts.filter((nft) => nft.id !== id));
    } catch (err) {
      console.error("Error purchasing NFT:", err);
    }
  };

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="marketplace-grid">
          {nfts.map((nft) => (
            <div className="marketplace-card" key={nft.id}>
              <img
                src={nft.image} // Use the local image path directly
                alt={nft.name}
                className="nft-image"
                width="150" // Set width to 150px
                height="150" // Set height to 150px
              />
              <h2>{nft.name}</h2>
              <button
                className="buy-button"
                onClick={() => handleBuy(nft.id, nft.name)}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
