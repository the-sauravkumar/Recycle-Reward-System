import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, updateUserName, isAuthenticated, userName } = useAuth();
  const [name, setName] = useState(userName || ""); // Initialize with userName if available
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect if the user is authenticated and has a name
    if (isAuthenticated && userName) {
      navigate("/");
    }
  }, [isAuthenticated, userName, navigate]);

  const handleLogin = async () => {
    await login();
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      updateUserName(name);
      navigate("/"); // Redirect to the Welcome Card
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Recycle Reward Login</h1>
      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login with Internet Identity
        </button>
      ) : (
        <div>
          {/* Show the name input only if the userName is not set */}
          {!userName && (
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  width: "300px",
                }}
              />
              <button
                onClick={handleNameSubmit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Submit Name
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
