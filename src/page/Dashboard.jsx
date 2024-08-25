import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { PhoneIcon } from "../../public/Phone";
import { CloseIcon } from "../../public/Close";

export const Dashboard = () => {
  const { ws } = useContext(RoomContext);
  const [callRequests, setCallRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ws.emit("get-call-requests", (data) => {
      setCallRequests(data);
    });
    ws.on("new-call-request", (newRequest) => {
      setCallRequests((prevRequests) => [...prevRequests, newRequest]);
    });
    return () => {
      ws.off("new-call-request");
    };
  }, [ws]);

  const handleCall = (request) => {
    navigate(`/room/${request.id}`);
  };

  const handleDelete = (requestId) => {
    setCallRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
    ws.emit("delete-call-request", requestId);
  };

  return (
    <div className="min-h-screen bg-[#202124] text-white p-4" style={{ direction: "rtl" }}>
      <div className="w-full max-w-7xl shadow-md rounded p-4 mt-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-right">داشبورد تماس‌ها</h1>
        {callRequests.length === 0 ? (
          <p className="text-center">درخواستی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-2 py-2 text-right">#</th>
                  <th className="px-4 py-2 text-center">نام</th>
                  <th className="px-4 py-2 text-center">شماره تماس</th>
                  <th className="px-4 py-2 text-center">لینک</th>
                  <th className="px-4 py-2 text-center">تاریخ ایجاد</th>
                  <th className="px-4 py-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900">
                {callRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2 text-right">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {request.name}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {request.phoneNumber}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {request.id}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(request.timestamp).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="flex justify-center items-center gap-5 py-4">
                      <button
                        onClick={() => handleCall(request)}
                        className="cursor-pointer flex justify-center items-center text-white bg-green-600 rounded-full w-7 h-7 hover:bg-green-700"
                      >
                        <PhoneIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full w-7 h-7 hover:bg-red-700"
                      >
                        <CloseIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
