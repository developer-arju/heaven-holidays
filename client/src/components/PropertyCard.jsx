import React, { useEffect } from "react";
import { ImWhatsapp } from "react-icons/im";
import { Link } from "react-router-dom";

const PropertyCard = ({ doc }) => {
  // useEffect(() => {
  //   if ("launchApp" in navigator && navigator.launchApp) {
  //     console.log("dialer is in");
  //   } else {
  //     console.log("dialer is not");
  //   }
  // });

  console.log(doc);
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src="src/assets/munnar/munnar_landscape(1).jpg"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-2">
        <div className="font-bold text-xl mb-1">{doc.propertyName}</div>
        <p className="text-gray-700 text-base">{doc.propertyLocation}</p>
      </div>
      <div className="px-6 pb-4">
        <span className="font-body text-xs font-medium text-gray-600">
          property owner -
        </span>
        <span className="font-body text-sm font-medium text-green-600 ml-1">
          {doc.providerId.brandName}
        </span>
        <div className="flex justify-between pt-2.5">
          <p>price starts from ₹ 1,000</p>
          <Link
            to={`https://wa.me/91${doc?.providerId.bussinessPhone}`}
            target="_blank"
          >
            <ImWhatsapp color="green" size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
