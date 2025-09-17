import { useEffect, useContext, useState } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { token, logout, user } = useContext(AuthContext);
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentShared, setRecentShared] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const filesRes = await api.get("/dashboard");
        setRecentFiles(filesRes.data || []);

        const sharedRes = await api.get("/share");
        setRecentShared(sharedRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-gray-600">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        {/* Welcome */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Welcome {user?.fullname || "Guest"}
        </h1>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Files */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Recent Files</h2>
            <hr />
            <ul className="mt-2 space-y-2">
              {recentFiles.length > 0 ? (
                recentFiles.slice(0, 5).map((f, i) => (
                  <li
                    key={i}
                    className="p-2 border rounded hover:bg-gray-50 flex justify-between items-center text-sm sm:text-base"
                  >
                    <span className="truncate max-w-[60%]">{f.filename || f._id}</span>
                    <span className="font-semibold whitespace-nowrap">
                      {f.size ? (f.size / 1024).toFixed(1) + " KB" : f.total}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No recent files</li>
              )}
            </ul>
          </div>

          {/* Recent Shared */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Recent Shared</h2>
            <hr />
            <ul className="mt-2 space-y-2">
              {recentShared.length > 0 ? (
                recentShared.slice(0, 5).map((s, i) => (
                  <li
                    key={i}
                    className="p-2 border rounded hover:bg-gray-50 flex items-center gap-3 text-sm sm:text-base"
                  >
                    {s.file?.type?.startsWith("image/") ? (
                      <img
                        src={s.file.url}
                        alt={s.file.filename}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-600">
                        File
                      </div>
                    )}
                    <span className="truncate">{s.file?.filename || "Unknown file"}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No recent shares</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
