import React from "react";
import CardOne from "../../components/admin/CardOne";
import CardTwo from "../../components/admin/CardTwo";
import CardThree from "../../components/admin/CardThree";
import CardFour from "../../components/admin/CardFour";
import ChartOne from "../../components/admin/ChartOne";
import ChatCard from "../../components/admin/ChatCard";

const Dashboard = ({ socket }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
        <ChartOne />
        <ChatCard socket={socket} />
      </div>
    </>
  );
};

export default Dashboard;
