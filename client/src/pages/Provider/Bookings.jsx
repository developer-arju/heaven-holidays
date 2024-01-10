import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { getRequest, postRequest, setAccessToken } from "../../utils/axios";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";

const TOOLTIP_STYLE = {
  paddingLeft: "8px",
  paddingRight: "8px",
  paddingTop: "2px",
  paddingBottom: "4px",
  fontSize: "12px",
  fontWeight: "500",
  backgroundColor: "rgb(250, 250, 250)",
  color: " rgb(30 64 175)",
};

const Bookings = () => {
  const { authData } = useSelector((state) => state.provider);
  const [bookings, setBookings] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const pagination = useRef(null);
  const totalPages = useMemo(() => {
    return Math.ceil(bookings.length / 5);
  }, [bookings]);

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/provider/bookings");
      if (data) {
        setIsLoaded(true);
        setBookings([...data]);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);

  useEffect(() => {
    for (let i = 1; i <= totalPages; i++) {
      let child = document.createElement("p");
      child.onclick = pageClick;
      child.textContent = i;
      if (currPage === i) {
        child.className =
          "border-b w-6 text-center text-base font-bold cursor-pointer rounded-t-sm bg-neutral-100 shadow-inner border-black";
      } else {
        child.className =
          "border-b w-6 text-center text-base font-bold cursor-pointer border-gray-400";
      }
      pagination.current.appendChild(child);
    }

    return () => {
      for (let i = 1; i <= totalPages; i++) {
        if (pagination.current) {
          const child = pagination.current.querySelector(":last-child");
          if (child) {
            child.removeEventListener("click", pageClick);
            child.remove();
          }
        }
      }
    };
  }, [totalPages, currPage]);

  function pageClick(e) {
    e.stopPropagation();
    const pageNumber = parseInt(e.target.textContent);
    setCurrPage(pageNumber);
  }

  const showHandler = (e) => {
    e.preventDefault();
    const parentElement = e.currentTarget.parentNode;
    const ulRows = document.querySelectorAll(".menu-item");
    const ulSibling = parentElement.querySelector("ul");
    ulRows.forEach((ul) => ulSibling !== ul && ul.classList.add("hidden"));
    ulSibling.classList.toggle("hidden");
  };

  const changeBookingStatus = async (e) => {
    e.preventDefault();
    const dataValue = e.target.getAttribute("data-value");
    const bookingId = e.target.getAttribute("data-id");
    console.log(dataValue, bookingId);
    setAccessToken(authData.token);
    const { data, error } = await postRequest(
      "/provider/booking-status/change",
      {
        dataValue,
        bookingId,
      }
    );
    if (data) {
      setBookings((prev) =>
        prev.map((booking) => {
          if (booking._id === data.bookingId) {
            booking.status = dataValue;
          }
          return booking;
        })
      );
    }
  };

  return (
    <>
      <div className="flex mx-4 px-4 py-2 items-center">
        <div className="font-tabs text-2xl">Package Bookings</div>
      </div>
      <div className="mt-2 pt-2 overflow-x-auto">
        <table className="min-w-full table-auto text-center text-sm font-light">
          <thead className="border-b bg-neutral-50 shadow-inner font-medium">
            <tr>
              <th scope="col" className="px-6 py-4">
                Booking Id
              </th>
              <th scope="col" className="px-6 py-4">
                Customer Name
              </th>
              <th scope="col" className="px-6 py-4">
                Package Name
              </th>
              <th scope="col" className="px-6 py-4">
                Booking Date
              </th>
              <th scope="col" className="px-6 py-4">
                status
              </th>
              <th scope="col" className="px-6 py-4">
                Amount
              </th>
              <th scope="col" className="px-6 py-4"></th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 &&
              bookings.map((booking, index) => {
                const bookingDate = new Date(booking.startDate);
                if ((currPage - 1) * 5 > index || currPage * 5 < index + 1) {
                  return;
                }
                return (
                  <tr key={booking._id} className="border-b">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {booking._id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {booking?.identityProof?.name}
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {booking.packageId.packageName}
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {bookingDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td
                      className={
                        booking.status === "complete"
                          ? "whitespace-nowrap font-normal px-6 py-4 text-green-500"
                          : "whitespace-nowrap font-normal px-6 py-4"
                      }
                    >
                      {booking.status}
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {booking.paidAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`view/${booking._id}`}>
                        <MdOutlineDocumentScanner className="text-base cursor-pointer focus:outline-none view-form" />
                      </Link>
                      <Tooltip
                        style={TOOLTIP_STYLE}
                        place="bottom-end"
                        anchorSelect=".view-form"
                        content="view booking details"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 flex justify-center items-center">
                      <div className="relative">
                        <button
                          onClick={showHandler}
                          disabled={booking.status === "complete"}
                        >
                          <CiMenuFries className="text-lg text-blue-800 cursor-pointer availability focus:outline-none" />
                        </button>
                        {booking.status !== "complete" && (
                          <ul className="hidden menu-item absolute -left-24 -bottom-10 text-xs font-body text-white font-medium bg-neutral-600 rounded-md px-4 py-2">
                            {booking.status !== "on-going" &&
                              booking.status !== "complete" && (
                                <li
                                  onClick={changeBookingStatus}
                                  data-value="on-going"
                                  data-id={`${booking._id}`}
                                  className="mb-2 cursor-pointer hover:scale-110 hover:text-blue-400"
                                >
                                  on-Going
                                </li>
                              )}

                            <li
                              onClick={changeBookingStatus}
                              data-value="complete"
                              data-id={`${booking._id}`}
                              className="cursor-pointer hover:scale-110 hover:text-green-500"
                            >
                              Complete
                            </li>
                          </ul>
                        )}
                      </div>

                      <Tooltip
                        style={TOOLTIP_STYLE}
                        place="bottom-end"
                        anchorSelect=".availability"
                        content="change status"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {bookings.length > 0 && isLoaded && (
        <div className="flex justify-end items-center mr-8 mt-8">
          <p className="w-6 text-center text-base font-bold ">
            <BsFillCaretLeftFill
              onClick={() => currPage > 1 && setCurrPage(currPage - 1)}
              className="mx-auto cursor-pointer"
            />
          </p>
          <div className="flex items-center" ref={pagination}></div>
          <p className="w-6 text-center text-base font-bold ">
            <BsFillCaretRightFill
              onClick={() => currPage < totalPages && setCurrPage(currPage + 1)}
              className="mx-auto cursor-pointer"
            />
          </p>
        </div>
      )}
    </>
  );
};

export default Bookings;
