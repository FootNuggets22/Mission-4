import React from "react";
import Tina from "./components/Tina";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
function App() {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Tina />
      </div>
      <Footer />
    </>
  );
}
export default App;
