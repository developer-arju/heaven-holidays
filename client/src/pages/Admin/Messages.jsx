import React from "react";
import { FcFaq } from "react-icons/fc";
import { MdSend } from "react-icons/md";

const Messages = () => {
  return (
    <div className="grid md:grid-cols-[2fr_3fr] h-[480px] gap-2 mt-4">
      <div className="bg-neutral-100 rounded-2xl overflow-hidden">
        <h2 className="font-body font-bold text-base px-5 py-4 bg-sky-100 shadow-lg">
          Customer
        </h2>
        <div className="w-full min-h-fit py-1 overflow-auto">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 cursor-pointer">
            <img
              src="/src/assets/userAvatar.png"
              alt=""
              className="w-10 aspect-square rounded-full"
            />
            <h2 className="font-body font-medium text-sm text-blue-600">
              Customer Name
            </h2>
          </div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden bg-neutral-100 grid grid-rows-[64px_1fr_72px]">
        <div className="chat-header flex items-center gap-3 bg-sky-100 px-5 py-3 shadow-lg ">
          <img
            src="/src/assets/userAvatar.png"
            alt="user-logo"
            className="w-8 aspect-square rounded-full object-cover"
          />
          <h2 className="font-body font-bold text-base">Name</h2>
        </div>
        <div>hello</div>
        <div className="bg-gray-200 flex items-center gap-2 px-4">
          <FcFaq size={36} />
          <input
            type="text"
            className="p-2 flex-grow focus:outline-none focus:border border-sky-200 rounded-md"
          />
          <MdSend size={36} className="cursor-pointer" />
        </div>
      </div>
      {/* <div className="w-full h-full flex justify-center items-center font-body text-sm font-medium text-gray-400">
        select customer to send messages
      </div> */}
    </div>
  );
};

export default Messages;
