import { useState, useEffect, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import {
  RiCloseCircleFill,
  RiDownload2Fill,
  RiDeleteBin6Fill,
  RiShareForwardFill,
} from "react-icons/ri";

export default function Files() {
  const { logout } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [path, setPath] = useState("uploads");
  const [showUpload, setShowUpload] = useState(false);
  const [shareEmails, setShareEmails] = useState({});
  const notyf = new Notyf();

  const fetchFiles = async () => {
    try {
      const res = await api.get("/file?limit=10");
      const filesData = Array.isArray(res.data)
        ? res.data
        : res.data.files || [];

      setFiles(filesData);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      if (err.response?.status === 401) logout();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return notyf.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    formData.append("metadata", JSON.stringify({ path }));

    try {
      const res = await api.post("/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notyf.success("File uploaded!");
      setFile(null);
      setPath("uploads");
      setShowUpload(false);
      setFiles((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      notyf.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id, public_id) => {
    try {
      await api.delete(`/file?id=${id}&public_id=${public_id}`);
      notyf.success("File deleted!");
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      notyf.error("Delete failed");
    }
  };

  const handleEmailChange = (id, value) => {
    setShareEmails((prev) => ({ ...prev, [id]: value }));
  };

  const handleDownload = async (f) => {
    try {
      const fileUrl = f.file_url
        ? f.file_url
        : `https://res.cloudinary.com/dypmdlj4o/${f.public_id}`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", f.filename || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
      notyf.error("Download failed");
    }
  };

  const handleShare = async (f) => {
    const email = shareEmails[f._id] || "";
    if (!email) return notyf.error("Enter email to share with");

    try {
      await api.post("/share", {
        email,
        file_url:
          f.file_url ||
          `https://res.cloudinary.com/dypmdlj4o/${f.public_id}`,
        fileId: f._id,
      });
      notyf.success(`Shared with ${email}`);
      setShareEmails((prev) => ({ ...prev, [f._id]: "" }));
    } catch (err) {
      console.error("Share error:", err.response?.data || err);
      notyf.error("Share failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Files</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          + Add File
        </button>
      </div>

      {/* ✅ Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border rounded overflow-hidden min-w-[600px]">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-2 text-left">Filename</th>
              <th className="p-2">Type</th>
              <th className="p-2">Size</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {f.filename || f.file_url?.split("/").pop()}
                </td>
                <td className="p-2">{f.type}</td>
                <td className="p-2">{(f.size / 1024).toFixed(2)} KB</td>
                <td className="p-2 flex gap-3 items-center">
                  <button
                    onClick={() => handleDownload(f)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <RiDownload2Fill size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(f._id, f.public_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <RiDeleteBin6Fill size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={shareEmails[f._id] || ""}
                      onChange={(e) =>
                        handleEmailChange(f._id, e.target.value)
                      }
                      className="border rounded p-1 text-sm"
                    />
                    <button
                      onClick={() => handleShare(f)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <RiShareForwardFill size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card Layout */}
      <div className="sm:hidden space-y-4">
        {files.map((f) => (
          <div
            key={f._id}
            className="border rounded-lg p-4 shadow-sm flex flex-col gap-2"
          >
            <p className="text-sm">
              <span className="font-semibold">Filename:</span>{" "}
              {f.filename || f.file_url?.split("/").pop()}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Type:</span> {f.type}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Size:</span>{" "}
              {(f.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex gap-3 items-center mt-2">
              <button
                onClick={() => handleDownload(f)}
                className="text-blue-600 hover:text-blue-800"
              >
                <RiDownload2Fill size={22} />
              </button>
              <button
                onClick={() => handleDelete(f._id, f.public_id)}
                className="text-red-600 hover:text-red-800"
              >
                <RiDeleteBin6Fill size={22} />
              </button>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="email"
                  placeholder="Email"
                  value={shareEmails[f._id] || ""}
                  onChange={(e) => handleEmailChange(f._id, e.target.value)}
                  className="border rounded p-1 text-sm flex-1"
                />
                <button
                  onClick={() => handleShare(f)}
                  className="text-green-600 hover:text-green-800"
                >
                  <RiShareForwardFill size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-center text-gray-500">No files found</p>
        )}
      </div>

      {showUpload && (
        <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg p-6 animate__animated animate__fadeInRight">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Upload a new file</h2>
            <button
              onClick={() => setShowUpload(false)}
              className="text-black hover:text-red-600"
            >
              <RiCloseCircleFill className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Folder</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose File
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
            >
              Upload Now
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
}
