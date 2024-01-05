import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest } from "../../utils/axios";
import { GiProfit } from "react-icons/gi";

const CardTwo = () => {
  const { authData } = useSelector((state) => state.admin);
  const [profit, setProfit] = useState(null);
  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/card/profit");
      if (data) {
        const value = (data.totalProfit / 1000).toFixed(2);
        setProfit(value + "K");
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <GiProfit className="text-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">Total Profit</span>
          <h4 className="text-lg font-bold text-black">&#x20B9; {profit}</h4>
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
