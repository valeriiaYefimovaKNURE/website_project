import React from 'react'
import BaseTable from './BaseTable'

const NewsTable = ({news,onSave, onCreate}) => {
    const columns=[
        { key: "id", label: "ID" },
        { key: "imageUri", label: "Фото", editable: true },
        { key: "title", label: "Назва", editable: true },
        { key: "subtitle", label: "Опис", editable: true },
        { key: "creatorName", label: "Автор", editable:true },
        { key: "date", label: "Дата" },
        { key: "isActual", label: "Актуальне", editable:true, type:"select", options:["True","False"] },
        { key: "likes", label: "Лайки", editable:true },
        { key: "link", label: "Посилання", editable:true },
        { key: "theme", label: "Тема", editable:true, type:"select", options:["Спорт","Соціальне","Історія","Активізм","Освіта","Новини","ЛГБТКІА","Психологія"] },
    ];
    console.log("news:", news);

    return <BaseTable columns={columns} data={news} onSave={onSave} onCreate={onCreate} tableType="news"/>;
};
 
export default NewsTable;