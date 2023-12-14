import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BreadCrumb from "../Provider/BreadCrumb";
import { ToastContainer } from "react-toastify";

const PrivateRoutes = ({ socket }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authData } = useSelector((state) => state.admin);

  useEffect(() => {
    (async () => {
      if (Object.keys(authData).length > 0) {
        await socket.emit("admin-connect", true);
      } else {
        await socket.emit("admin-connect", false);
      }
    })();
  }, []);

  return Object.keys(authData).length > 0 ? (
    <div className="">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <BreadCrumb />
            <ToastContainer />
            <div className="relative mx-auto max-w-screen-2xl p-4 md:p-4 2xl:p-8">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  ) : (
    <Navigate to="/admin/auth" />
  );
};

export default PrivateRoutes;
