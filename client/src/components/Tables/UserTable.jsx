import React from 'react'
import BaseTable from './BaseTable'

const UserTable = ({users,onSave, onCreate, onDelete}) => {
    const columns=[
        {key:'id', label:'ID'},
        { key: "imageUri", label: "Фото", editable: true },
        { key: "name", label: "Ім'я", editable: true },
        { key: "login", label: "Логін", editable: true },
        { key: "email", label: "Email", editable: true },
        { key: "role", label: "Роль", editable: true, type:"select", options:["USER","EDITOR","ADMIN"] }
    ];

    return <BaseTable columns={columns} data={users} onSave={onSave} onCreate={onCreate} onDelete={onDelete} tableType="users"/>;
};
 
export default UserTable;