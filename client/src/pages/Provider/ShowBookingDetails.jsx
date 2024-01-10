import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken } from "../../utils/axios";
import { BiSolidUserRectangle } from "react-icons/bi";
import { MdAlternateEmail } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";

const ShowBookingDetails = () => {
  const { id } = useParams();
  const { authData } = useSelector((state) => state.provider);
  const [bookingInfo, setBookingInfo] = useState({});

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest(`/provider/booking/view/${id}`);
      if (data) {
        console.log(data);
        setBookingInfo(data);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-5">
      <div className="md:col-span-3 px-8">
        <div className="mt-6 font-tabs font-bold text-lg border-b border-gray-600">
          Booking Information
        </div>
        <div className="overflow-hidden p-4 mt-4 font-body text-sm md: border-r border-gray-600">
          {Object.keys(bookingInfo).length > 0 && (
            <ul className="flex flex-col gap-4">
              <li>
                <span className="font-medium mr-2.5">Booking Date:</span>
                {`${new Date(bookingInfo.createdAt).toLocaleString("en-IN", {
                  timeStyle: "short",
                  dateStyle: "medium",
                })}`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Booking Id:</span>
                {`${bookingInfo._id}`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Package Name:</span>
                {`${bookingInfo.packageId.packageName}`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Package Duration:</span>
                {`${bookingInfo.packageId.dayCount} day ${
                  bookingInfo.packageId.nightCount
                    ? `${bookingInfo.packageId.nightCount} night`
                    : ""
                }`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Package Price:</span>
                {`${bookingInfo.packageId.price}`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Reservation Date:</span>
                {`${new Date(bookingInfo.startDate).toDateString()}`}
              </li>
              <li>
                <span className="font-medium mr-2.5">Booking Status:</span>
                {`${bookingInfo.status}`}
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="px-4 md:col-span-2">
        <div className="mt-6 font-tabs font-bold text-lg border-b border-gray-600">
          Customer Details
        </div>
        <div className="overflow-hidden p-4 mt-4 font-body text-sm ">
          {Object.keys(bookingInfo).length > 0 && (
            <ul className="flex flex-col gap-4">
              <li className="font-bold text-lg first-letter:capitalize">
                {`${bookingInfo.identityProof.title} ${bookingInfo.identityProof.name}`}
              </li>
              <li className="font-semibold text-base ps-4 border-b border-gray-600">
                Booking User
              </li>
              <li className="flex gap-3 items-center">
                <BiSolidUserRectangle size={22} />
                <span>{bookingInfo.userId.name}</span>
              </li>
              <li className="flex gap-3 items-center">
                <MdAlternateEmail size={22} />
                <span>{bookingInfo.userId.email}</span>
              </li>
              <li className="font-semibold text-base ps-4 mt-2 border-b border-gray-600">
                ID Information
              </li>

              <li className="flex gap-1.5 items-center">
                <FaRegAddressCard size={16} />
                <span className="mr-2">
                  {bookingInfo.identityProof.documentName + ":"}
                </span>
                <span>{bookingInfo.identityProof.documentNumber}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="md:col-span-5 px-8">
        <div className="mt-6 font-tabs font-bold text-lg border-b border-gray-600">
          Payment Details
        </div>
        <div className="overflow-hidden p-4 font-body text-sm">
          {Object.keys(bookingInfo).length > 0 && (
            <div className="grid md:grid-cols-2 gap-2">
              <ul className="col-span-1 flex flex-col gap-2.5">
                <li className="font-medium">
                  Payment Method:<span className="ml-2">online</span>
                </li>
                <li className="font-medium">
                  Payment Status:{" "}
                  <span
                    className={
                      bookingInfo.isPaid
                        ? "ml-2 text-green-600"
                        : "ml-2 text-red-600"
                    }
                  >
                    {bookingInfo.isPaid ? "payment success" : "payment failed"}
                  </span>
                </li>
                {bookingInfo.isPaid && (
                  <li className="font-medium">
                    Paid Amount:{" "}
                    <span className="ml-2 font-tabs font-medium text-lg">
                      {bookingInfo.paidAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </li>
                )}
              </ul>
              {bookingInfo.isPaid && (
                <ul className="flex flex-col gap-2.5">
                  <li className="font-medium">
                    Payment Date:
                    <span className="ml-2">
                      {new Date(bookingInfo.createdAt).toDateString()}
                    </span>
                  </li>
                  <li className="font-medium">
                    Payment Id:
                    <span className="ml-2">
                      {
                        bookingInfo.paymentInfo.razorpay_payment_id.split(
                          "_"
                        )[1]
                      }
                    </span>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-5 flex justify-center items-center font-body font-bold">
        <button
          onClick={() => history.back()}
          className="text-lg px-6 pt-1.5 pb-2 rounded focus:outline-none border border-blue-500 bg-white hover:bg-blue-500 hover:text-white transition-all"
        >
          back
        </button>
      </div>
    </div>
  );
};

export default ShowBookingDetails;
