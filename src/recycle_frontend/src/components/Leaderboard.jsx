import React, { useEffect, useState } from "react";
import { recycle_backend } from "../../../declarations/recycle_backend";
import "/home/saurav/recycle/src/recycle_frontend/src/components/Leaderboard.css"; // Optional CSS for styling

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors


  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true); // Start loading
        setError(null); // Reset error
        const data = await recycle_backend.getLeaderboardData();
        setLeaderboardData(data);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    console.log("Leaderboard Data (State):", leaderboardData);
  }, [leaderboardData]);
  

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>

      {/* Show error message if an error occurred */}
      {error && <p className="error-message">{error}</p>}

      {/* Show loading indicator */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Recycled (kg)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.totalRecycled.toString()}</td> {/* Convert BigInt to String */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;


