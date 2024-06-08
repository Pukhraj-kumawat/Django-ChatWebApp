import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditableInput = ({ label, type, isEditable, setIsEditable, fieldRef, fieldName,setState,value,placeholder,setIsProfileChange }) => {

    const handleEditClick = () => {
        setIsEditable((prevState) => {
            const newState = { ...prevState, [fieldName]: !prevState[fieldName] };
            if (!prevState[fieldName]) {
                setTimeout(() => {
                    fieldRef.current.focus();
                }, 0);
            }
            return newState;
        });
    };

    const handleFocus = (event) => {
        if (!isEditable[fieldName]) {
            event.target.blur();
        }
    };

    const handleChange = (e)=>{
        setIsProfileChange(true)
        setState(e.target.value)
    }

    return (
        <div className="mb-4 relative">
            <label htmlFor={fieldName} className="block text-gray-700 font-semibold mb-2">{label}</label>
            <div className="flex">
                <input
                    type={type}
                    id={fieldName}
                    name={fieldName}
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly={!isEditable[fieldName]}
                    onFocus={handleFocus}
                    ref={fieldRef}
                    onChange={handleChange}
                    value={value}
                    placeholder={placeholder}

                />
                <button
                    type="button"
                    className="p-2 bg-gray-200 rounded-r-lg text-blue-500 hover:bg-gray-300 focus:outline-none"
                    onClick={handleEditClick}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            </div>
        </div>
    );
};

export default EditableInput