import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, setAccessToken, putRequest } from "../utils/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavouritePackage from "../components/FavouritePackage";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import EmptyTemplate from "../components/EmptyTemplate";

const SavedBooking = () => {
  const { authData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAccessToken(authData.token);
      const { data, error } = await getRequest("/users/favourites/packages");
      setLoading(false);
      if (data) {
        setPackages(data);
      }
      if (error) {
        console.log(error);
        toast.error(error.message);
      }
    })();
  }, []);

  const removeHandler = async (id) => {
    setAccessToken(authData.token);
    const { data, error } = await putRequest("/users/favourites/remove", {
      packageId: id,
    });
    if (data) {
      setPackages((prev) => prev.filter((obj) => obj._id !== id));
    }
    if (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative bg-bg-1/60 min-h-screen py-12 w-full">
      <Navbar />
      <main className="font-body">
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
              {packages.length < 1 ? (
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
