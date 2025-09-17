import { useEffect, useState, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import Layout from "../components/Layout";

export default function History() {
  const { token, logout } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/share");
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (!token) {
      logout();
      return;
    }
    fetchHistory();
  }, [token]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">History</h1>

        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-2 text-left">Filename</th>
              <th className="p-2">Email</th>
              <th className="p-2">Datetime</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {h.file?.filename || "Unknown file"}
                </td>


                <td className="p-2">{h.receiverEmail}</td>
                <td className="p-2">{moment(h.createdAt).format("LLL")}</td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
