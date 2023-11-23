import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRequest, setAccessToken } from "../utils/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { FcCallback, FcAssistant } from "react-icons/fc";
import { MdAlternateEmail, MdLocationCity, MdSend } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

const ContactPage = ({ socket }) => {
  const { authData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState(null);
  const [adminStatus, setAdminStatus] = useState(false);
  const { _id, token } = authData;
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("clientResponse", (chat) => {
      setMessages(chat.messages);
    });
    socket.on("curr-status", (status) => {
      setAdminStatus(status);
    });
    socket.on("from-admin", (data) => {
      setMessages(data.messages);
    });
  }, [socket]);

  useEffect(() => {
    const msgBox = document.querySelector("#msgBox");
    msgBox?.scrollTo(0, msgBox.scrollHeight);
  }, [messages]);

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/users/messages");
      setMessages(data);
      if (error) {
        console.log(error.message);
      }
    })();
    socket.emit("connect-socket", authData._id);
    socket.emit("check-status", "user");
  }, []);

  const messageSendHandler = async (e) => {
    if (Object.keys(authData).length < 1) return;
    socket.emit("clientMessage", { userId: _id, token, message });
    setMessage("");
  };

  return (
    <div className="relative min-h-screen bg-bg-1/60">
      <Navbar />
      <ToastContainer />
      <main className="grid grid-cols-1 md:grid-cols-2 place-items-center min-h-screen gap-y-4 py-16">
        <section className="max-w-sm font-body p-8 rounded-md bg-neutral-50 shadow-lg">
          <h1 className="mb-4 text-xl font-bold text-black">
            Have Any Questions?
          </h1>
          <p className="mb-4 text-sm font-normal italic text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            nemo ducimus vel, labore magnam itaque cum aliquam possimus numquam
            aliquid unde minima esse aut at.
          </p>

          <div className="grid grid-cols-[5%_90%] gap-2">
            <FcCallback className="inline-block m-auto" />
            <p className="text-sm">7867564532</p>
            <MdAlternateEmail color="#2196F3" className="inline-block m-auto" />
            <p className="text-sm">bussiness@email.com</p>
            <MdLocationCity className="inline-block m-auto" />
            <p className="text-sm">
              Phase 1, Info Road, Near Tapasya Block Kakkanad, Kochi, Kerala
              682042
            </p>
          </div>
        </section>
        <section className="w-11/12  h-96 flex items-center bg-neutral-50 rounded-2xl overflow-hidden shadow-xl font-body">
          {Object.keys(authData).length > 1 ? (
            <div className="w-full h-full">
              <div className="flex justify-between items-center px-6 bg-sky-100">
                <p className="py-4 text-base font-bold font-body">
                  Chat with us...
                </p>
                <p className="flex justify-center items-center gap-2 text-xs font-tabs py-2 px-4 font-medium bg-neutral-200">
                  Need help ?{adminStatus && <GoDotFill color="green" />}
                </p>
              </div>
              <div
                id="msgBox"
                className="h-[280px] flex flex-col justify-items-end px-4 py-2 overflow-auto chat-scrollbar"
              >
                {messages?.length > 0 ? (
                  messages.map((msg) => {
                    if (msg.sender === "client") {
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
                        <div
                          key={msg._id}
                          className="font-body text-white text-sm py-2.5"
                        >
                          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gray-400 via-gray-600-500 to-black">
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
                    }
                  })
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <p className="font-body font-semibold text-sm text-gray-400">
                      Any Queries, Chat with us...
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-neutral-100 h-12 flex px-4 gap-2 items-center">
                <FcAssistant size={25} />
                <input
                  type="text"
                  className="px-4 py-1 flex-grow focus:outline-none focus:border-2 rounded-md border-neutral-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={(e) =>
                    e.key === "Enter" && message !== "" && messageSendHandler()
                  }
                />
                <MdSend
                  size={25}
                  onClick={messageSendHandler}
                  className="cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Link
                to="/auth"
                className="block text-center px-8 py-4 rounded-xl bg-blue-500 hover:shadow-lg text-white text-xl font-medium"
              >
                Login for chat <br /> with us
              </Link>
            </div>
          )}
        </section>
      </main>
      <div className="absolute left-0 right-0 bottom-0 bg-bg-1">
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
