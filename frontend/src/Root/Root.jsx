import { Outlet } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function Root() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-50 antialiased bg-white">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
export default Root;