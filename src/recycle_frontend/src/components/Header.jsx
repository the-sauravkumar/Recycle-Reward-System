import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route, Navigate } from "react-router-dom";
import logo from "../../public/logo.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { recycle_backend } from "../../../declarations/recycle_backend";
import WelcomeCard from "./WelcomeCard";
import Leaderboard from "./Leaderboard";
import RewardCard from "./RewardCard";
import Transaction from "./Transaction";
import Marketplace from "./Marketplace";
import { useAuth } from "../context/AuthContext";
import LoginPage from "./LoginPage";
import "./Header.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Header() {
  const [userNFTIds, setUserNFTIds] = useState([]);
  let galleryAddItem = null;
  const { isAuthenticated, principal, userName } = useAuth();

  // Fetch NFTs when authenticated
  async function getNFTs() {
    if (!principal || !isAuthenticated) return;

    try {
      const fetchedNFTIds = await recycle_backend.getOwnedNFTs(principal);
      setUserNFTIds(fetchedNFTIds);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    }
  }

  // Call getNFTs on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      getNFTs();
    }
  }, [isAuthenticated, principal]);

  const handleNewNFT = (NFTId) => {
    if (galleryAddItem) {
      galleryAddItem(NFTId); // Add the new NFT directly to the gallery
    }
    setUserNFTIds((prev) => [...prev, NFTId]); // Update state to ensure consistency
  };

  return (
    <BrowserRouter>
      <div className="app-root-1">
        <header className="AppBar-root">
          <div className="Toolbar-root">
            <div className="header-left-4"></div>
            <img className="header-logo-11" style ={{margin: "20px"}} src={logo} alt="Recycle Reward Logo" />
            <div className="header-vertical-9"></div>
            <h5 className="Typography-root header-logo-text">
              <Link to="/">Recycle Reward</Link>
            </h5>

            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>

            {/* Navigation Links */}
            <div className="header-nav-links">
              <Link to="/marketplace" className="header-nav-link">Green Marketplace</Link>
              <Link to="/minter" className="header-nav-link">Minter</Link>
              <Link to="/collection" className="header-nav-link">My NFTs</Link>
              <Link to="/transaction" className="header-nav-link">Transaction</Link>
            </div>
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <div className="content-container">
                    <WelcomeCard
                      userName={userName || "Ee Mun"}
                      profileImage="https://cataas.com/cat"
                      totalRecycled={200}
                      nftEarned={1}
                      ftEarned={1}
                    />
                    <RewardCard />
                    <Leaderboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/minter" 
              element={
                <ProtectedRoute>
                  <Minter refreshOwnedNFTs={getNFTs} onNewNFT={handleNewNFT} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/collection" 
              element={
                <ProtectedRoute>
                 
                  <Gallery 
                  title="My NFTs"
                  ids={userNFTIds}
                  role="collection"
                  onAddItem={(addItem) => (galleryAddItem = addItem)}/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/transaction" 
              element={
                <ProtectedRoute>
                  <Transaction />
                </ProtectedRoute>
              }
            />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default Header;
