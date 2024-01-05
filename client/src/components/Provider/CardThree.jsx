import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken } from "../../utils/axios";
import { TbPackages } from "react-icons/tb";

const CardThree = () => {
  const { authData } = useSelector((state) => state.provider);
  const [activePkgCount, setActivePkgCount] = useState(null);
  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest(
        "/provider/card/active-packages"
      );
      if (data) {
        setActivePkgCount(data.activeCount);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <TbPackages className="text-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex flex-wrap justify-between items-center">
          <span className="text-sm font-medium">Active Packages</span>
          <h4 className="text-lg font-bold text-black">{activePkgCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default CardThree;
