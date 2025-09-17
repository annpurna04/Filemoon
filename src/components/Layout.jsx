import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { api } from "../api";
import {
  RiLogoutCircleRLine,
  RiMenuLine,
  RiAppsLine,
  RiFileLine,
  RiHistoryLine,
} from "react-icons/ri";

export default function Layout({ children }) {
  const { logout, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Sidebar defaults
  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  // Fetch Profile Picture (optional)
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!token) return;

      try {
        const res = await api.get("/profile-picture", {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        const imageUrl = URL.createObjectURL(res.data);
        setProfilePic(imageUrl);
      } catch (err) {
        console.error("Error fetching profile picture:", err.response?.data || err);
      }
    };

    fetchProfilePic();
  }, [token]);

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-cyan-500 to-blue-500 text-white flex flex-col p-6 space-y-6 transform transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col items-center">
          <img
            src={profilePic || "/avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover mb-2"
          />
          <h1 className="capitalize text-lg font-semibold">
            {user?.name || "Guest User"}
          </h1>
          <p className="text-sm">{user?.email || "user@email.com"}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <Link to="/dashboard">
            <button className="w-full bg-rose-400 py-2.5 rounded hover:bg-rose-600 flex items-center justify-center gap-2">
              <RiAppsLine className="text-lg" />
              <span>Dashboard</span>
            </button>
          </Link>

          <Link to="/files">
            <button className="w-full bg-rose-400 py-2.5 rounded hover:bg-rose-600 flex items-center justify-center gap-2">
              <RiFileLine className="text-lg" />
              <span>My Files</span>
            </button>
          </Link>

          <Link to="/history">
            <button className="w-full bg-rose-400 py-2.5 rounded hover:bg-rose-600 flex items-center justify-center gap-2">
              <RiHistoryLine className="text-lg" />
              <span>History</span>
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-rose-400 py-2.5 rounded hover:bg-rose-600 flex items-center justify-center gap-2"
          >
            <RiLogoutCircleRLine className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Section */}
      <section
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <nav className="bg-white px-6 py-4 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="ri-contrast-2-fill text-3xl text-violet-700"></i>
            <h1 className="text-xl md:text-2xl font-semibold">Filemoon</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow"
              title="Logout"
            >
              <RiLogoutCircleRLine size={22} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow"
              title="Toggle Sidebar"
            >
              <RiMenuLine size={22} />
            </button>
          </div>
        </nav>

        <main className="p-4 md:p-6 flex-1 overflow-y-auto">{children}</main>
      </section>
    </div>
  );
}
