"use client";
import { useEffect, useState } from "react";

export default function JobSystemHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/imports/history")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch import history");
        return res.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium">
        Loading import history...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-indigo-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 items-center">
          📊 Import History Dashboard
        </h1>
        <p className="text-gray-500 mb-6">
          Track all job imports from external feeds
        </p>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-950 text-white text-sm uppercase tracking-wide">
                <th className="px-4 py-3 text-left">File Name</th>
                 <th className="px-4 py-3 text-left">Imported Date&Time</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">New</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Failed</th>
               
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500 italic"
                  >
                    No import history found
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 break-all max-w-xs">
                      {log.fileName}
                    </td>
                     <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {log.totalFetched}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {log.newJobs}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {log.updatedJobs}
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-600">
                      {log.failedJobs?.length || 0}
                    </td>
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
