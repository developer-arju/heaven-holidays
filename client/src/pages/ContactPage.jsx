import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "../socket";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { FcCallback, FcAssistant } from "react-icons/fc";
import { MdAlternateEmail, MdLocationCity, MdSend } from "react-icons/md";

const ContactPage = () => {
  const { authData } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   socket.on("connect", (socket) => {
  //     console.log("socket connected");
  //   });
  //   socket.on("disconnect", (socket) => {
  //     console.log("socket disconnected");
  //   });
  // }, []);

  const messageSendHandler = async (e) => {
    console.log(message);
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
                <p className="text-xs font-tabs py-2 px-4 font-medium bg-neutral-200">
                  Need help ?
                </p>
              </div>
              <div className="h-[280px]"></div>
              <div className="bg-neutral-100 h-12 flex px-4 gap-2 items-center">
                <FcAssistant size={25} />
                <input
                  type="text"
                  className="px-4 py-1 flex-grow focus:outline-none focus:border-2 rounded-md border-neutral-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
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
