import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAccessToken, getRequest, putRequest } from "../../utils/axios";

import { ScaleLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";

import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { MdPublishedWithChanges } from "react-icons/md";
import { FcAcceptDatabase } from "react-icons/fc";
import { RiCloseCircleFill } from "react-icons/ri";

import providerAvatar from "../../assets/userAvatar.png";

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

const ProviderList = () => {
  const { authData } = useSelector((state) => state.admin);
  const [modal, setModal] = useState({ active: false, payload: "" });
  const [providers, setProviders] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [requests, setRequests] = useState(false);
  const [pending, setPending] = useState({ response: false, data: [] });
  const pagination = useRef(null);
  const totalPages = useMemo(() => {
    return Math.ceil(providers.length / 5);
  }, [providers.length]);

  const fetchProviders = async () => {
    setAccessToken(authData.token);
    const response = await getRequest("/admin/providers");
    if (response.data) {
      setProviders(response.data);
    }
    if (response.error) {
      document.getElementById("isEmpty").classList.replace("hidden", "flex");
      toast.error(response.error.message);
      console.log(response.error.message || response.message);
    }
  };

  useEffect(() => {
    fetchProviders();
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

  const statusChange = async (e) => {
    e.stopPropagation();
    setAccessToken(authData.token);
    const { data, error } = await putRequest("/admin/providers/status-toggle", {
      providerId: modal.payload,
    });
    if (data) {
      setProviders((prev) => {
        return prev.map((doc) => {
          if (doc._id === data._id) {
            return data;
          }
          return doc;
        });
      });
    }
    if (error) {
      console.log(error.message);
      toast.error(error.message);
    }
    setModal({ active: false, payload: "" });
  };

  const showPendingRequests = async (e) => {
    e.stopPropagation();
    setRequests(true);
    setAccessToken(authData.token);
    const { data, error } = await getRequest(
      "/admin/provider/pending-requests"
    );
    if (data) {
      setPending({ response: true, data });
    }
    if (error) {
      setPending({ ...pending, response: true });
      toast.warn(error?.message);
    }
  };

  const providerControl = async (e) => {
    e.stopPropagation();
    const elem = e.target;
    const { id, status } = elem.dataset;

    setAccessToken(authData.token);
    const { data, error } = await putRequest("/admin/provider/change", {
      id,
      status,
    });
    if (data) {
      toast.success(data.message);
      setPending({
        ...pending,
        data: pending.data.filter((doc) => doc._id !== id),
      });
    }
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex justify-between mx-4 px-4 items-center">
        <div className="font-body font-bold text-2xl">Providers</div>
        <Link
          to="#"
          onClick={showPendingRequests}
          data-tooltip-id="a"
          data-tooltip-content="Pending Requests"
          className="p-2 rounded-full bg-neutral-200 shadow-lg text-2xl"
        >
          <FcAcceptDatabase />
        </Link>
        <Tooltip style={TOOLTIP_STYLE} id="a" place="bottom-start" />
      </div>
      {requests && (
        <div className="absolute top-4 left-4 right-4 bottom-4 shadow-lg rounded-lg bg-blue-50 z-[999]">
          <div className="relative w-full h-full flex justify-center py-4">
            <span
              onClick={() => setRequests(false)}
              className="absolute -right-4 -top-4"
            >
              <RiCloseCircleFill
                className="cursor-pointer"
                color="red"
                size={50}
              />
            </span>
            {!pending.response && <ScaleLoader color="#36d7b7" />}
            {pending.response && pending.data.length > 0 ? (
              <div className="overflow-auto">
                {pending.data.map((data) => {
                  console.log(data);
                  const reqDate = new Date(data.createdAt);
                  return (
                    <div className="flex items-center justify-between bg-neutral-100 p-2 rounded-md shadow-lg min-w-[840px]">
                      <div className="p-4">
                        <img
                          src={
                            data.brandLogo !== ""
                              ? `https://holidays.digimartshopy.shop/logo/${data.brandLogo}`
                              : providerAvatar
                          }
                          alt=""
                          className="w-16 aspect-square object-cover "
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 p-4 font-body">
                        <div className="text-blue-400 font-bold">
                          {`Provider Name: ${data.name}`}
                        </div>
                        <div className="text-blue-400 font-bold">
                          {`Bussiness Name: ${data.brandName}`}
                        </div>
                        <div className="font-medium text-xs leading-loose">{`Email: ${data.email}`}</div>
                        <div className="font-medium text-xs leading-loose">{`Official email: ${data.bussinessEmail}`}</div>
                        <div className="font-medium text-xs leading-loose">{`Mobile: ${data.mobile}`}</div>
                        <div className="font-medium text-xs leading-loose">{`Official Mobile: ${data.bussinessPhone}`}</div>
                        <div className="font-medium text-xs leading-loose">{`Request Date: ${reqDate.toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          }
                        )}`}</div>
                        <div className="font-medium text-xs leading-loose">{`GST Number: ${
                          data.gst !== ""
                            ? data.gst
                            : "gst number not available"
                        }`}</div>
                      </div>
                      <div
                        onClick={providerControl}
                        className="flex flex-col gap-2.5 p-4 font-body text-sm"
                      >
                        <button
                          data-id={data._id}
                          data-status="verified"
                          className=" px-4 py-1.5 rounded-md font-semibold bg-green-400 text-white shadow-lg hover:bg-white border border-green-400 hover:text-green-400"
                        >
                          Approve
                        </button>
                        <button
                          data-id={data._id}
                          data-status="rejected"
                          className=" px-4 py-1.5 rounded-md font-semibold bg-red-600 text-white shadow-lg hover:bg-white border border-red-600 hover:text-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="self-center font-body font-semibold text-base text-gray-600">
                There are no requests pending at this moment!
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-2 overflow-x-auto">
        {providers.length > 0 ? (
          <table className="min-w-full table-auto text-center text-sm font-light">
            <thead className="border-b bg-neutral-50 shadow-inner font-medium">
              <tr>
                <th scope="col" className="px-2 py-4">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-4">
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Bussiness Name
                </th>

                <th scope="col" className="px-6 py-4">
                  Bussiness Status
                </th>
                <th scope="col" className=" py-4"></th>
                <th scope="col" className=" py-4"></th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider, index) => {
                if ((currPage - 1) * 5 > index || currPage * 5 < index + 1) {
                  return;
                }
                return (
                  <tr className="border-b" key={provider._id}>
                    <td className="whitespace-nowrap px-2 py-4 font-medium">
                      <img
                        src={
                          provider.brandLogo
                            ? `https://holidays.digimartshopy.shop/logo/${provider.brandLogo}`
                            : providerAvatar
                        }
                        alt=""
                        className="aspect-square w-10 mx-auto rounded-full bg-neutral-200"
                      />
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {provider.name}
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {provider.email}
                    </td>
                    <td className="whitespace-nowrap font-normal px-6 py-4">
                      {provider.brandName}
                    </td>
                    <td
                      className={
                        !provider.blocked
                          ? "whitespace-nowrap font-normal text-green-800 px-6 py-4"
                          : "whitespace-nowrap font-normal text-red-800 px-6 py-4"
                      }
                    >
                      {!provider.blocked ? "available" : "unavailable"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <MdPublishedWithChanges
                        className={
                          !provider.blocked
                            ? "text-lg text-red-600 cursor-pointer availability focus:outline-none"
                            : "text-lg text-green-400 cursor-pointer availability focus:outline-none"
                        }
                        onClick={() =>
                          setModal({
                            active: !modal.active,
                            payload: provider._id,
                          })
                        }
                      />
                      <Tooltip
                        style={TOOLTIP_STYLE}
                        place="bottom-end"
                        anchorSelect=".availability"
                        content="change provider status"
                      />
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
              Providers Not Found
            </h2>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={fetchProviders}
                className="outline-none mt-2 font-tabs text-blue-600 hover:underline "
              >
                refresh
              </button>
            </div>
          </div>
        )}
      </div>
      {providers.length > 0 && (
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
      {modal.active && (
        <div className="fixed top-0 left-0 lg:ml-28 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-8 py-4 rounded-md shadow-md">
            <p className="h-12 font-title">Confirm to change provider status</p>
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
      )}
    </>
  );
};

export default ProviderList;
