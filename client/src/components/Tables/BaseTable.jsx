import { useState } from 'react';
import Select from "react-select";
import images from '../../constants/images';
import { formatToDisplay, formatToInput } from '../../utils/dataUtils';


const BaseTable = ({ columns, data, onSave, onCreate, onDelete, tableType }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newRowData,setNewRowData]=useState(
    Object.fromEntries(columns.map(col=>[
      col.key,
      col.label === "Дата" ? formatToInput(new Date().toISOString().slice(0, 10)) : ""
    ]))
  );

  const narrowColumns = ["Terms", "Роль", "Стать", "Лайки", "Актуальне", "ID", "Дата", "Посилання", "Статус", "Дата коментаря"];
  const breakFields = ["ID", "Посилання", "Email", "Логін", "Пароль", "Viper", "ID власника", "ID новини", "Автор коментаря","Допис","ID коментаря"];

  const handleDoubleClick = (row) => {
    setSelectedRow(row.id);
    setEditedData({...row});
  };

  const handleNewRowChange=(e,field)=>{
    setNewRowData(prev=>({
      ...prev,
      [field]:e.target?e.target.value:e //select
    }))
  }
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

  const handleCreate=()=>{
    if(!onCreate) return;

    // Видаляємо тільки справді порожні поля (пусті рядки, null, undefined)
    const cleanedData=Object.fromEntries(
      Object.entries(newRowData).filter(([_,v])=> v !== "" && v !== null && v !== undefined)
    );
  
    if (Object.keys(cleanedData).length === 0) {
      alert("Неможливо створити запис: немає даних");
      return;
    }

    if (cleanedData.date) {
      cleanedData.date = formatToDisplay(cleanedData.date); // yyyy-mm-dd → dd.mm.yyyy
    }

    onCreate(cleanedData)

    // При скиданні форми, для boolean полів встановлюємо null замість ""
    setNewRowData(Object.fromEntries(
      columns.map(col => [
        col.key, 
        col.label === "Дата" ? formatToInput(new Date().toISOString().slice(0, 10)) : ""
      ])
    ));
  }
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

    onSave(editedData,updatedFields);
    setSelectedRow(null);
  };

  const handleDelete =()=>{
     if (!editedData.id) {
      alert("Немає ID!");
      return;
    }
    if (window.confirm("Ви впевнені, що хочете видалити цей запис?")) {
      onDelete(editedData.id);
      setSelectedRow(null);
    }
  }
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
        <CreateRow
          columns={columns}
          newRowData={newRowData}
          handleNewRowChange={handleNewRowChange}
          handleCreate={handleCreate}
        />
        {data.map((row, index) => (
          <tr key={row.id} className="hover:bg-gray-100" onDoubleClick={() => handleDoubleClick(row)}>
            
            <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
            {columns.map((col) => (
              <td
                key={col.key}
                className={`border border-gray-400 p-2 text-center w-auto whitespace-normal ${breakFields.includes(col.label) ? 'break-all' : 'break-word'}`}
              >
                <TableCell 
                  col={col} 
                  row={row} 
                  selectedRow={selectedRow}
                  editedData={editedData}
                  handleSelectChange={handleSelectChange}
                  handleChange={handleChange}
                  tableType={tableType}
                />
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
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
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

const TableCell = ({ col, row, selectedRow, editedData, handleSelectChange, handleChange, tableType }) => {
    const isEditing = selectedRow === row.id && col.editable;
    const currentValue = col.options && isEditing
    ? col.options.find(option => option.value === (editedData[col.key] ?? row[col.key]))
    : null;

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
          options={col.options}
          value={currentValue || null}
          onChange={(selected) => handleSelectChange(selected, col.key)}
          styles={{
            option: (base) => ({
              ...base,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }),
          }}
        />
      ) : col.label.includes("Дата")?(
        <input
          type="date"
          className="border w-full"
          value={formatToInput(editedData[col.key] || row[col.key])}
          onChange={(e) =>
            handleChange({ target: { value: formatToDisplay(e.target.value) } }, col.key)
          }
        />
      ):(
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

  const CreateRow=({columns, newRowData, handleNewRowChange, handleCreate})=>(
    <tr className="">
      <td className="border border-gray-400 p-2 text-center">+</td>

      {columns.map((col) => (
        <td key={col.key} className="border border-gray-400 p-2 text-center">
          {col.key==="id" ? (
            <div className="text-gray-500 italic text-sm">Автоматичне</div>
          ):col.label.includes("Дата") ? (
            <input
              type="date"
              className="border w-full"
              value={newRowData[col.key]}
              onChange={(e) => handleNewRowChange(e, col.key)}
            />
          ):col.type === "select" ? (
            <Select
              options={
                // Перевіряємо, чи options вже у форматі {value, label}
                Array.isArray(col.options) && col.options[0]?.value !== undefined
                  ? col.options
                  : col.options.map(o => ({ value: o, label: o }))
              }
              value={
                newRowData[col.key] !== "" && newRowData[col.key] !== undefined && newRowData[col.key] !== null
                  ? Array.isArray(col.options) && col.options[0]?.value !== undefined
                    ? col.options.find(o => o.value === newRowData[col.key])
                    : { value: newRowData[col.key], label: newRowData[col.key] }
                  : null
              }             
              onChange={(selected) => handleNewRowChange(selected.value, col.key)}
            />
          ) : (
            <textarea
              className="border w-full min-h-[50px] resize-y"
              value={newRowData[col.key] || ""}
              onChange={(e) => handleNewRowChange(e, col.key)}
            />
          )}
        </td>
      ))}

      <td className="border border-gray-400 p-2 text-center">
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
        >
          ➕
        </button>
      </td>
    </tr>
  )