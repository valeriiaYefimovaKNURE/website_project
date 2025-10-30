import React from 'react'
import BaseTable from './BaseTable'

const ReportsTable = ({reports,onSave, onCreate}) => {
    const columns=[
        { key: "id", label: "ID" },
        { key: "text", label: "Текст коментаря", editable: true },
        { key: "status", label: "Статус", editable: true },
        { key: "user_login", label: "Автор коментаря" },
        { key: "date", label: "Дата коментаря" },
    ]

    return <BaseTable columns={columns} data={reports} onSave={onSave} onCreate={onCreate} tableType="reports"/>;
};
 
export default ReportsTable;