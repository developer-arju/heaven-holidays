import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getRequest, setAccessToken } from "../../utils/axios";

import { FcFaq } from "react-icons/fc";
import { MdSend } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { GoDotFill } from "react-icons/go";

import userAvatar from "../../assets/userAvatar.png";

const Messages = ({ socket }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const { authData } = useSelector((state) => state.admin);
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const chatId = queryParam.get("active");

  useEffect(() => {
    (async () => {
      await socket.emit("check-status", "admin");
      setLoading(true);
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/messages");
      if (data) {
        if (chatId) {
          data.forEach((chat) => {
            if (chat._id === chatId) {
              setActiveChat(chat);
            }
          });
        }
        const sortedChats = sortChats(data);
        setChats([...sortedChats]);
        setLoading(false);
      }
      if (error) {
        setLoading(false);
        console.log(error?.message);
      }
    })();
  }, []);

  useEffect(() => {
    const msgBox = document.querySelector("#show-msg");
    msgBox?.scrollTo(0, msgBox.scrollHeight);
  }, [activeChat]);

  useEffect(() => {
    socket.on("send-message", (data) => {
      setChats((prev) => {
        prev.forEach((chat) => {
          if (chat.clientId._id === data.clientId) {
            chat.messages = data.messages;
          }
        });
        const sortedChats = sortChats(prev);
        return sortedChats;
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

  const sendMessage = async () => {
    await socket.emit("reply-message", {
      text,
      chatId: activeChat._id,
      clientId: activeChat.clientId._id,
    });
    setChats((prev) => {
      prev.forEach((chat) => {
        if (chat._id === activeChat._id) {
          chat.messages.push({
            sender: "admin",
            text,
            timestamp: Date.now(),
          });
        }
      });
      const sortedChats = sortChats(prev);
      return sortedChats;
    });
    setText("");
  };

  function sortChats(data) {
    for (let i = 0; i < data.length - 1; i++) {
      let timestampA = data[i].messages[data[i].messages.length - 1].timestamp;
      let timestampB =
        data[i + 1].messages[data[i + 1].messages.length - 1].timestamp;
      timestampA = new Date(timestampA);
      timestampB = new Date(timestampB);
      if (timestampA - timestampB < 0) {
        const temp = data[i];
        data[i] = data[i + 1];
        data[i + 1] = temp;
      }
    }
    return data;
  }

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
                          : userAvatar // change when user profile done
                      }
                      alt=""
                      className="w-10 aspect-square rounded-full"
                    />
                  ) : (
                    <img
                      src={userAvatar}
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
                    : userAvatar
                }
                alt=""
                className="w-8 aspect-square rounded-full object-cover"
              />
            ) : (
              <img
                src={userAvatar}
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
