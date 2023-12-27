import React from "react";
import { Link } from "react-router-dom";
import { IoMdRemoveCircle } from "react-icons/io";

const FavouritePackage = ({ doc, removeHandler }) => {
  return (
    <div className="flex flex-wrap">
      <div className="w-full bg-neutral-50 rounded border border-bg-1">
        <a className="block relative h-44 aspect-video rounded overflow-hidden">
          <span
            onClick={() => removeHandler(doc?._id)}
            className="absolute right-1 top-1 bg-white rounded-full shadow-2xl cursor-pointer"
          >
            <IoMdRemoveCircle className="text-red-600 mx-auto text-[24px]" />
          </span>
          <img
            alt="ecommerce"
            className="object-cover object-center w-full h-full block"
            src={`https://holidays.digimartshopy.shop/${doc?.coverImage[0]}`}
          />
        </a>
        <div className="mt-4 px-4 pb-4">
          <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
            {doc?.provider.brandName}
          </h3>
          <h2 className="text-gray-900 title-font text-lg font-medium">
            {doc?.packageName}
          </h2>
          <p className="mt-1 font-sans font-bold flex justify-between">
            {doc?.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
            <Link
              to={`/packages/details/${doc?._id}`}
              className="px-5 py-2 rounded bg-green-600 shadow-lg text-white cursor-pointer"
            >
              See Info
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavouritePackage;
