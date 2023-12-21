import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest, putRequest } from "../../utils/axios";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { FaFileDownload } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { GrFormClose } from "react-icons/gr";
import Invoice from "../../components/Invoice";

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
  const { authData } = useSelector((state) => state.admin);
  //   const [modal, setModal] = useState({ active: false, payload: "" });
  const [singleView, setSingleView] = useState({ show: false, doc: null });
  const [Bookings, setBookings] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const pagination = useRef(null);
  const totalPages = useMemo(() => {
    return Math.ceil(Bookings.length / 5);
  }, [Bookings.length]);

  const fetchBookings = async () => {
    setAccessToken(authData.token);
    const { data, error } = await getRequest("/admin/Bookings");
    if (data) {
      setBookings(data);
    }
    if (error) {
      document.getElementById("isEmpty").classList.replace("hidden", "flex");
      toast.error(error.message);
      console.log(error.message || message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (pagination.current) pagination.current.innerHTML = "";
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
      window.removeEventListener("click", pageClick);
    };
  }, [totalPages, currPage]);

  function pageClick(e) {
    e.stopPropagation();
    const pageNumber = parseInt(e.target.textContent);
    setCurrPage(pageNumber);
  }

  const showSingleBooking = async (id) => {
    const doc = Bookings.filter((obj) => obj._id === id);
    setSingleView({ show: true, doc: doc[0] });
  };

  //   const statusChange = async (e) => {
  //     e.stopPropagation();
  //     console.log(modal);
  //     const { data, error } = await putRequest("/admin/Bookings/status-toggle", {
  //       providerId: modal.payload,
  //     });
  //     if (data) {
  //       setBookings((prev) => {
  //         return prev.map((doc) => {
  //           if (doc._id === data._id) {
  //             return data;
  //           }
  //           return doc;
  //         });
  //       });
  //     }
  //     if (error) {
  //       console.log(error.message);
  //       toast.error(error.message);
  //     }
  //     setModal({ active: false, payload: "" });
  //   };

  const fileDownloadHandler = (id) => {
    const doc = Bookings.filter((obj) => obj._id === id);
    const element = ReactDOMServer.renderToString(Invoice({ doc: doc[0] }));

    const options = {
      margin: 1.5,
      filename: `invoice-${id}.pdf`,

      jsPDF: {
        unit: "cm",
        format: "letter",
        putOnlyUsedFonts: true,
        orientation: "portrait",
      },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <>
      <div className="flex justify-between mx-4 px-4 mb-4 items-center">
        <div className="font-body font-bold text-2xl">Bookings</div>
        {/* <Link
          to="#"
          data-tooltip-id="a"
          data-tooltip-content="Pending Requests"
          className="p-2 rounded-full bg-neutral-200 shadow-lg text-2xl"
        >
          <FcAcceptDatabase />
        </Link>
        <Tooltip style={TOOLTIP_STYLE} id="a" place="bottom-start" /> */}
      </div>
      <div className="mt-2 overflow-x-auto">
        {Bookings.length > 0 ? (
          <table className="min-w-full  table-auto text-center text-sm font-light">
            <thead className="border-b bg-neutral-50 shadow-inner font-medium">
              <tr>
                <th scope="col" className="px-2 py-4">
                  Booking Id
                </th>
                <th scope="col" className="px-6 py-4">
                  User
                </th>
                <th scope="col" className="px-6 py-4">
                  Item
                </th>
                <th scope="col" className="px-6 py-4">
                  Amount
                </th>

                <th scope="col" className="px-6 py-4">
                  Booking Status
                </th>
                <th scope="col" className=" py-4"></th>
                <th scope="col" className=" py-4"></th>
                <th scope="col" className=" py-4"></th>
              </tr>
            </thead>
            <tbody>
              {Bookings.map((doc, index) => {
                if ((currPage - 1) * 5 > index || currPage * 5 < index + 1) {
                  return;
                }
                return (
                  <tr className="border-b" key={doc._id}>
                    <td className="whitespace-nowrap px-4 py-4 font-medium">
                      {doc._id}
                    </td>
                    <td className="whitespace-nowrap font-normal px-4 py-4">
                      {doc.userId.name}
                    </td>
                    <td className="whitespace-nowrap font-normal px-4 py-4">
                      {doc.packageId.packageName}
                    </td>
                    <td className="whitespace-nowrap font-normal px-4 py-4">
                      {doc.packageId.price}
                    </td>
                    <td
                      className={
                        doc.status !== "cancelled"
                          ? "whitespace-nowrap font-normal text-green-800 px-6 py-4"
                          : "whitespace-nowrap font-normal text-red-800 px-6 py-4"
                      }
                    >
                      {doc.status}
                    </td>

                    <td className="whitespace-nowrap py-4">
                      <CiViewList
                        onClick={() => showSingleBooking(doc._id)}
                        className="text-base cursor-pointer focus:outline-none view-form"
                      />

                      <Tooltip
                        style={TOOLTIP_STYLE}
                        place="bottom-end"
                        anchorSelect=".view-form"
                        content="view details"
                      />
                    </td>
                    <td className="whitespace-nowrap p-4">
                      <FaFileDownload
                        onClick={() => fileDownloadHandler(doc._id)}
                        id="save-pdf"
                        className="text-primary focus:outline-none cursor-pointer"
                      />
                      <Tooltip
                        style={TOOLTIP_STYLE}
                        place="bottom-end"
                        anchorSelect="#save-pdf"
                        content="save invoice"
                      />
                    </td>
                    <td className="whitespace-nowrap p-4">
                      <FcCancel
                        className={
                          !doc.cancelled
                            ? "text-lg text-red-600 cursor-pointer availability  focus:outline-none"
                            : "text-lg text-red-60 opacity-40 cursor-pointer availability focus:outline-none"
                        }
                        // onClick={() =>
                        //   setModal({
                        //     active: !modal.active,
                        //     payload: doc._id,
                        //   })
                        // }
                      />
                      {!doc.cancelled && (
                        <Tooltip
                          style={TOOLTIP_STYLE}
                          place="bottom-end"
                          anchorSelect=".availability"
                          content="cancel"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div
            id="isEmpty"
            className="hidden w-full h-96 flex-col justify-center items-center bg-neutral-100 rounded-md shadow-md"
          >
            <h2 className="font-serif font-semibold text-2xl text-center text-primary">
              Bookings Not Found
            </h2>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={fetchBookings}
                className="outline-none mt-2 font-tabs text-blue-600 hover:underline "
              >
                refresh
              </button>
            </div>
          </div>
        )}
      </div>
      {Bookings.length > 0 && (
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
      {/* {modal.active && (
        <div className="fixed top-0 left-0 lg:ml-28 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-8 py-4 rounded-md shadow-md">
            <p className="h-12 font-title">Confirm to change doc status</p>
            <h1 className="text-center font-serif text-blue-900">
              Are you sure?
            </h1>
            <div className="flex justify-evenly items-center my-2">
              <button
                className="px-4 py-1 rounded-md border border-blue-600 font-bold text-blue-600 hover:bg-blue-500 hover:text-white"
                onClick={() => setModal({ active: !modal.active, payload: "" })}
              >
                No
              </button>
              <button
                className="px-4 py-1 rounded-md border border-red-500 font-bold text-red-500 hover:bg-red-500 hover:text-white"
                onClick={statusChange}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )} */}
      {singleView.show && (
        <div
          onClick={() => setSingleView({ show: false, doc: null })}
          className="absolute wrapper top-0 left-0 w-full h-fit invisible-scrollbar bg-neutral-200 overflow-auto"
        >
          <div className="absolute left-1/2 cursor-pointer -translate-x-1/2 bottom-4  p-2.5 bg-red-200 rounded-full shadow-lg">
            <GrFormClose className="text-2xl" />
          </div>
          <Invoice doc={singleView?.doc} />
        </div>
      )}
    </>
  );
};

export default Bookings;
