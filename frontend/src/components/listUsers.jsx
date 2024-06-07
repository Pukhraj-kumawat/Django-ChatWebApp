import React, { useEffect, useState } from 'react';
import { GET_ALL_USERS } from '../graphQL/queries';
import { useQuery } from '@apollo/client';
import ChatMessages from './chatMessages';


const ListUsers = (props) => {
  const {userId} = props.data;
  const [chatUserId,setChatUserId] = useState(undefined);
  const [chatUserFullName,setChatUserFullName] = useState(undefined)
  const [chatUsername,setChatUsername] = useState(undefined);
  const [selectedDivId, setSelectedDivId] = useState(null);


  const clickUser = (event,chatUserId)=>{   
    setChatUserFullName(event.currentTarget.querySelector('.chat-user-name').textContent);
    setChatUsername(event.currentTarget.querySelector('.chat-username').textContent);
    setChatUserId(chatUserId);    
    setSelectedDivId(chatUserId)

  }



  const {loading:loadingAllUsers,error:errorAllUsers,data:dataAllUsers} = useQuery(GET_ALL_USERS,{
    variables:{
      yourUserId:Number(userId)
    }
  })



  if (loadingAllUsers) return <div>Loading all users ...</div>;
  if (errorAllUsers) return <div>Error in loading all users</div>;    


  if(dataAllUsers){
  return (
    <>    
    <div className='flex space-x-4 fixed top-4 left-4'>            
      <div className="flex flex-col space-y-2 w-[300px] cursor-pointer select-none ">
        {dataAllUsers.allUsers.map(user => (

          <div key={user.id} className={`p-2 rounded-lg shadow-md flex items-center cursor-pointer hover:bg-blue-50 active:scale-95 transition transform duration-75 ${selectedDivId === user.id ? 'bg-green-200' : 'bg-gray-100'} `} id={`${user.id}`} onClick={(event)=>{clickUser(event,user.id)}}>
            {/* <img
              src={`https://source.unsplash.com/50x50/?person&${user.id}`}
              alt={user.firstName}
              className="w-10 h-10 rounded-full mr-4"
            /> */}
            <div>
              <p className="font-semibold chat-user-name">{user.firstName} {user.lastName}</p>
              <small className="text-gray-600 chat-username">@{user.username}</small>
            </div>
          </div>
        ))}
      </div>
      
      {chatUserId &&(
        <div className='border border-black-500 w-[600px] rounded-lg'>
          <ChatMessages data={{userId:userId,chatUserId:chatUserId,chatUserFullName:chatUserFullName,chatUsername:chatUsername}} />
        </div>
      )}    
      

    </div>
    </>
  )
}

  
}

export default ListUsers