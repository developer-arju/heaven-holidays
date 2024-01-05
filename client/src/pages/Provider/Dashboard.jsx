import React from "react";
import CardOne from "../../components/Provider/CardOne";
import CardTwo from "../../components/Provider/CardTwo";
import CardThree from "../../components/Provider/CardThree";
import CardFour from "../../components/Provider/CardFour";
import ChartOne from "../../components/Provider/ChartOne";
import CardList from "../../components/Provider/CardList";

const Dashboard = () => {
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
        <CardList />
      </div>
    </>
  );
};

export default Dashboard;
