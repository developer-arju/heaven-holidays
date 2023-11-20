import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken, putRequest } from "../utils/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavouritePackage from "../components/favouritePackage";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import EmptyTemplate from "../components/EmptyTemplate";

const SavedBooking = () => {
  const { authData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [displayItem, setDisplayItem] = useState("packages");
  const [packages, setPackages] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/users/favourites/packages");
      if (data) {
        setPackages(data);
      }
      if (error) {
        console.log(error);
        toast.error(error.message);
      }
      setLoading(false);
    })();
  }, []);

  const removeHandler = async (id) => {
    setAccessToken(authData.token);
    const { data, error } = await putRequest("/users/favourites/remove", {
      packageId: id,
    });
    if (data) {
      setPackages(data.packages);
    }
    if (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative bg-bg-1/60 min-h-screen py-12 w-full">
      <Navbar />
      <main className="font-body">
        <div className="flex justify-center pt-2 font-semibold text-lg cursor-pointer">
          <h2
            onClick={() => setDisplayItem("packages")}
            className={
              displayItem === "packages"
                ? "flex-grow py-2 text-center border-r bg-bg-1   border-b border-gray-600"
                : "flex-grow py-2 text-center border-r bg-neutral-100 hover:bg-bg-1/40  border-b border-gray-600"
            }
          >
            Packages
          </h2>
          <h2
            onClick={() => setDisplayItem("rooms")}
            className={
              displayItem === "rooms"
                ? "flex-grow py-2 text-center border-r bg-bg-1  border-b border-gray-600"
                : "flex-grow py-2 text-center border-r bg-neutral-100 hover:bg-bg-1/40  border-b border-gray-600"
            }
          >
            Rooms & Resorts
          </h2>
        </div>
        <section className="text-gray-600 font-body mb-4">
          <h1 className="py-4 text-gray-400 font-medium font-title text-center text-[24px]">
            Favourites
          </h1>
          {loading ? (
            <div className="w-full h-64 flex justify-center items-center">
              <ClockLoader color="#36d7b7" size={100} />
            </div>
          ) : (
            <div className="container flex flex-wrap justify-center gap-4 py-6 mx-auto">
              {displayItem === "packages" && packages.length < 1 ? (
                <EmptyTemplate />
              ) : (
                packages?.map((doc) => (
                  <FavouritePackage
                    key={doc._id}
                    doc={doc}
                    removeHandler={removeHandler}
                  />
                ))
              )}
              {/* {displayItem === "rooms" && } */}
            </div>
          )}
        </section>
      </main>
      <div className="absolute left-0 right-0 bottom-0 bg-bg-1">
        <Footer />
      </div>
    </div>
  );
};

export default SavedBooking;
