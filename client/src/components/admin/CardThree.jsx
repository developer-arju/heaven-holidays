import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest } from "../../utils/axios";
import { FaPeopleGroup } from "react-icons/fa6";

const CardThree = () => {
  const { authData } = useSelector((state) => state.admin);
  const [sellersCount, setSellersCount] = useState(null);

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/card/provider-count");
      if (data) {
        setSellersCount(data.providerCount);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <FaPeopleGroup className="text-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">Active Sellers</span>
          <h4 className="text-lg font-bold text-black">{sellersCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default CardThree;
