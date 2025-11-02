import { useState } from 'react';
import Select from "react-select";
import images from '../../constants/images';

const BaseTable = ({ columns, data, onSave, onDelete, tableType }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const narrowColumns = ["Terms", "Роль", "Стать", "Лайки", "Актуальне", "ID", "Дата", "Посилання", "Статус", "Дата коментаря"];
  const breakFields = ["ID", "Посилання", "Email", "Логін", "Пароль", "Viper", "ID власника", "ID новини", "Автор коментаря"];

  const handleDoubleClick = (row) => {
    setSelectedRow(row.id);
    setEditedData({...row});
  };

  const handleChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (selected, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: selected.value,
    }));
  };

  const handleSave = () => {
    if (!editedData.id) {
      alert("Немає ID користувача(-ки)!");
      return;
    }
  
    const originalRow=data.find((item)=>item.id===editedData.id);
    const updatedFields={};

    for(const key in editedData){
      if(editedData[key]!==originalRow[key]){
        updatedFields[key]=editedData[key];
      }
    }

    //console.log("Отправляемые данные:", editedData);

    onSave(editedData.id,updatedFields);
    setSelectedRow(null);
  };

  const handleDelete =()=>{
     if (!editedData.id) {
      alert("Немає ID користувача(-ки)!");
      return;
    }
    if (window.confirm("Ви впевнені, що хочете видалити цей запис?")) {
      onDelete(editedData.id);
      setSelectedRow(null);
    }
  }
    

  const TableCell = ({ col, row }) => {
    const isEditing = selectedRow === row.id && col.editable;

    if (col.key === "imageUri") {
      return (
        <ImageCell src={row[col.key]} tableType={tableType} name={row.name} />
      );
    }

    if (typeof row[col.key] === "boolean" || row[col.key] == null) {
      return row[col.key] ? "✅" : "❌";
    }

    if (isEditing) {
      return col.type === "select" ? (
        <Select
          options={col.options.map(opt => ({ value: opt, label: opt }))}
          value={{
            value: editedData[col.key] !== undefined ? editedData[col.key] : row[col.key],
            label: editedData[col.key] !== undefined ? editedData[col.key] : row[col.key],
          }}
          onChange={(selected) => handleSelectChange(selected, col.key)}
          styles={{
            option: (base) => ({
              ...base,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }),
          }}
        />
      ) : (
        <textarea
          className="border w-full min-h-[100px] resize-y"
          value={editedData[col.key] !== undefined ? editedData[col.key] : row[col.key]}
          onChange={(e) => handleChange(e, col.key)}
        />
      );
    }

    if (tableType === "news" && col.key === "creatorName") {
      return <AuthorCell name={row[col.key]} login={row.creatorLogin} />;
    }

    return row[col.key];
  };

  const ImageCell = ({ src, tableType, name }) => (
    <img
      src={src || images.avatar}
      alt={name || "Фото"}
      className={`mx-auto ${tableType === "news" ? "rounded w-32 h-20" : "rounded-full w-15 h-15"}`}
    />
  );

  const AuthorCell = ({ name, login }) => (
    <>
      <div>{name}</div>
      <div className="font-bold">{login || "-"}</div>
    </>
  );

  return (
    <table className="border-collapse border border-gray-400 w-full mt-5 table-fixed">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-400 p-2 w-5">#</th>
          {columns.map((col) => (
            <th key={col.key} className={`border border-gray-400 p-2 ${narrowColumns.includes(col.label) ? 'w-10' : 'w-16'}`}>
              {col.label}
            </th>
          ))}
          <th className="border border-gray-400 p-2 w-10">Дія</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id} className="hover:bg-gray-100" onDoubleClick={() => handleDoubleClick(row)}>
            <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
            {columns.map((col) => (
              <td
                key={col.key}
                className={`border border-gray-400 p-2 text-center w-auto whitespace-normal ${breakFields.includes(col.label) ? 'break-all' : 'break-word'}`}
              >
                <TableCell col={col} row={row} />
              </td>
            ))}
            <td className="border border-gray-400 p-2 text-center">
              {selectedRow === row.id && (
                <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  💾
                </button>
               <button
                  onClick={handleDelete}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  🗑️
                </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BaseTable;