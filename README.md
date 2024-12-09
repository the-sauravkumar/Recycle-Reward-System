# Recycle Reward System

This project deploys a backend system, an NFT canister, and a React-based frontend to the Internet Computer blockchain.

---

## Project Overview

- **Backend Canister**: Handles core backend functionalities.
- **NFT Canister**: Manages the creation and ownership of NFTs.
- **Frontend Canister**: React-based user interface served as a static asset canister.

---

## Prerequisites

Before deploying or running the project, ensure you have the following:

- [Node.js](https://nodejs.org/) (for npm commands)
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install) installed and configured
- An Internet Computer identity and cycles wallet for mainnet deployment

---

## Local Deployment Instructions

Follow these steps to deploy and run the project locally:

1. **Start the DFX Replica in the Background**:
   ```bash
   dfx start --background --clean
   ```

2. **Deploy the Canisters Locally**:
   ```bash
   dfx deploy
   ```

3. **Run the Frontend Locally**:
   ```bash
   npm start
   ```

---

## Mainnet Deployment Instructions

To deploy the project to the Internet Computer mainnet:

1. **Build the React Frontend**:
   Generate a production build of your React application:
   ```bash
   npm run build
   ```

2. **Deploy All Canisters to the Mainnet**:
   Deploy the backend, NFT, and frontend canisters:
   ```bash
   dfx deploy --network=ic
   ```

---

## Canister Details

- **Backend Canister**: `recycle_backend`
  - **Language**: Motoko
  - **Path**: `src/recycle_backend/main.mo`

- **NFT Canister**: `nft`
  - **Language**: Motoko
  - **Path**: `src/NFT/nft.mo`

- **Frontend Canister**: `recycle_frontend`
  - **Type**: Assets
  - **Path**: `src/recycle_frontend/dist`

---

## NFT Canister Parameters

The NFT canister supports the following parameters:
- **`name`**: (Type: `Text`) Name of the NFT.
- **`owner`**: (Type: `Principal`) Owner's principal ID.
- **`content`**: (Type: `[Nat8]`) Binary content of the NFT.

---

## Notes and Tips

- Ensure your `dfx.json` is correctly configured for both local and mainnet deployments.
- If using Webpack, set `DFX_NETWORK` to `ic` when deploying to the Internet Computer.
- Make sure you have sufficient cycles in your wallet to cover the cost of deploying canisters to the mainnet.
- For detailed guidance, visit the [Internet Computer Developer Documentation](https://internetcomputer.org/docs/current/developer-docs/).

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```  
