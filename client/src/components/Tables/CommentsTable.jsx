import React from 'react'
import BaseTable from './BaseTable'

const CommentsTable = ({comments,onSave, onCreate}) => {
    const columns=[
        { key: "news_id", label: "Допис" },
        { key: "id", label: "ID коментаря" },
        { key: "user_uid", label: "ID власника" },
        { key: "user_login", label: "Автор коментаря"},
        { key: "date", label: "Дата коментаря" },
        { key: "text", label: "Текст коментаря" },
        { key:"hasReport",label:"Наявність скарг"},
        { key: "reason", label: "Причина", editable: true, type:"select", options:["Спам, флуд", "Реклама, шахрайство", "Загрози та насильство","Неприйнятний контент","Поширення дезінформації","Дискримінація","Порушення конфіденційності","Образи, приниження, булінг"]},
        { key: "status", label: "Статус", editable: true, type:"select", options:["pending", "resolved", "warning"] },
        { key: "time", label: "Дата скарги" }
    ]

    return <BaseTable columns={columns} data={comments} onSave={onSave} onCreate={onCreate} tableType="comments"/>;
};
 
export default CommentsTable;