import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken } from "../../utils/axios";
import { GiProfit } from "react-icons/gi";

const CardTwo = () => {
  const { authData } = useSelector((state) => state.provider);
  const [totalProfit, setTotalProfit] = useState(null);
  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/provider/card/revenue");
      if (data) {
        const value = data.totalProfit / 1000;
        setTotalProfit(value + "K");
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <GiProfit className="fill-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex flex-wrap justify-between items-center ">
          <span className="text-sm font-medium flex-grow">Total Profit</span>
          <h4 className="text-lg font-bold text-black">
            &#x20B9; {totalProfit}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
