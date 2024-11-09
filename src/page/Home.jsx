import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import Loading from "../components/loading";

export const Home = () => {
  const { ws, setIsAuthenticated } = useContext(RoomContext);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [user_id, setUserID] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const info = searchParams.get("info");
    const uuid = location.pathname.split("/").pop();
    if (info) {
      try {
        const decodedInfo = decodeURIComponent(atob(info));
        const parsedInfo = JSON.parse(decodedInfo);
        console.log(parsedInfo)
        if (parsedInfo.token) {
          localStorage.setItem("authToken", parsedInfo.token);
          setIsAuthenticated(true);
        }
        if (parsedInfo.group_id) {
          setSelectedItem(parsedInfo.group_id);
          setName(parsedInfo.name);
          setPhoneNumber(parsedInfo.phone_number);
          setUserID(parsedInfo.user_id);
          setStartDate(parsedInfo.startDate);
          setEndDate(parsedInfo.endDate);
          setToken(parsedInfo.token);
        }
      } catch (error) {
        console.error("Failed to parse info:", error);
      }
    } else if (uuid) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (
      name &&
      phoneNumber &&
      selectedItem &&
      user_id
    ) {
      setTimeout(() => {
        ws.emit("create-room", {
          name,
          phoneNumber,
          selectedItem,
          user_id,
          startDate,
          endDate,
          token
        });
      }, 3000);
    }
  }, [endDate, name, phoneNumber, selectedItem, startDate, token, user_id, ws]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <Loading />
    </div>
  );
};