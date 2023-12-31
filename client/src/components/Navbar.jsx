import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { TbBrandGravatar } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { dropCredential } from "../redux/slices/userSlice";
import LogoIcon from "./LogoIcon";

const TOOLTIP_STYLE = {
  paddingLeft: "4px",
  paddingRight: "4px",
  paddingTop: "2px",
  paddingBottom: "2px",
  fontSize: "12px",
  backgroundColor: "#616161",
};

const Navbar = ({ scrollToFeaturedSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authData } = useSelector((state) => state.user);

  const sidebar = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target)) return;
      setSidebarOpen(false);
    };
    const scrollHandler = ({ target }) => {
      if (!sidebarOpen) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("scroll", scrollHandler);
    };
  });

  const toggleBtnHandler = (e) => {
    e.stopPropagation();
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="fixed top-0  bg-neutral-100 w-full z-[999] drop-shadow">
        <nav className="flex justify-between items-center px-4 lg:grid lg:grid-cols-8 py-1">
          <Link to="/" className="lg:col-span-2 ml-2">
            <LogoIcon />
          </Link>
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center gap-5">
            <ul className="flex gap-6 text-sm font-tabs cursor-pointer">
              {location.pathname === "/" ? (
                <button
                  onClick={() => scrollToFeaturedSection()}
                  className="hover:scale-110"
                >
                  New & Featured
                </button>
              ) : (
                <Link to="/#featuredSection" className="hover:scale-110">
                  New & Featured
                </Link>
              )}

              <NavLink to="/packages" className="hover:scale-110">
                Packages
              </NavLink>
              <NavLink to="/properties" className="hover:scale-110">
                Rooms & Resorts
              </NavLink>
              <NavLink to="/connect" className="hover:scale-110">
                Contact Us
              </NavLink>
            </ul>
          </div>
          <div className="lg:col-span-1 flex justify-center items-center">
            {Object.keys(authData).length > 0 ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/saved"
                  data-tooltip-id="favorates"
                  data-tooltip-content="favorates"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 hover:transform hover:-translate-y-1 hover:scale-105"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </Link>
                <Tooltip style={TOOLTIP_STYLE} id="favorates" place="bottom" />
                <Link
                  to="/bookings"
                  data-tooltip-id="bookings"
                  data-tooltip-content="bookings"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 hover:transform hover:-translate-y-1 hover:scale-105"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </Link>
                <Tooltip style={TOOLTIP_STYLE} id="bookings" place="bottom" />

                <div className="ml-2 p-[0.10rem] relative w-10 h-10 rounded-full bg-neutral-200 shadow-md hover:drop-shadow-lg cursor-pointer">
                  <button
                    onClick={() => setDropdown((prev) => !prev)}
                    className="focus:outline-none overflow-hidden z-50 w-full h-full"
                  >
                    {authData?.avatar ? (
                      <img
                        src={
                          authData?.avatar?.includes("http")
                            ? authData.avatar
                            : `http://localhost:8000/${authData?.avatar}`
                        }
                        alt="icon"
                        className="object-cover rounded-full z-50"
                      />
                    ) : (
                      <TbBrandGravatar size={30} className="mx-auto" />
                    )}
                  </button>
                  {dropdown && (
                    <div className="absolute top-12 right-6 w-48 z-50 p-6 bg-neutral-100 cursor-default shadow-xl rounded-xl">
                      <ul className="flex flex-col justify-center items-center gap-2 mb-2">
                        <li className=" mt-1 text-red-600 font-body text-lg">
                          <button
                            onClick={() => dispatch(dropCredential())}
                            className="focus:outline-none rounded-full px-4 py-0.5 hover:ring-1 ring-red-600"
                          >
                            logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:block">
                <NavLink
                  to="/auth"
                  className="rounded-2x shadow-md  py-2 px-4 cursor-pointer  font-bold bg-secondary  font-body text-sm text-primary"
                >
                  Account
                </NavLink>
              </div>
            )}
            <div
              className="lg:hidden cursor-pointer transition-all duration-200"
              onClick={toggleBtnHandler}
            >
              {sidebarOpen ? (
                <AiOutlineClose className="mx-auto w-6 h-6 text-red-800" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                  />
                </svg>
              )}
            </div>
          </div>
        </nav>
      </header>
      {sidebarOpen && (
        <aside
          ref={sidebar}
          className={`absolute left-0 top-14 bottom-0 z-50 flex w-56 flex-col overflow-y-hidden bg-neutral-100 text-black/75  duration-300 ease-linear lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
            {/* <!-- Sidebar Menu --> */}
            <nav className="mt-5 py-4 px-4 lg:m-0  lg:px-6 font-tabs">
              {/* <!-- Menu Group --> */}
              <div>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {/* <!-- Menu Item Dashboard --> */}
                  <li>
                    {location.pathname === "/" ? (
                      <button
                        onClick={() => scrollToFeaturedSection()}
                        className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                      >
                        New & Featured
                      </button>
                    ) : (
                      <NavLink
                        to="/#featuredSection"
                        className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                      >
                        New & Featured
                      </NavLink>
                    )}
                  </li>
                  {/* <!-- Menu Item Dashboard --> */}

                  {/* <!-- Menu Item Packages --> */}
                  <li>
                    <NavLink
                      to="/packages"
                      className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                    >
                      Packages
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item Packages --> */}

                  {/* <!-- Menu Item Properties --> */}
                  <li>
                    <NavLink
                      to="/properties"
                      className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                    >
                      Rooms & Resorts
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item Properties --> */}

                  {/* <!-- Menu Item Reservations --> */}
                  <li>
                    <NavLink
                      to="/connect"
                      className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                    >
                      Contact Us
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item Reservations --> */}

                  {Object.keys(authData).length > 0 ? (
                    <>
                      <li>
                        <NavLink
                          to="#"
                          className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li
                        onClick={() => dispatch(dropCredential())}
                        className="py-2 ring-1 ring-red-600 text-red-600 rounded-full flex justify-center items-center gap-2 "
                      >
                        <BiLogOutCircle />
                        <button className="focus:outline-none">logout</button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <NavLink
                        to="/auth"
                        className="group relative flex items-center gap-2.5 py-2 px-4 font-medium duration-300 ease-in-out"
                      >
                        Account
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
            {/* <!-- Sidebar Menu --> */}
          </div>
        </aside>
      )}
    </>
  );
};

export default Navbar;
