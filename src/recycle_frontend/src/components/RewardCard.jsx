import React, { useState } from "react";
import "./RewardCard.css";
import { recycle_backend } from "../../../declarations/recycle_backend";
import { useAuth } from "../context/AuthContext";

function RewardCard() {
  const { principal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [formData, setFormData] = useState({
    materialType: "plastic",
    quantity: "",
    receiptNo: "",
    location: "",
    additionalInfo: "",
  });

  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      const data = await recycle_backend.getLeaderboardData();
      setLeaderboardData(data); // Update leaderboard state
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
    }
  };

  // Function to update transactions in "My Transactions"
  const updateTransactions = async () => {
    try {
      const userTransactions = await recycle_backend.getTransactionsByPrincipal(principal);
      console.log("Updated transactions:", userTransactions);
  
      if (Array.isArray(userTransactions) && userTransactions.length === 0) {
        console.log("No transactions found for this principal.");
      } else {
        console.log("Transactions retrieved:", userTransactions);
      }
    } catch (err) {
      console.error("Error updating transactions:", err);
    }
  };
  

  const handleButtonClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { materialType, quantity, receiptNo, location, additionalInfo } = formData;

      // Call backend to submit recycling data
      await recycle_backend.submitRecycling(
        materialType,
        parseInt(quantity),
        receiptNo,
        location,
        additionalInfo
      );

      // Refresh leaderboard and transactions
      await fetchLeaderboardData();
      await updateTransactions();

      alert("Recycling submitted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting recycling data:", err);
      alert("Failed to submit recycling data.");
    }
  };

  return (
    <div className="reward-card-container">
      <div className="reward-card">
        <div className="card-content">
          <h2>Get Rewards to Recycle and Join the Hero Recycle Board Today!</h2>
          <p>See where you stand amongst the Recycle Reward's top contributors</p>
        </div>
        <button className="recycle-now-btn" onClick={handleButtonClick}>
          Recycle Now!
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Recycle Submission</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="materialType">Material Type:</label>
                <select id="materialType" onChange={handleChange}>
                  <option value="plastic">Plastic</option>
                  <option value="glass">Glass</option>
                  <option value="paper">Paper</option>
                  <option value="gadget">Gadget</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity (kg):</label>
                <input
                  type="number"
                  id="quantity"
                  placeholder="Enter kg"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="receiptNo">Receipt No:</label>
                <input
                  type="text"
                  id="receiptNo"
                  placeholder="Enter receipt no"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location of Recycle Center:</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter location"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="additionalInfo">Anything Else?</label>
                <input
                  type="text"
                  id="additionalInfo"
                  placeholder="Add info or description"
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardCard;
