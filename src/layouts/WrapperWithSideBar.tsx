import SideBar from "@/components/navigation/sidebar/Sidebar";
import React from "react";

const WrapperWithSideBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="wrapper">
      <SideBar />
      {children}
    </div>
  );
};

export default WrapperWithSideBar;
