import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../utils/axios";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

const Banner = () => {
  const [bannerPackages, setBannerPackages] = useState(null);
  const [activePackage, setActivePackage] = useState(null);
  useEffect(() => {
    (async () => {
      const { data, error } = await getRequest("/users/banners");
      if (data) {
        setBannerPackages(data);
        setActivePackage(data[0]);
      }
      if (error) {
        console.log(error);
      }
    })();
  }, []);

  const nextHandler = (e) => {
    e.stopPropagation();
    const currIdx = bannerPackages.findIndex(
      (doc) => doc._id === activePackage._id
    );
    const lastIdx = bannerPackages.length - 1;
    if (currIdx < lastIdx) {
      setActivePackage(bannerPackages[currIdx + 1]);
    } else {
      setActivePackage(bannerPackages[0]);
    }
  };

  const prevHandler = (e) => {
    e.stopPropagation();
    const currIdx = bannerPackages.findIndex(
      (doc) => doc._id === activePackage._id
    );
    const lastIdx = bannerPackages.length - 1;
    if (currIdx > 0) {
      setActivePackage(bannerPackages[currIdx - 1]);
    } else {
      setActivePackage(bannerPackages[lastIdx]);
    }
  };

  return (
    <div
      className="relative banner mt-6 px-12 py-6"
      style={{ minHeight: "360px" }}
    >
      <div className="absolute top-0 left-2 right-2 md:right-10 md:left-10 bottom-0 h-full overflow-hidden rounded-2xl -z-10">
        <img
          src={
            activePackage &&
            `http://localhost:8000/${activePackage.coverImage[0]}`
          }
          className="object-cover w-full h-full shadow-inner"
          alt=""
        />
      </div>
      <h2 className="absolute text-center text-clip top-4 left-1/2 -translate-x-1/2 font-tabs font-bold text-2xl text-white px-4 py-1 rounded-lg drop-shadow-md bg-black/60">
        Best Value Packages
      </h2>
      <div
        onClick={prevHandler}
        className="absolute top-1/2 left-4 md:left-14 p-3 -translate-y-1/2 text-white/60 rounded-full bg-transparent/60 cursor-pointer"
      >
        <AiOutlineCaretLeft className="mx-auto" />
      </div>
      <div
        onClick={nextHandler}
        className="absolute top-1/2 right-4 md:right-14 p-3 -translate-y-1/2 text-white/60 rounded-full bg-transparent/60 cursor-pointer"
      >
        <AiOutlineCaretRight className="mx-auto" />
      </div>

      <div className="flex flex-wrap justify-between items-end gap-4 mx-8 md:mx-16 p-6 mt-36 md:mt-56 bg-black/40 rounded-xl ring-2 ring-white/40 hover:bg-black/80">
        <div className="flex-grow flex-shrink font-body w-full text-white max-w-2xl">
          <p className="text-lg md:text-3xl font-bold mb-2">
            {activePackage?.packageName}
          </p>
          <p className="mb-2 text-xs">{activePackage?.summary}</p>
          <p>
            {activePackage &&
              `${activePackage.dayCount} Day ${
                activePackage.nightCount > 0
                  ? `${activePackage.nightCount} Night`
                  : ""
              }`}
            <br />
            <span className="font-extrabold font-sans tracking-tight text-green-500 text-2xl">
              {activePackage?.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          </p>
        </div>
        <div className="font-body text-base text-blue-800 font-bold">
          <Link
            to={`/packages/details/${activePackage?._id}`}
            className="animate-rotate px-6 py-2 bg-white/60 rounded-full hover:bg-white/80 hover:shadow-md transition-all duration-300 shadow-lg"
          >
            more details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
