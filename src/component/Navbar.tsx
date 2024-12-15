import { FaChartBar, FaHome, FaUser, FaUsers, FaClipboardList } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isReportsExpanded, setIsReportsExpanded] = useState(false);

  const toggleReports = () => setIsReportsExpanded((prev) => !prev);

  const path = [
    { name: "Home", pathname: "/", icon: <FaHome className="mr-3" /> },
    { name: "Attendance", pathname: "/attendance", icon: <FaUsers className="mr-3" /> },
    { name: "Membership", pathname: "/membership", icon: <FaUser className="mr-3" /> },
    { name: "New Soul", pathname: "/newSoul", icon: <FaUser className="mr-3" /> },
    { name: "Finances", pathname: "/finances", icon: <FaChartBar className="mr-3" /> },
  ];

  return (
    <nav className="mt-4 space-y-2">
      {/* Static Links */}
      {path.map((nav) => (
        <Link
          key={nav.name}
          to={nav.pathname}
          className={`md:rounded-md block md:flex md:items-center py-2.5 md:px-4 ${
            nav.pathname === location.pathname ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          {nav.icon}
          {nav.name}
        </Link>
      ))}

      {/* Reports Dropdown */}
      <div>
        <button
          onClick={toggleReports}
          className="w-full flex items-center py-2.5 px-4 hover:bg-gray-700 rounded-md focus:outline-none"
        >
          <FaClipboardList className="mr-3" />
          Reports
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-auto h-4 w-4 transform ${isReportsExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isReportsExpanded && (
          <div className="ml-8 mt-2 space-y-1">
            <Link
              to="/reports/service"
              className={`block py-2 px-4 ${
                location.pathname === "/reports/service" ? "bg-gray-700" : "hover:bg-gray-700"
              } rounded-md`}
            >
              Service Report
            </Link>
            <Link
              to="/reports/monthly"
              className={`block py-2 px-4 ${
                location.pathname === "/reports/monthly" ? "bg-gray-700" : "hover:bg-gray-700"
              } rounded-md`}
            >
              Monthly Report
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
