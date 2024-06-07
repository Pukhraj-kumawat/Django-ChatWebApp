import React from 'react'
  
  const TextInput = (props) => {    

    const {inputId,inputName,inputPlaceholder,inputType,value,setState} = props

    const handleChange =  (e) =>{
        setState(e.target.value)
    }
    return (
    <div>
      <input id={inputId} name={inputName} type={inputType} autoComplete="" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={inputPlaceholder} value={value}         onChange={handleChange} />
    </div>
    )
  }
  
  export default TextInput
