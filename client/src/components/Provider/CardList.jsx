import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest } from "../../utils/axios";

const CardList = () => {
  const { authData } = useSelector((state) => state.provider);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/provider/bookings/recent");
      if (data) {
        setRecentBookings(data);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  });
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7 shadow-default xl:col-span-4">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-black">Recent Bookings</h4>
      </div>

      <div className="flex flex-col gap-2.5 h-[340px] overflow-y-auto invisible-scrollbar">
        {recentBookings.length > 0 &&
          recentBookings.map((booking, index) => {
            const bookingDate = new Date(booking?.startDate);

            return (
              <div
                key={booking._id}
                className="font-body px-2 py-1 rounded shadow-4"
              >
                <h2 className="text-[14px] font-bold">
                  {booking?.package[0].packageName}
                </h2>
                <p className="text-[12px] font-medium text-gray-500 first-letter:uppercase">
                  {booking?.identityProof?.title +
                    " " +
                    booking?.identityProof?.name}
                </p>
                <div className="font-tabs flex justify-between items-center mt-2">
                  <p className="text-[14px] font-semibold text-orange-500">
                    {booking?.paidAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                  <p className="text-[12px]  font-medium text-gray-500">
                    {bookingDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CardList;
