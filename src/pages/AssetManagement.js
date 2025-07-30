import { useEffect, useMemo, useState } from "react";
import {
  createAsset,
  createAssetStatus,
  createAssetType,
  deleteAsset,
  getAssetListData,
  updateAsset,
  updateAssetStatus,
  updateAssetType,
} from "../api/assetService";
import { ListTable } from "../components/BasicComponents";
import "../styles/MyStyles.scss";
import SkeletonLoader from "./SkeletonLoader";

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetStatuses, setAssetStatuses] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [reloadData, setReloadData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState([]);

  const getUpdatedList = (list, data, action) => {
    const { id } = data;
    const existingItem = list.find((item) => item.id === id);

    switch (action) {
      case "delete":
        return list.filter((item) => item.id !== id);

      case "edit":
        if (!existingItem) return list;
        return list.map((item) =>
          item.id === id ? { ...item, ...data } : item
        );

      case "create":
        return [...list, data];

      default:
        console.warn(`Unknown action type: ${action}`);
        return list;
    }
  };

  const saveAsset = async ({ data, action }) => {
    setSaving(true);
    let updatedList = getUpdatedList(assets, data, action);

    try {
      switch (action) {
        case "delete":
          await deleteAsset(data.id);
          break;
        case "create":
          await createAsset(data).then(function (response){
            updatedList = getUpdatedList(assets, response.data, action)
          });
          break;
        default:
          await updateAsset(data);
      }
    } finally {
      setSaving(false);
    }

    setAssets(updatedList);
  };

  const saveType = async ({ data, action }) => {
    setSaving(true);

    try {
      switch (action) {
        case "create":
          await createAssetType(data);
          break;
        default:
          await updateAssetType(data);
      }
    } finally {
      setSaving(false);
    }
    handleReload();
  };

  const saveStatus = async ({ data, action }) => {
    setSaving(true);
    try {
      switch (action) {
        case "create":
          await createAssetStatus(data);
          break;
        default:
          await updateAssetStatus(data);
      }
    } finally {
      setSaving(false);
    }
    handleReload();
  };

  // I don't love the ListTable recursion with the options but it works and I wanted to make the ListTable re-usable. Had to add useMemo to make this method work.
  const assetColumns = useMemo(
    () => ({
      code: {
        header: "Code",
        type: "string",
        required: true,
        unique: true,
      },
      description: {
        header: "Description",
        type: "string",
        required: false,
        unique: false,
      },
      type: {
        header: "Asset Type",
        type: "object",
        required: true,
        unique: false,
        options: assetTypes ?? [],
        displayKey: "name",
        onSave: saveType,
        canDelete: false,
        optionsColumns: {
          name: {
            header: "Name",
            type: "string",
            unique: true,
            required: true,
          },
          description: {
            header: "Description",
            type: "string",
            unique: false,
            required: false,
          },
        },
      },
      status: {
        header: "Asset Status",
        type: "object",
        required: true,
        unique: false,
        options: assetStatuses ?? [],
        displayKey: "name",
        onSave: saveStatus,
        canDelete: false,
        optionsColumns: {
          name: {
            header: "Name",
            type: "string",
            unique: false,
            required: false,
          },
          code: {
            header: "Code",
            type: "string",
            unique: true,
            required: true,
          },
          description: {
            header: "Description",
            type: "string",
            unique: false,
            required: false,
          },
        },
      },
    }),
    [assetTypes, assetStatuses]
  );

  const fetchAssets = async () => {
    try {
      const response = await getAssetListData();
      setAssets(response.data.assets);
      setAssetTypes(response.data.assetTypes);
      setAssetStatuses(response.data.assetStatuses);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to fetch assets.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [reloadData]);

  const handleReload = () => {
    setPageLoading(true);
    setReloadData((prev) => !prev);
  };

  return (
    <>
      {pageLoading && <SkeletonLoader />}
      <div style={{ display: "inline-block" }}></div>
      <div
        style={{
          float: "right",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {saving ? (
          <>
            <span className="spinner" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <span style={{ color: "#1976d2" }}>✔</span>
            <span>Saved!</span>
          </>
        )}
      </div>
      <ListTable
        data={assets}
        columns={assetColumns}
        saveData={saveAsset}
        title={"Asset Management"}
        objectName={"Asset"}
        canDelete={true}
      />
      {error}
    </>
  );
};

export default AssetManagement;
