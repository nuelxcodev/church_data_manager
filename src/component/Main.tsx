import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState } from "react";
import {
  FaPowerOff,
} from "react-icons/fa";
import MonthlyReport from "./Report";
import Analysis from "./Analysis";
import MemberShipData from "./MemberShipData";
import ServicesReport from "./ServicesReport";
import NewConvert from "./Newcovert";

import Navbar from "./Navbar";
import { useAuth } from "../../utils/userscontextthook";
import Homepage from "./Home";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const { logout } = useAuth();

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[20%] bg-gray-800 text-white relative">
          <div className="p-4 text-center font-bold text-xl border-b border-gray-700">
            KGIC Dashboard
          </div>
          <Navbar

          />
          <div className="absolute bottom-0 right-0">
            <button
              className="flex items-center gap-3 m-3 p-2 bg-yellow-300 text-black"
              onClick={() => logout()}
            >
              <FaPowerOff />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Top Navigation */}
          <header className="lg:hidden bg-gray-800 text-white flex justify-between items-center px-4 py-3">
            <div className="font-bold text-lg">KGIC Dashboard</div>
            <button
              onClick={toggleMenu}
              className="text-gray-400 focus:outline-none focus:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </header>
          {isMenuOpen && (
            <nav className="lg:hidden bg-gray-800 text-white space-y-2 px-4 py-3">
              <Navbar

              />
            </nav>
          )}

          {/* Dashboard Content */}
          <main className="flex-1 bg-neutral-200 overflow-y-scroll scrollbar-hide">
            <Routes>
              <Route
                path="/"
                element={
                  <Homepage />
                }
              />
              <Route
                path="/reports/service"
                element={<ServicesReport />}
              />
              <Route
                path="/reports/monthly"
                element={<MonthlyReport />}
              />
              <Route
                path="/newsoul"
                element={<NewConvert />}
              />
              <Route
                path="/finances"
                element={<Analysis />}
              />
              <Route
                path="/membership"
                element={<MemberShipData />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
