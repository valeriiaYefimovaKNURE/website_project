import React from 'react'
import BaseTable from './BaseTable'

const CommentsTable = ({comments,onSave}) => {
    const columns=[
        { key: "id", label: "ID" },
        { key: "text", label: "Текст коментаря" },
        { key: "reason", label: "Причина", editable: true, type:"select", options:["Спам, флуд", "Реклама, шахрайство", "Загрози та насильство","Неприйнятний контент","Поширення дезінформації","Дискримінація","Порушення конфіденційності","Образи, приниження, булінг"]},
        { key: "status", label: "Статус", editable: true, type:"select", options:["pending", "resolved", "warning"] },
        { key: "time", label: "Дата скарги" },
        { key: "date", label: "Дата коментаря" },
        { key: "user_uid", label: "ID власника" },
        { key: "user_login", label: "Автор коментаря"},
        { key: "news_id", label: "ID новини" },
    ]

    return <BaseTable columns={columns} data={comments} onSave={onSave} tableType="comments"/>;
};
 
export default CommentsTable;