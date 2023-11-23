import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken } from "../../utils/axios";

import { FcFaq } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { GoDotFill } from "react-icons/go";

const Messages = ({ socket }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const { authData } = useSelector((state) => state.admin);

  useEffect(() => {
    (async () => {
      await socket.emit("check-status", "admin");
      setLoading(true);
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/messages");
      setLoading(false);
      if (data) {
        setChats([...data]);
      }
      if (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const msgBox = document.querySelector("#show-msg");
    msgBox?.scrollTo(0, msgBox.scrollHeight);
  }, [chats]);

  useEffect(() => {
    socket.on("send-message", (data) => {
      setChats((prev) => {
        return prev.map((chat) => {
          if (chat.clientId._id === data.clientId) {
            chat.messages = data.messages;
            return chat;
          }
          return chat;
        });
      });
    });
    socket.on("reply-response", (data) => {
      setChats((prev) => {
        return prev.map((chat) => {
          if (chat._id === data._id) {
            chat.messages = data.messages;
            return chat;
          }
          return chat;
        });
      });
    });
    socket.on("online-users", (data) => {
      const online = new Set();
      for (const key in data) {
        if (key !== "admin") {
          online.add(data[key]);
        }
      }
      setOnlineUsers([...online]);
    });
  }, [socket]);

  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);

  const sendMessage = async () => {
    await socket.emit("reply-message", {
      text,
      chatId: activeChat._id,
      clientId: activeChat.clientId._id,
    });
    setText("");
  };

  return (
    <div className="grid md:grid-cols-[2fr_3fr] h-[480px] gap-2 mt-4">
      <div className="bg-neutral-100 rounded-2xl overflow-hidden">
        <h2 className="font-body font-bold text-base px-5 py-4 bg-sky-100 shadow-lg">
          Chats
        </h2>
        <div className="w-full h-full py-1 overflow-auto">
          {chats &&
            chats.map((chat) => {
              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 cursor-pointer"
                >
                  {chat.clientId.avatar ? (
                    <img
                      src={
                        chat.clientId.avatar.includes("http")
                          ? chat.clientId.avatar
                          : `http://localhost:8000/${chat.clientId.avatar}`
                      }
                      alt=""
                      className="w-10 aspect-square rounded-full"
                    />
                  ) : (
                    <img
                      src="/src/assets/userAvatar.png"
                      alt=""
                      className="w-10 aspect-square rounded-full"
                    />
                  )}
                  <div className="flex-grow flex items-center justify-between">
                    <h2 className="font-body font-medium text-sm text-blue-600">
                      {chat.clientId.name}
                    </h2>
                    {onlineUsers.includes(chat.clientId._id) && (
                      <GoDotFill color="green" />
                    )}
                  </div>
                </div>
              );
            })}

          {loading && (
            <div className="w-full h-full flex justify-center items-center">
              <MoonLoader color="#36d7b7" />
            </div>
          )}
        </div>
      </div>
      {activeChat ? (
        <div className="rounded-2xl overflow-hidden bg-neutral-100 grid grid-rows-[64px_1fr_72px]">
          <div className="chat-header flex items-center gap-3 bg-sky-100 px-5 py-3 shadow-lg ">
            {activeChat.clientId.avatar ? (
              <img
                src={
                  activeChat.clientId.avatar.includes("http")
                    ? activeChat.clientId.avatar
                    : `http://localhost:8000/${activeChat.clientId.avatar}`
                }
                alt=""
                className="w-8 aspect-square rounded-full object-cover"
              />
            ) : (
              <img
                src="/src/assets/userAvatar.png"
                alt=""
                className="w-10 aspect-square rounded-full"
              />
            )}
            <h2 className="font-body font-bold text-base">
              {activeChat.clientId.name}
            </h2>
          </div>
          <div
            id="show-msg"
            className="flex flex-col justify-items-end overflow-auto px-8 py-4 chat-scrollbar"
          >
            {activeChat.messages?.length > 0 &&
              activeChat.messages.map((msg) => {
                if (msg.sender !== "client") {
                  return (
                    <div
                      key={msg._id}
                      className="text-right text-sm py-2.5 text-white"
                    >
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        {msg.text}
                      </span>
                      <p className="font-body text-[10px] font-medium text-black mt-1">
                        {new Date(msg.timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div key={msg._id} className="mb-4 font-body">
                      <span className="text-sm px-4 py-1.5 bg-white rounded-full">
                        {msg.text}
                      </span>
                      <p className="font-body text-[10px] font-medium text-blue-400 mt-1 px-4">
                        {new Date(msg.timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  );
                }
              })}
          </div>
          <div className="bg-gray-200 flex items-center gap-2 px-4">
            <FcFaq size={36} />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              className="p-2 flex-grow focus:outline-none focus:border border-sky-200 rounded-md"
            />
            <MdSend
              onClick={sendMessage}
              size={36}
              className="cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center font-body text-sm font-medium text-gray-400">
          select chat to send messages
        </div>
      )}
    </div>
  );
};

export default Messages;
