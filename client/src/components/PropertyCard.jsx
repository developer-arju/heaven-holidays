import React, { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { ImWhatsapp } from "react-icons/im";
import { Link } from "react-router-dom";

const TOOLTIP_STYLE = {
  paddingLeft: "4px",
  paddingRight: "4px",
  paddingTop: "2px",
  paddingBottom: "2px",
  fontSize: "12px",
  backgroundColor: "#616161",
};

const PropertyCard = ({ doc }) => {
  const sortedPlanPrice = doc.priceOptions.sort(
    (a, b) => a.planPrice - b.planPrice
  );

  console.log(doc);
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full h-48"
        src={`https://holidays.digimartshopy.shop/${doc?.propertyImages[0]}`}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-2 bg-gradient-to-r from-neutral-200 via-neutral-400 to-gray-500 shadow-inner">
        <div className="font-bold text-xl text-red-600">{doc.propertyName}</div>
        <p className="text-black text-base">
          <span className="text-neutral-600 mr-1">Location:</span>
          {doc.propertyLocation}
        </p>
      </div>
      <div className="px-6 pb-4">
        <span className="font-body text-xs font-medium text-gray-600">
          property owner -
        </span>
        <span className="font-body text-sm font-medium text-green-600 ml-1">
          {doc.providerId.brandName}
        </span>
        <div className="flex justify-between items-center">
          <p className="font-body font-medium text-xs text-neutral-600">
            price starts from
            <span className="ml-2 font-sans text-lg">
              &#x20B9;{" "}
              {sortedPlanPrice[0].planPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </p>
          <Link
            to={`https://wa.me/91${doc?.providerId.bussinessPhone}`}
            target="_blank"
          >
            <ImWhatsapp
              data-tooltip-id="whatsapp"
              data-tooltip-content="chat via whatsapp"
              color="green"
              className="focus:outline-none"
              size={30}
            />
            <Tooltip style={TOOLTIP_STYLE} place="bottom" id="whatsapp" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
