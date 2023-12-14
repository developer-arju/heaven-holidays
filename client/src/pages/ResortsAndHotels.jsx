import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getRequest } from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import { HashLoader } from "react-spinners";
import PropertyCard from "../components/PropertyCard";

const ResortsAndHotels = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error, message } = await getRequest("/users/properties");
      if (data) {
        setProperties(data);
      }
      if (error) {
        console.log(error);
        toast.error(error.message || message);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen relative bg-bg-1/60">
      <Navbar />
      <ToastContainer />

      <main className="absolute w-full h-full bg-inherit py-24">
        {loading ? (
          <div className="flex justify-center items-center h-[480px]">
            <HashLoader color="#36d7b7" size={80} />
          </div>
        ) : (
          <div className="grid px-2 sm:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center">
            {properties.length > 1 ? (
              properties.map((doc) => {
                return <PropertyCard doc={doc} key={doc._id} />;
              })
            ) : (
              <div>Data not found</div>
            )}
          </div>
        )}
      </main>
      <div className="absolute left-0 right-0 bottom-0 bg-bg-1">
        <Footer />
      </div>
    </div>
  );
};

export default ResortsAndHotels;
