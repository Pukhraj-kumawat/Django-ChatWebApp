import React, { useEffect, useState } from "react";
import { GET_ALL_USERS } from "../graphQL/queries";
import { useQuery } from "@apollo/client";
import ChatMessages from "./chatMessages";
import { VscAccount } from "react-icons/vsc";

const ListUsers = (props) => {
  const { userId } = props.data;
  const [selectedDivId, setSelectedDivId] = useState(null);
  const [webSocket, setWebSocket] = useState(undefined);
  const [newMessage, setNewMessage] = useState(() => {
    const storedNewMessage = localStorage.getItem("newMessage");
    return storedNewMessage ? JSON.parse(storedNewMessage) : [];
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws/chat/");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    setWebSocket(ws);
  }, []);

  useEffect(() => {
    localStorage.setItem("newMessage", JSON.stringify(newMessage));
  }, [newMessage]);

  const storedChatUserId = localStorage.getItem("chatUserId");
  const storedChatUserFullName = localStorage.getItem("chatUserFullName");
  const storedChatUsername = localStorage.getItem("chatUsername");

  const clickUser = (event, chatUserId) => {
    localStorage.setItem(
      "chatUserFullName",
      event.currentTarget.querySelector(".chat-user-name").textContent
    );
    localStorage.setItem(
      "chatUsername",
      event.currentTarget.querySelector(".chat-username").textContent
    );
    localStorage.setItem("chatUserId", chatUserId);
    setSelectedDivId(chatUserId);
  };

  const {
    loading: loadingAllUsers,
    error: errorAllUsers,
    data: dataAllUsers,
  } = useQuery(GET_ALL_USERS, {
    variables: {
      yourUserId: Number(userId),
    },
  });

  if (loadingAllUsers) return <div>Loading all users ...</div>;
  if (errorAllUsers) return <div>Error in loading all users</div>;

  if (dataAllUsers) {
    return (
      <>
        <div className="flex space-x-4 fixed top-4 left-4">
          <div className="flex flex-col space-y-2 w-[300px] cursor-pointer select-none ">
            {dataAllUsers.allUsers.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded-lg shadow-md flex items-center cursor-pointer hover:bg-blue-50 active:scale-95 transition transform duration-75 ${
                  (selectedDivId === user.id) | (storedChatUserId === user.id)
                    ? "bg-green-200"
                    : "bg-gray-100"
                } `}
                id={`${user.id}`}
                onClick={(event) => {
                  clickUser(event, user.id);
                }}
              >
                {user.profilePicture ? (
                  <>
                  {/* Handle when user has profile picture */}
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-2">
                    <VscAccount size={40} className="hover:opacity-50" />
                  </div>
                )}

                <div>
                  <p className="font-semibold chat-user-name">
                    {user.firstName} {user.lastName}
                  </p>
                  <small className="text-gray-600 chat-username">
                    @{user.username}
                  </small>
                </div>

                {newMessage.map((ob, index) => {
                  return (
                    <div key={index + 0.5}>
                      {ob.sender == user.id && ob.recipient == userId && (
                        <span className="absolute top-3 right-3 -mt-1 -mr-1 bg-red-500 text-white font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {ob.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {storedChatUserId && (
            <div className="border border-black-500 w-[730px] rounded-lg">
              <ChatMessages
                data={{
                  userId: userId,
                  chatUserId: storedChatUserId,
                  chatUserFullName: storedChatUserFullName,
                  chatUsername: storedChatUsername,
                  webSocket: webSocket,
                  setNewMessage: setNewMessage,
                  newMessage: newMessage,
                }}
              />
            </div>
          )}
        </div>
      </>
    );
  }
};

export default ListUsers;
