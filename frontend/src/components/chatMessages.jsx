import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_MESSAGES, CREATE_CHAT_MESSAGE } from "../graphQL/queries";

const ChatMessages = (props) => {
  const [messages, setMessages] = useState(undefined);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [state, setState] = useState(false);

  const [webSocket,setWebSocket] = useState(undefined)

  const { userId, chatUserId, chatUserFullName } = props.data;

  // const memoizedInputMessage = useMemo(() => inputMessage, [inputMessage]);

  const {
    loading: loadingChatMessage,
    error: errorChatMessage,
    data: dataChatMessage,
    refetch,
  } = useQuery(GET_CHAT_MESSAGES, {
    variables: {
      yourUserId: Number(userId),
      chatUserId: Number(chatUserId),
    },
    skip: !chatUserId,
  });

  // if (dataChatMessage) {
  //   console.log(dataChatMessage.chatMessages);
  // }


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const [
    createMessageMutate,
    {
      loading: loadingCreateMessage,
      error: errorCreateMessage,
      data: dataCreateMessage,
    },
  ] = useMutation(CREATE_CHAT_MESSAGE);

  useEffect(() => {
    if (dataChatMessage) {
      // console.log('look at',dataChatMessage.chatMessages)
      setMessages(dataChatMessage.chatMessages);
    }
  }, [dataChatMessage]);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:5000/ws/chat/");    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    setWebSocket(ws)
  },[])

  if (loadingChatMessage) return <div>Loading chat messages...</div>;
  if (errorChatMessage) return <div>Error in loading chat messages</div>;

  function handleMessageChange(event) {
    setInputMessage(event.target.value);
  }

  


  const handleSendMessage = async (e) => {
    // console.log(userId, chatUserId,inputMessage);

    e.preventDefault();
    try {
      const dataCreatedMessage = await createMessageMutate({
        variables: {
          senderUserId: Number(userId),
          recipientUserId: Number(chatUserId),
          content: inputMessage,
        },
      });

      webSocket.send(JSON.stringify(dataCreatedMessage.data.createMessage.message));

      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        data.message.chatUserId = Number(chatUserId);        
        setMessages((prevMessages) => [...prevMessages, data.message]);        
        // webSocket.close();
      };
      webSocket.onclose = () => {
        console.log("WebSocket disconnected");
      };
    

      setInputMessage("");
      // refetch()
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-[600px] h-[80vh] border border-gray-300 rounded-lg shadow-lg">
        <div className="bg-gray-200 p-4 rounded-t-lg border-b border-gray-300">
          <h2 className="text-xl font-semibold">{chatUserFullName}</h2>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-grow p-4 overflow-y-auto space-y-4"
        >
          {messages &&
            messages.map((message, index) => {
              const timestamp = new Date(message.timestamp);
              const timeString = timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              return (
                <div key={index}>
                  {message.sender.id === chatUserId ? (
                    <div className="flex justify-start p-2">
                      <div className="bg-green-100 py-1 px-3 rounded-lg max-w-xs shadow-md">
                        <p>{message.content}</p>
                        <small className="text-gray-500 block mt-1 text-left">
                          {timeString}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end p-2">
                      <div className="bg-blue-100 py-1 px-3 rounded-lg max-w-xs shadow-md">
                        <p>{message.content}</p>
                        <small className="text-gray-500 block mt-1 text-right">
                          {timeString}
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <form onSubmit={handleSendMessage}>
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              type="text"
              placeholder="Type your message"
              value={inputMessage}
              onChange={handleMessageChange}
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatMessages;
