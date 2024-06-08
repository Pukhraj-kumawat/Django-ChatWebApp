import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_MESSAGES, CREATE_CHAT_MESSAGE } from "../graphQL/queries";
import { CgCornerUpLeft, CgCornerUpRight } from "react-icons/cg";
import { RxCrossCircled } from "react-icons/rx";

const ChatMessages = (props) => {
  const [messages, setMessages] = useState(undefined);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [state, setState] = useState(false);
  const [dateBreak, setDateBreak] = useState(false);
  const [replyTo, setReplyTo] = useState({ id: "" });

  const { userId, chatUserId, chatUserFullName, webSocket, SetNewMessage } =
    props.data;

  // const memoizedInputMessage = useMemo(() => inputMessage, [inputMessage]);

  console.log("chatUserId", chatUserId);

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

  useEffect(() => {
    setReplyTo({ id: "" });
    refetch();
  }, [chatUserId]);

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
      data: dataCreatedMessage,
    },
  ] = useMutation(CREATE_CHAT_MESSAGE);

  useEffect(() => {
    if (dataChatMessage) {
      setMessages(dataChatMessage.chatMessages);
      // console.log("updated messages", dataChatMessage.chatMessages);
    }
  }, [dataChatMessage]);

  if (loadingChatMessage) return <div>Loading chat messages...</div>;
  if (errorChatMessage) return <div>Error in loading chat messages</div>;

  function handleMessageChange(event) {
    setInputMessage(event.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInputMessage((prevMessage) => prevMessage + "\n");
      } else {
        e.preventDefault();
        handleSendMessage(e);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const dataCreatedMessage = await createMessageMutate({
        variables: {
          senderUserId: Number(userId),
          recipientUserId: Number(chatUserId),
          content: inputMessage,
          replyTo: replyTo.id,
        },
      });

      webSocket.send(
        JSON.stringify(dataCreatedMessage.data.createMessage.message)
      );

      setInputMessage("");
      setReplyTo({ id: "" });
      // refetch()
    } catch (error) {
      console.log("Error:", error);
    }
  };

  webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    data.message.chatUserId = Number(chatUserId);
    // console.log(data.message);
    setMessages((prevMessages) => [...prevMessages, data.message]);
    SetNewMessage({ sender: data.message.sender.username, count: 1 });
    // webSocket.close();
  };
  webSocket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  const replyToSender = (messageId, messageContent, messageTimeString) => {
    setReplyTo({
      id: messageId,
      content: messageContent,
      timeString: messageTimeString,
      replyToSender: true,
      replyToRecipient: false,
    });
  };

  const replyToRecipient = (messageId, messageContent, messageTimeString) => {
    setReplyTo({
      id: messageId,
      content: messageContent,
      timeString: messageTimeString,
      replyToRecipient: true,
      replyToSender: false,
    });
  };

  return (
    <>
      <div className="flex flex-col w-[730px] h-[80vh] border border-gray-300 rounded-lg shadow-lg">
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
              const dateString = timestamp.toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              let prevDateString = null;
              if (index !== 0) {
                const prevTimeStamp = new Date(messages[index - 1].timestamp);
                prevDateString = prevTimeStamp.toLocaleDateString([], {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              }

              return (
                <div key={index}>
                  {(index === 0 || dateString !== prevDateString) &&
                    (message.sender.id == chatUserId ||
                      message.sender.id == userId) && (
                      <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 font-semibold text-gray-500">
                          {dateString}
                        </span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                      </div>
                    )}

                  {message.sender.id == chatUserId && (
                    <>
                      <div className="flex justify-start p-2 relative pl-8">
                        <div className="bg-green-100 py-1 px-3 rounded-lg max-w-xs shadow-md">
                          {message.parent && (
                            <div className="bg-blue-100 py-1 px-3 rounded-lg max-w-xs shadow-md mb-2 -mx-3">
                              <p
                                className="text-gray-700 text-sm"
                                dangerouslySetInnerHTML={{
                                  __html: message.parent.content.replace(
                                    /\n/g,
                                    "<br>"
                                  ),
                                }}
                              ></p>
                              <small className="text-gray-500 block mt-1 text-right">
                                {new Date(
                                  message.parent.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </small>
                            </div>
                          )}

                          <p
                            dangerouslySetInnerHTML={{
                              __html: message.content.replace(/\n/g, "<br>"),
                            }}
                          ></p>

                          <small className="text-gray-500 block mt-1 text-left">
                            {timeString}
                          </small>
                        </div>
                        <div
                          className="absolute bottom-5 left-0  m-2 hover:opacity-50"
                          onClick={() => {
                            replyToSender(
                              message.id,
                              message.content,
                              timeString
                            );
                          }}
                        >
                          <CgCornerUpLeft />
                        </div>
                      </div>
                    </>
                  )}

                  {message.sender.id == userId && (
                    <div className="flex justify-end p-2 relative pr-8">
                      <div className="bg-blue-100 py-1 px-3 rounded-lg max-w-xs shadow-md">
                        {message.parent && (
                          <div
                            className={`${
                              message.sender.id !== message.parent.sender.id
                                ? "bg-green-100 -mx-3"
                                : "bg-blue-100 border border-gray-300"
                            } py-1 px-3 rounded-lg max-w-xs shadow-md mb-2 -mx-3`}
                          >
                            <p
                              className="text-gray-700 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: message.parent.content.replace(
                                  /\n/g,
                                  "<br>"
                                ),
                              }}
                            ></p>
                            <small className="text-gray-500 block mt-1 text-right">
                              {new Date(
                                message.parent.timestamp
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </small>
                          </div>
                        )}

                        <p
                          dangerouslySetInnerHTML={{
                            __html: message.content.replace(/\n/g, "<br>"),
                          }}
                        ></p>

                        <small className="text-gray-500 block mt-1 text-right">
                          {timeString}
                        </small>
                      </div>
                      <div
                        className="absolute bottom-5 right-0 m-2 hover:opacity-50"
                        onClick={() => {
                          replyToRecipient(
                            message.id,
                            message.content,
                            timeString
                          );
                        }}
                      >
                        <CgCornerUpRight />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <form onSubmit={handleSendMessage}>
          {replyTo.id && (
            <div className="bg-gray-100 mx-4 my-2 pb-2 px-2 pt-1 flex justify-between rounded-lg">
              <div>
                {replyTo.replyToSender ? (
                  <>
                    <CgCornerUpLeft />
                    <div className="bg-green-100 py-1 px-3 rounded-lg max-w-xs shadow-md mt-4">
                      <p>{replyTo.content}</p>
                      <small className="text-gray-500 block mt-1 text-left">
                        {replyTo.timeString}
                      </small>
                    </div>
                  </>
                ) : (
                  <>
                    <CgCornerUpRight />
                    <div className="bg-blue-100 py-1 px-3 rounded-lg max-w-xs shadow-md mt-4">
                      <p>{replyTo.content}</p>
                      <small className="text-gray-500 block mt-1 text-right">
                        {replyTo.timeString}
                      </small>
                    </div>
                  </>
                )}
              </div>
              <div>
                <RxCrossCircled
                  className="hover:opacity-50"
                  onClick={() => {
                    setReplyTo({ id: "" });
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center p-4 border-t border-gray-300">
            <textarea
              type="text"
              placeholder="Type your message"
              value={inputMessage}
              onKeyDown={handleKeyDown}
              onChange={handleMessageChange}
              required
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  h-10"
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
