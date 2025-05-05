import Footer from "@/components/Footer";
import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
