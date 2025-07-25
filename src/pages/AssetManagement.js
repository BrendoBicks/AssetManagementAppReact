import { useEffect, useState } from "react";
import { getAssets } from "../api/assetService";
import "../styles/MyStyles.scss";
import SkeletonLoader from "./SkeletonLoader";

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState([]);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to fetch assets.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <>
      <h2>Asset Management!</h2>

      {pageLoading && <SkeletonLoader />}

      {assets.map((asset) => (
        <div key={asset.id}>{asset.code}</div>
      ))}
      {error}
    </>
  );
};

export default AssetManagement;
