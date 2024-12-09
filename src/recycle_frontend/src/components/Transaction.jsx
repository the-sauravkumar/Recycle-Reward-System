import React, { useEffect, useState } from "react";
import { recycle_backend } from "../../../declarations/recycle_backend";
import { useAuth } from "../context/AuthContext"; // Assuming you use AuthContext for the user principal
import "./Transaction.css"; // Import the CSS for styling

function Transaction() {
  const { principal } = useAuth();  // Assuming you're getting the `principal` from context
  const [transactions, setTransactions] = useState([]);
  const [nfts, setNfts] = useState([]);  // State to track NFTs
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions and NFTs from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user transactions (Recycling)
        const userTransactions = await recycle_backend.getCurrentTransaction(); // Fetch data
        console.log("Fetched Transactions:", userTransactions);
        
        // Fetch user's NFTs
        const userNFTs = await recycle_backend.getOwnedNFTs(principal);  // Pass principal as argument
        console.log("Fetched NFTs:", userNFTs);

        // Get the timestamp for each NFT
        const nftDetails = await Promise.all(
          userNFTs.map(async (nft) => {
            return {
              transactionType: "Minted NFT",
              details: "Minted by User",
              timestamp: Date.now(), // Fallback to current time if no timestamp found
            };
          })
        );

        // Combine both transaction and NFT data into one list
        const combinedTransactions = [
          ...userTransactions.map((transaction) => ({
            transactionType: "Recycling Submission",
            details: transaction.details,
            timestamp: transaction.timestamp,
          })),
          ...nftDetails, // Include the NFT details with timestamps
        ];

        setTransactions(combinedTransactions);  // Update state with combined data
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (principal) {
      fetchData();  // Ensure principal is available before fetching data
    }
  }, [principal]);

  useEffect(() => {
    console.log("Transaction Data (State):", transactions);
  }, [transactions]);

  return (
    <div className="transaction-container">
      <h1>Transaction History</h1>

      {/* Show error message if an error occurred */}
      {error && <p className="error-message">{error}</p>}

      {/* Show loading indicator */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="transaction-table-container">
          {transactions.length > 0 ? (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Transaction Type</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.details}</td>
                    <td>
                    {transaction.transactionType === "Minted NFT"
                        ? new Date(Number(transaction.timestamp)).toLocaleString()
                        : new Date(Number(transaction.timestamp) / 1e6).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Transaction;
