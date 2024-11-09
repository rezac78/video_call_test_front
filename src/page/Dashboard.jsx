import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { PhoneIcon } from "../../public/Phone";
import { CloseIcon } from "../../public/Close";
import { SOCKET_URL } from "../config-global";
import axios from "axios";

export const Dashboard = () => {
  const { ws } = useContext(RoomContext);
  const [callRequests, setCallRequests] = useState([]);
  const [activeCalls, setActiveCalls] = useState([]);
  const [missedCalls, setMissedCalls] = useState([]);
  const [allCalls, setAllCalls] = useState([]);
  const [timeTotal, setTimeTotal] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const info = searchParams.get("info");
    if (info) {
      try {
        const decodedInfo = decodeURIComponent(atob(info));
        const parsedInfo = JSON.parse(decodedInfo);
        if (parsedInfo.token) {
          localStorage.setItem("authToken", parsedInfo.token);
        }
      } catch (error) {
        console.error("Failed to parse info:", error);
      }
    }
  }, []);
  useEffect(() => {
    ws.emit("get-call-requests", (data) => {
      setCallRequests(data);
    });
    ws.on("new-call-request", (newRequest) => {
      setCallRequests((prevRequests) => [...prevRequests, newRequest]);
    });
    ws.on("call-request-expired", ({ roomId }) => {
      setCallRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== roomId)
      );
    });
    const fetchCallStats = async () => {
      try {
        const response = await axios.get(SOCKET_URL + "/api/call-requests");
        const Data = response.data.data;
        setAllCalls(Data);
        const missedCallsCount = Data.filter((e) => !e.isAnswered).length;
        const activeCallsCount = Data.filter((e) => !e.isActive).length;
        const timeCount = Math.ceil(
          Data.reduce((total, e) => total + e.duration, 0) / 60
        );
        setMissedCalls(missedCallsCount);
        setActiveCalls(activeCallsCount);
        setTimeTotal(timeCount);
      } catch (error) {
        console.error("Error fetching call stats:", error);
      }
    };
    fetchCallStats();
    return () => {
      ws.off("new-call-request");
      ws.off("call-request-expired");
    };
  }, [ws]);

  const handleCall = (request) => {
    navigate(`/room/${request.id}`, { state: "ادمین" });
  };

  const handleDelete = (requestId) => {
    setCallRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
    ws.emit("delete-call-request", requestId);
  };
  const cards = [
    {
      color: "#A9DED7",
      description: `${allCalls.length || 0} تماس`,
      title: "کل تماس ها",
      imgIcon: "/CallWite.svg",
    },
    {
      color: "#E6D7A3",
      description: `${activeCalls || 0} نفر`,
      title: "در حال مکالمه",
      imgIcon: "/History.svg",
    },
    {
      color: "#C4A9E1",
      description: `${timeTotal || 0} دقیقه`,
      title: "زمان کل مکالمات",
      imgIcon: "/Phone.svg",
    },
    {
      color: "#D69999",
      description: `${missedCalls || 0} تماس`,
      title: "تماس از دست رفته",
      imgIcon: "/Time.svg",
    },
  ];
  return (
    <div
      className="min-h-screen bg-[#202124] text-white p-4"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-wrap items-center my-6 gap-9 px-6 sm:px-20">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-grow p-6 rounded-md flex"
            style={{ backgroundColor: card.color }}
          >
            <div>
              <img src={card.imgIcon} alt="notFound" />
              <div className="text-2xl mt-6">{card.title}</div>
            </div>

            <div className="text-lg mr-auto flex items-center">
              {card.description}
            </div>
          </div>
        ))}
      </div>

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
                  <th className="px-4 py-2 text-center">گروه</th>
                  <th className="px-4 py-2 text-center">تاریخ ایجاد</th>
                  <th className="px-4 py-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="bg-gray-900">
                {callRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2 text-right">{index + 1}</td>
                    <td className="px-4 py-2 text-center">{request.name}</td>
                    <td className="px-4 py-2 text-center">
                      {request.phoneNumber}
                    </td>
                    <td className="px-4 py-2 text-center">{request.id}</td>
                    <td className="px-4 py-2 text-center">
                      {request.selectedItem}
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