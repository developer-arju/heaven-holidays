import React from "react";
import { Link } from "react-router-dom";
import Logo from "../LogoIcon";
import DropdownBtn from "./DropdownBtn";
import { RiMenu2Fill } from "react-icons/ri";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0  flex w-full bg-gray-500 drop-shadow z-[99]">
      <div className="flex flex-grow items-center justify-between lg:justify-end py-2 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-10 block rounded-sm border-2 border-black p-1 shadow-md lg:hidden"
          >
            <RiMenu2Fill />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" to="/admin">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-3 ">
          {/* <ul className="flex items-center gap-2 "> */}
          {/* <!-- Notification Menu Area --> */}
          {/* <DropdownNotification /> */}
          {/* <!-- Notification Menu Area --> */}

          {/* <!-- Chat Notification Area --> */}
          {/* <DropdownMessage /> */}
          {/* <!-- Chat Notification Area --> */}
          {/* </ul> */}

          {/* <!-- User Area --> */}
          <DropdownBtn />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
