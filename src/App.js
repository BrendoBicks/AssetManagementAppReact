import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { getAssets } from "./api/assetService";
import Navbar from "./components/NavBar";
import AssetManagement from "./pages/AssetManagement";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/asset-management" element={<AssetManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
