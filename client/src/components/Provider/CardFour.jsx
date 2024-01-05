import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken } from "../../utils/axios";
import { SiHomeadvisor } from "react-icons/si";

const CardFour = () => {
  const { authData } = useSelector((state) => state.provider);
  const [propertyCount, setPropertyCount] = useState(null);
  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/provider/card/property-count");
      if (data) {
        setPropertyCount(data.propertyCount);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <SiHomeadvisor className="text-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex justify-between items-center flex-wrap">
          <span className="text-sm font-medium">Total Properties</span>
          <h4 className="text-lg font-bold text-black">{propertyCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default CardFour;
