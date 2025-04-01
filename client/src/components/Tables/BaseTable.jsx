import { useState } from 'react'

const BaseTable =({columns, data, onEdit, onSave})=> {
    const [selectedRow, setSelectedRow]=useState(null);
    const [editedData,setEditedData]=useState({});

    const handleDoubleClick=(row)=>{
        setSelectedRow(row.id);
        setEditedData(row);
    }

    const handleChange=(e,field)=>{
        setEditedData((prev)=>({
            ...prev,
            [field]:e.target.value,
        }));
    }

    const handleSave=()=>{
        onSave(editedData);
        setSelectedRow(null);
    }

    return (
      <table className='border-collapse border border-gray-400 w-full mt-5 table-fixed'>
        <thead>
            <tr className='bg-gray-200'>
                <th className="border border-gray-400 p-2 w-10">#</th>
                {columns.map((col)=>(
                    <th key={col.key} className='border border-gray-400 p-2 w-16'>
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row,index)=>(
                <tr key={row.id} className='hover:bg-gray-100' onDoubleClick={()=>handleDoubleClick(row)}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    {columns.map((col)=>(
                        <td key={col.key} className='border border-gray-400 p-2 text-center w-16 break-all whitespace-normal'>
                            {col.key==="imageUri" ? ( // відображення фото
                                <img
                                    src={row[col.key]}
                                    alt={row.name || "Фото"}
                                    className="w-10 h-10 rounded-full mx-auto"
                                />
                            ): typeof row[col.key]==="boolean"? (
                                row[col.key]?"✅" : "❌"
                            ): selectedRow === row.id && col.editable ?( //Редагування полей
                                col.type==="select" ? (
                                    <select className='border' value={editedData[col.key] || row[col.key]} onChange={(e)=>handleChange(e, col.key)}>
                                        {col.options.map((option)=>(
                                            <option key={option} value={option}> {option} </option>
                                        ))}
                                    </select>
                                ):(
                                    <input className='border' type='text' value={editedData[col.key] || ""} onChange={(e)=>handleChange(e,col.key)}/>
                                )
                            ):(
                                row[col.key]
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
      </table>
    )
}

export default BaseTable