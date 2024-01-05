import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest } from "../../utils/axios";
import { IoMdPeople } from "react-icons/io";

const CardFour = () => {
  const { authData } = useSelector((state) => state.admin);
  const [usersCount, setUsersCount] = useState(null);
  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/admin/card/users-count");
      if (data) {
        console.log(data);
        setUsersCount(data.usersCount);
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        <IoMdPeople className="text-primary" size={22} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">Active Users</span>
          <h4 className="text-lg font-bold text-black">{usersCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default CardFour;
