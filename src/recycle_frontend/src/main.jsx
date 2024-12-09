import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/App";
import { AuthProvider } from "./context/AuthContext";
import './index.scss';

const init = async () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  );
};

init();