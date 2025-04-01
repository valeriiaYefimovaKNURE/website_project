import React from 'react'
import BaseTable from './BaseTable'

const NewsTable = ({news,onSave}) => {
    const columns=[
        { key: "id", label: "ID" },
        { key: "imageUri", label: "Фото", editable: true },
        { key: "title", label: "Назва", editable: true },
        { key: "subtitle", label: "Опис", editable: true },
        { key: "creatorName", label: "Автор", editable:true },
        { key: "date", label: "Дата" },
        { key: "isActual", label: "Актуальне", editable:true },
        { key: "likes", label: "Лайки", editable:true },
        { key: "link", label: "Посилання", editable:true },
        { key: "theme", label: "Тема", editable:true, type:"select", options:["Спорт","Соціальне","Історія","Активізм","Освіта","Новини","ЛГБТКІА","Психологія"] },
    ];


    return <BaseTable columns={columns} data={news} onSave={onSave}/>;
};
 
export default NewsTable;