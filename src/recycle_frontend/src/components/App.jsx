import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";


function App() {

  // const NFTID = "br5f7-7uaaa-aaaaa-qaaca-cai";

 

  return (
    <div className="App">
      <Header />
      
      {/* <Item id={NFTID}/> */}
      <Footer />
    </div>
  );
}

export default App;
