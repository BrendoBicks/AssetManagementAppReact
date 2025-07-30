import { useEffect, useReducer, useRef, useState } from "react";
import { simpleObjectReducer } from "../reducers/simpleObjectReducer";
import "../styles/BasicComponents.scss";

export const BasicButton = ({
  onClick,
  children,
  className = "",
  styles = {},
}) => {
  return (
    <button
      onClick={onClick}
      className={`basic-button ${className}`}
      style={styles}
    >
      {children}
    </button>
  );
};

// Select a single object from a list
export const SingleObjectSelector = ({
  options,
  displayKey,
  idKey,
  selected,
  onSelect,
}) => {
  const selectedValue = selected ? selected[idKey] : "";
  const optionSelected = (value) => {
    const selectedObj = options.find((option) => option[idKey] == value);

    onSelect(selectedObj);
  };

  return (
    <div>
      <select
        className="single-object-selector"
        value={selectedValue}
        onChange={(e) => optionSelected(e.target.value)}
      >
        <option value="" disabled hidden></option>
        {options.map((option) => (
          <option value={option[idKey]}>{option[displayKey]}</option>
        ))}
      </select>
    </div>
  );
};

export const BasicInput = ({ value, onChange }) => {
  return (
    <input
      className="basic-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export const BasicModal = ({ children, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// Shows list of data in an editable table
export const ListTable = ({
  data,
  columns,
  saveData,
  title,
  objectName,
  canDelete,
}) => {
  const [rows, setRows] = useState(data);
  const columnKeys = Object.keys(columns);
  const [addOptionsModalKey, setAddOptionsModalKey] = useState(null);
  const [editData, dispatchEditData] = useReducer(simpleObjectReducer, null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleSaveData = (action) => {
    const isEdit = !!editData?.id;
    action = action ?? (isEdit ? "edit" : "create");

    // Check required fields
    for (const key of Object.keys(columns)) {
      const column = columns[key];
      if (
        column.required &&
        (editData[key] === null || editData[key] === "" || editData[key] === undefined)
      ) {
        setValidationError({
          message: `${column.header} is required.`,
          rowId: editData.id ?? "__new",
        });
        return;
      }
    }

    // Check uniqueness
    for (const key of Object.keys(columns)) {
      const column = columns[key];
      if (column.unique) {
        const newValue = editData[key];

        const isDuplicate = rows.some((row) => {
          if (isEdit && row.id === editData.id) return false;
          return row[key] === newValue;
        });

        if (isDuplicate) {
          setValidationError({
            message: `${column.header} must be unique.`,
            rowId: editData.id ?? "__new",
          });
          return;
        }
      }
    }

    saveData({ data: editData, action });
    dispatchEditData({ type: "reset" });
    setValidationError(null);
  };

  const handleCancelEdit = () => {
    setValidationError(null)
    dispatchEditData({ type: "reset" })
    setRows((prevRows) => prevRows.filter((row) => !row.isNew));
  }

  const handleAddRow = () => {
    const defaultObj = columnKeys.reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});

    defaultObj.isNew = true;

    dispatchEditData({ type: "set", payload: defaultObj });
    setRows([...rows, defaultObj]);
  };

  const formatCell = (row, columns, columnKey) => {
    const column = columns[columnKey];
    if (!editData || editData.id != row.id) {
      let cellValue =
        column.type === "object"
          ? row[columnKey]?.[column.displayKey] ?? ""
          : row[columnKey] ?? "";
      return cellValue;
    }

    switch (column.type) {
      case "object":
        return (
          <SingleObjectSelector
            options={column.options}
            selected={editData[columnKey]}
            displayKey={column.displayKey}
            idKey={column.idKey ?? "id"}
            onSelect={(selectedValue) =>
              dispatchEditData({
                type: "update",
                value: selectedValue,
                key: columnKey,
              })
            }
          />
        );
      case "string":
        return (
          <BasicInput
            value={editData[columnKey]}
            onChange={(newValue) =>
              dispatchEditData({
                type: "update",
                value: newValue,
                key: columnKey,
              })
            }
          />
        );
    }
  };

  const getColumnHeader = (column, key) => {
    let header = column.header;
    let canAddOptions = column.type === "object";
    if (canAddOptions) header = header + " +";

    const onClick = () => {
      if (canAddOptions) setAddOptionsModalKey(key);
    };

    return (
      <div
        className={canAddOptions ? "clickable-header" : ""}
        onClick={onClick}
      >
        {header}
      </div>
    );
  };

  return (
    <div className="list-table-container">
      <div className="list-table-header">
        <h2>{title}</h2>
        {!editData && (
          <BasicButton onClick={handleAddRow}>
            <span>Add {objectName}</span>
          </BasicButton>
        )}
      </div>
      <table className="list-table" >
        <thead>
          <tr>
            {columnKeys.map((key) => (
          <th key={key}>{getColumnHeader(columns[key], key)}</th>
        ))}
        <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id ?? "new"}
              className={
                validationError && (validationError?.rowId === row.id ||
                (!row.id && validationError?.rowId === "__new"))
                  ? "row-error"
                  : ""
              }
              title={
                validationError?.rowId === row.id ||
                (!row.id && validationError?.rowId === "__new")
                  ? validationError?.message
                  : ""
              }
            >
              {columnKeys.map((key) => (
                <td key={key}>{formatCell(row, columns, key)}</td>
              ))}

              <td>
                {editData?.id === row.id ? (
                  <div className="actions-container">
                    <BasicButton onClick={() => handleSaveData()}>
                      Save
                    </BasicButton>
                    <BasicButton
                      className="warning"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </BasicButton>
                  </div>
                ) : (
                  <div className="actions-container">
                    <BasicButton
                      onClick={() =>
                        dispatchEditData({ type: "set", payload: row })
                      }
                    >
                      Edit
                    </BasicButton>
                    {canDelete && (
                      <BasicButton
                        className="danger"
                        onClick={() =>
                          saveData({ data: row, action: "delete" })
                        }
                      >
                        Delete
                      </BasicButton>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addOptionsModalKey && (
        <BasicModal onClose={() => setAddOptionsModalKey(null)}>
          <ListTable
            key={columns[addOptionsModalKey].header}
            data={columns[addOptionsModalKey].options}
            saveData={columns[addOptionsModalKey].onSave}
            columns={columns[addOptionsModalKey].optionsColumns}
            objectName={columns[addOptionsModalKey].header}
            canDelete={columns[addOptionsModalKey].canDelete}
            title={`Edit ${columns[addOptionsModalKey].header}`}
          />
        </BasicModal>
      )}
    </div>
  );
};
