import React from 'react'
import "../../styles/Buttons.css"; 

const ArrayButtons = ({itemArray, selectedItem, onItemSelect, defaultItemText=''}) => {
  const items=[defaultItemText,...itemArray];
  return (
    <div>
      {items.map((item, index) => (
        <button 
          key={index.toString()}
          className={item === selectedItem ? 'array-button.selected' : 'array-button'}
          onClick={() => onItemSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default ArrayButtons