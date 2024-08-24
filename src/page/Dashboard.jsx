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
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4 text-right">داشبورد تماس‌ها</h1>
        {callRequests.length === 0 ? (
          <p className="text-center">درخواستی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center">نام</th>
                  <th className="px-4 py-2 text-center">شماره تماس</th>
                  <th className="px-4 py-2 text-center">لینک</th>
                  <th className="px-4 py-2 text-center">تاریخ ایجاد</th>
                  <th className="px-4 py-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {callRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-center">
                      {request.name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {request.phoneNumber}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {request.id}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Date(request.timestamp).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="border px-4 py-2 flex justify-center space-x-2">
                      <button
                        onClick={() => handleCall(request)}
                        className="bg-blue-500 text-white px-2 py-2 rounded-full"
                      >
                        <PhoneIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="bg-red-500 text-white px-2 py-2 rounded-full"
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
