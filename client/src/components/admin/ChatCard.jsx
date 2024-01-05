import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setAccessToken, getRequest } from "../../utils/axios";
import UserOne from "../../assets/userAvatar.png";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ChatCard = ({ socket }) => {
  const { authData } = useSelector((state) => state.admin);
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    (async () => {
      await socket.emit("check-status", "admin");
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/messages");
      if (data) {
        setChat([...data]);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);

  useEffect(() => {
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

  return (
    <div className="relative col-span-12 h-[28.5rem] rounded-sm border border-stroke bg-white pb-6 shadow-default xl:col-span-4 overflow-y-scroll invisible-scrollbar">
      <h4 className="sticky top-0 z-40 box-border  pt-6 pb-4 bg-white px-7 text-xl font-semibold text-black">
        Chats
      </h4>

      <div>
        {chat.length > 0 &&
          chat.map((user) => {
            console.log(user);
            const msgTime = new Date(
              user.messages[user.messages.length - 1].timestamp
            );

            const day = msgTime.getDate();
            const monthAbbreviation = months[msgTime.getMonth()];
            const hours = msgTime.getHours();
            const minutes = msgTime.getMinutes();
            const ampm = hours >= 12 ? "pm" : "am";

            const formattedString = `${monthAbbreviation} ${day}, ${
              hours % 12 || 12
            }:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
            return (
              <Link
                to={`/admin/messages?active=${user._id}`}
                key={user._id}
                className="flex items-center gap-5 py-3 px-7 hover:bg-gray-300"
              >
                <div className="relative h-14 w-14">
                  <img
                    className="rounded-full"
                    src={
                      user.clientId.avatar
                        ? user.clientId.avatar.includes("http") &&
                          user.clientId.avatar
                        : UserOne
                    }
                    alt="User"
                  />
                  {onlineUsers.includes(user.clientId._id) ? (
                    <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
                  ) : (
                    <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-7"></span>
                  )}
                </div>

                <div className="flex-grow flex flex-col">
                  <div>
                    <h5 className="font-medium text-black">
                      {user.clientId.name}
                    </h5>
                    <p>
                      <span className="text-sm text-black">
                        {user.messages[user.messages.length - 1].text}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-right block">
                    {formattedString}
                  </span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default ChatCard;
