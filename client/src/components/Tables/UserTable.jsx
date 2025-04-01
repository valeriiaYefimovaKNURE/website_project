import React from 'react'
import BaseTable from './BaseTable'

const UserTable = ({users,onSave}) => {
    const columns=[
        {key:'id', label:'ID'},
        { key: "imageUri", label: "Фото", editable: true },
        { key: "name", label: "Ім'я", editable: true },
        { key: "login", label: "Логін", editable: true },
        { key: "email", label: "Email", editable: true },
        { key: "birthday", label: "Дата народження", editable: true },
        { key: "gender", label: "Стать", editable: true, type:"select", options:["female","male","nebinary"] },
        { key: "role", label: "Роль", editable: true, type:"select", options:["USER","EDITOR","ADMIN"] },
        { key: "password", label: "Пароль", editable: true },
        { key: "viper", label: "Viper", editable: true },
        { key: "hasAgreedToTerms", label: "Terms", editable: true },
    ];


    return <BaseTable columns={columns} data={users} onSave={onSave}/>;
};
 
export default UserTable;