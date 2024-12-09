import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { recycle_backend } from '../../../declarations/recycle_backend';
import './WelcomeCard.css';

function WelcomeCard() {
  const { userName, principal } = useAuth();  // Use principal for fetching user-specific data
  const [userStats, setUserStats] = useState({ totalRecycled: 0, nftsEarned: 0, ftsEarned: 0 });
  const [ownedNFTs, setOwnedNFTs] = useState([]);  // State to track owned NFTs
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user-specific data by mapping leaderboard data
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!principal) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the leaderboard data
        const leaderboardData = await recycle_backend.getLeaderboardData();

        // Find the user's data by matching their name
        const userData = leaderboardData.find(user => user.name === userName);

        if (userData) {
          const updatedStats = {
            totalRecycled: userData.totalRecycled || 0,
            nftsEarned: userData.nftsEarned || 0,
            ftsEarned: userData.ftsEarned || 0,
          };

          setUserStats(updatedStats);

          // Log the updated stats
          console.log("Updated User Stats:", updatedStats);
        } else {
          // If the user isn't on the leaderboard, set default values
          const defaultStats = { totalRecycled: 0, nftsEarned: 0, ftsEarned: 0 };
          setUserStats(defaultStats);

          // Log the default values
          console.log("Default User Stats:", defaultStats);
        }

        // Fetch owned NFTs and update the count
        const fetchedNFTs = await recycle_backend.getOwnedNFTs(principal);
        console.log("Owned NFTs:", fetchedNFTs.map(nft => nft.toText()));

        setOwnedNFTs(fetchedNFTs);
        setUserStats(prevStats => ({
          ...prevStats,
          nftsEarned: fetchedNFTs.length,  // Update the NFT count
        }));
        
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError("Failed to load user stats. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [principal, userName]);  // Re-run when principal or userName changes

  // Function to update stats when a new NFT is minted
  const handleNewNFT = async () => {
    try {
      const fetchedNFTs = await recycle_backend.getOwnedNFTs(principal);
      console.log("Updated Owned NFTs:", fetchedNFTs.map(nft => nft.toText()));

      setOwnedNFTs(fetchedNFTs);
      setUserStats(prevStats => ({
        ...prevStats,
        nftsEarned: fetchedNFTs.length,  // Update the NFT count
      }));
    } catch (error) {
      console.error('Error fetching new NFTs:', error);
    }
  };

  return (
    <div className="card-container">
      <div className="welcome-card">
        <div className="profile-section">
          <img
            src={"https://cataas.com/cat"}
            alt="Profile"
            className="profile-image"
          />
          <div className="welcome-text">
            <h2>
              Welcome Back, {userName || 'User'}
            </h2>
            <p>We're so glad to have you on Recycle Reward</p>
          </div>
        </div>
        <div className="stats-section">
          {error ? (
            <p className="error-message">{error}</p>
          ) : isLoading ? (
            <p>Loading stats...</p>
          ) : (
            <>
              <div className="stat">
                <h3>{userStats.totalRecycled.toString()} kg</h3>
                <p>Total Recycled</p>
              </div>
              <div className="stat">
                <h3>{userStats.nftsEarned.toString()}</h3>
                <p>NFTs Earned</p>
              </div>
              <div className="stat">
                <h3>{userStats.ftsEarned.toString()}</h3>
                <p>FTs Earned</p>
              </div>
            </>
          )}
        </div>
        {/* <button onClick={handleNewNFT}>Refresh NFTs</button>  Button to manually refresh NFT count */}
      </div>
    </div>
  );
}

export default WelcomeCard;
