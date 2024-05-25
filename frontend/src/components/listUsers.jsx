import React from 'react'

const ListUsers = ({users,setChatUserId}) => {

    const clickUser = (userId)=>{
        console.log('clicked',userId);
        setChatUserId(userId);        
    }

  return (
    <div className="flex flex-col space-y-2 w-[400px]">
      {users.map(user => (
        <div key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center" onClick={()=>{clickUser(user.id)}}>
          {/* <img
            src={`https://source.unsplash.com/50x50/?person&${user.id}`}
            alt={user.firstName}
            className="w-10 h-10 rounded-full mr-4"
          /> */}
          <div>
            <p className="font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListUsers