import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft"; //create new NFTActorClass to call the nft.mo
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import List "mo:base/List";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Text "mo:base/Text";
import Int "mo:base/Int";

actor Recycle{

    private type Listing = {
        itemOwner: Principal;
        itemPrice: Nat;
    };

    // New type for tracking user data
    private type UserData = {
        name: Text;
        totalRecycled: Nat;
        nftsEarned: Nat;
        ftsEarned: Nat;
        var transactions: [Transaction];
    };

    // New type for transactions
    private type Transaction = {
        transactionType: Text;
        timestamp: Int;
        details: Text;
    };

    // Define a new type for recycling submissions
    private type RecyclingSubmission = {
        materialType: Text;
        quantity: Nat;
        receiptNo: Text;
        location: Text;
        additionalInfo: Text;
        timestamp: Int;
    };

    // Define a leaderboard entry type without mutable fields
    private type LeaderboardEntry = {
        name: Text;
        totalRecycled: Nat;
        nftsEarned: Nat;
        ftsEarned: Nat;
    };

    // Define the TimeOfNFT type
    type TimeOfNFT = {
        nftPrincipal: Text;
        timestamp: Int;  // Timestamp in seconds (Unix timestamp)
    };

    // Define Transaction type for FTs
    type FtsTransaction = {
        id: Text; // Ft ID
        name: Text; // Ft Name
        timestamp: Int; // Transaction timestamp
    };

    //One of the NFTs Hash Map
    var mapOfNFTS = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    // the owner list of NFTS
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    //ermm marketplace listing for price 
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);
    // Map to store user data
    var mapOfUsers = HashMap.HashMap<Principal, UserData>(1, Principal.equal, Principal.hash);
    // HashMap to store TimeOfNFT mapping (NFT Principal -> TimeOfNFT)
    var mapOfNFTtime: HashMap.HashMap<Principal, TimeOfNFT> = HashMap.HashMap<Principal, TimeOfNFT>(1, Principal.equal, Principal.hash);
   


    public query func getUserData(principal: Text) : async {
        totalRecycled: Nat;
        nftsEarned: Nat;
        ftsEarned: Nat;
        } {
        let user = mapOfUsers.get(Principal.fromText(principal));
        switch (user) {
            case (?userData) {
            return {
                totalRecycled = userData.totalRecycled;
                nftsEarned = userData.nftsEarned;
                ftsEarned = userData.ftsEarned;
            };
        };
        case null {
            return {
                totalRecycled = 0;
                nftsEarned = 0;
                ftsEarned = 0;
            };
        };
    };
};


  // Function to log a recycling submission
    public shared(msg) func submitRecycling(
        materialType: Text,
        quantity: Nat,
        receiptNo: Text,
        location: Text,
        additionalInfo: Text
    ) : async () {
        let userData = switch (mapOfUsers.get(msg.caller)) {
            case null {
                {
                    name = "Unknown User";
                    totalRecycled = 0;
                    nftsEarned = 0;
                    ftsEarned = 0;
                    var transactions = [];
                } : UserData
            };
            case (?result) result;
        };

        // Create a new record with updated totalRecycled
        let updatedUserData : UserData = {
            name = userData.name;
            totalRecycled = userData.totalRecycled + quantity;
            nftsEarned = userData.nftsEarned;
            ftsEarned = userData.ftsEarned;
            var transactions = userData.transactions;
        };

        // Create a new transaction for recycling
        let newTransaction = {
            transactionType = "Recycling Submission";
            timestamp = Time.now();
            details = "Recycled " # Nat.toText(quantity) # " kg of " # materialType # ".";
        };

        // Log the transaction
        updatedUserData.transactions := Array.append(updatedUserData.transactions, [newTransaction]);
        Debug.print(debug_show(newTransaction));  // Log the transaction to ensure it's being created

        // Save updated user data
        mapOfUsers.put(msg.caller, updatedUserData);
        Debug.print(debug_show(mapOfUsers.get(msg.caller))); // Log the updated user data
    };

   // Fetch leaderboard data
    // public query func getLeaderboardData() : async [LeaderboardEntry] {
    //     let allUsers = Iter.toArray(mapOfUsers.vals());
    //     let leaderboardEntries = Array.map(allUsers, func(userData : UserData) : LeaderboardEntry {
    //         {
    //             name = userData.name;
    //             totalRecycled = userData.totalRecycled;
    //             nftsEarned = userData.nftsEarned;
    //             ftsEarned = userData.ftsEarned;
    //         }
    //     });
    
    //     return Array.sort(leaderboardEntries, func (a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order { 
    //         if (a.totalRecycled > b.totalRecycled) { #greater }
    //         else if (a.totalRecycled < b.totalRecycled) { #less }
    //         else { #equal }
    //     });
    // };

public query func getLeaderboardData() : async [LeaderboardEntry] {
    let allUsers = Iter.toArray(mapOfUsers.vals());
    let leaderboardEntries = Array.map(allUsers, func(userData : UserData) : LeaderboardEntry {
        let entry = {
            name = userData.name;
            totalRecycled = userData.totalRecycled;
            nftsEarned = userData.nftsEarned;
            ftsEarned = userData.ftsEarned;
        };
        // Log the entry to the console
        Debug.print(debug_show(entry));
        entry
    });

    let sortedEntries = Array.sort(leaderboardEntries, func (a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order { 
        if (a.totalRecycled > b.totalRecycled) { 
            Debug.print(debug_show(#greater));
            #greater 
        }
        else if (a.totalRecycled < b.totalRecycled) { 
            Debug.print(debug_show(#less));
            #less 
        }
        else { 
            Debug.print(debug_show(#equal));
            #equal 
        }
    });

    // Log the final sorted list
    Debug.print(debug_show(sortedEntries));
    return sortedEntries;
};

// Fetch transactions for a user
public query func getTransactionsByPrincipal(user: Principal) : async [Transaction] {
    switch (mapOfUsers.get(user)) {
        case null return [];
        case (?data) return data.transactions;
    };
};

public shared(msg) func getCurrentTransaction() : async [Transaction] {
    switch (mapOfUsers.get(msg.caller)) {
        case null return [];
        case (?data) return data.transactions;
    };
};



    // Function to update user data
    // public shared(msg) func updateUserProfile(name: Text) : async () {
    //     let userData : UserData = {
    //         name = name;
    //         totalRecycled = 0;
    //         nftsEarned = 0;
    //         ftsEarned = 0;
    //         var transactions = [];
    //     };
    //     mapOfUsers.put(msg.caller, userData);
    // };

    public shared(msg) func updateUserProfile(name: Text) : async () {
    // Fetch current user data if it exists
    let userData : UserData = switch (mapOfUsers.get(msg.caller)) {
        case null {
            // If no existing data, create a new profile with default values
            {
                name = name;
                totalRecycled = 0;
                nftsEarned = 0;
                ftsEarned = 0;
                var transactions = [];
            }
        };
        case (?existingData) {
            // If existing data found, retain the current values for totalRecycled, nftsEarned, ftsEarned, and transactions
            {
                name = name;
                totalRecycled = existingData.totalRecycled;
                nftsEarned = existingData.nftsEarned;
                ftsEarned = existingData.ftsEarned;
                var transactions = existingData.transactions;
            }
        };
    };

    // Save the updated user data with the new name but retained other values
    mapOfUsers.put(msg.caller, userData);
};


    // Function to log transaction
    public shared(msg) func logTransaction(transactionType: Text, details: Text) : async () {
        var userData : UserData = switch (mapOfUsers.get(msg.caller)) {
            case null return;
            case (?result) result;
        };

        let newTransaction : Transaction = {
            transactionType = transactionType;
            timestamp = Time.now();
            details = details;
        };

        userData.transactions := Array.append(userData.transactions, [newTransaction]);
        mapOfUsers.put(msg.caller, userData);
    };

    //store the minted nfts (main backend)

    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal{
        let owner : Principal = msg.caller;

        //add cycles for livedata
        Debug.print(debug_show(Cycles.balance()));
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        Debug.print(debug_show(Cycles.balance()));
        
        let newNTFPrincipal = await newNFT.getCanisterId();

        let currentTimestamp = Time.now();
        Debug.print("Minting Timestamp (nanoseconds): " # debug_show(currentTimestamp));
        Debug.print("Minting Timestamp (readable): " # debug_show(Int.toText(currentTimestamp)));


        mapOfNFTS.put(newNTFPrincipal, newNFT);

        // Added this thing new here
        mapOfNFTtime.put(newNTFPrincipal, { nftPrincipal = Principal.toText(newNTFPrincipal); timestamp = Time.now() });
        addToOwnershipMap(owner, newNTFPrincipal);

        return newNTFPrincipal;

    };

    // Function to get the timestamp of a specific NFT
    public query func getNFTTimestamp(nftPrincipal: Principal) : async ?TimeOfNFT {
        switch (mapOfNFTtime.get(nftPrincipal)) {
            case (?timeOfNFT) return ?timeOfNFT;
            case null return null;
        };
    };

    public func addToOwnershipMap(owner: Principal, nftId: Principal) {

    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
        case null List.nil<Principal>();  // Initialize a new list if none exists
        case (?result) result;
    };

    // Add the new NFT to the user's list
    ownedNFTs := List.push(nftId, ownedNFTs);

    // Update the ownership map
    mapOfOwners.put(owner, ownedNFTs);

    Debug.print("After update: Owner = " # debug_show(owner) # ", NFTs = " # debug_show(List.toArray(ownedNFTs)));
    };


    public query func getOwnedNFTs(user: Principal) : async [Principal] {
        var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };
        Debug.print("User NFTs: " # debug_show(userNFTs));
        return List.toArray(userNFTs);

    };


    public shared(msg) func listItem(id: Principal, price: Nat) : async Text{
        var item : NFTActorClass.NFT = switch (mapOfNFTS.get(id)){
            case null return "NFT does not exist.";
            case (?result) result;
        };

        let owner = await item.getOwner();
        if (Principal.equal(owner, msg.caller)){
            let newListing : Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            //TODO:  can add timestamp, historical prices, loyalty price
            mapOfListings.put(id, newListing);
            return "Success";
        }else{
            return "You don't own the NFT"
        }
    };

    //Green marketplace listing
    public query func getListedNFTs() : async [Principal] {
        //keys return Iter (a motoko data type that return all the keys of the hashmap)
        let ids =  Iter.toArray(mapOfListings.keys()); //can turn keys to array using Iter
        return ids;
    };

    public query func getRecycleCanisterID(): async Principal {
        return Principal.fromActor(Recycle);
    };

    public query func isListed(id: Principal) : async Bool {
        if(mapOfListings.get(id) == null){
            return false;
        }else{
            return true;
        }
    };
    

    public query func getOriginalOwner(id: Principal) : async Principal{
        var listing : Listing = switch(mapOfListings.get(id)){
            case null return Principal.fromText("");
            case (?result) result;
        };
        return listing.itemOwner;
    };

    public query func getListedNFTPrice(id: Principal) : async Nat {
        var listing : Listing = switch(mapOfListings.get(id)){
            case null return 0;
            case (?result) result;
        };

        return listing.itemPrice;
    };

    var ftTransact: [FtsTransaction] = [];
    public shared(msg) func recordTransaction(transaction: FtsTransaction): async () {
    let newTransaction = {
        id = transaction.id;
        name = transaction.name;
        timestamp = Time.now(); // Record the current timestamp
    };

    ftTransact := Array.append(ftTransact, [newTransaction]);
    Debug.print("Transaction recorded: " # debug_show(newTransaction));
    };

    // Fetch all recorded FT transactions
    public shared query func getFTTransactions(): async [FtsTransaction] {
        return ftTransact;
    };

    // Function to fetch the length of FT transactions
    public shared query func getFTTransactionCount(): async Nat {
        return Array.size(ftTransact);
    };

};
