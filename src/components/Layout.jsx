import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h2>레이아웃</h2>
      <Outlet />
    </>
  );
};

export default Layout;
