import { useContext, useState } from "react";
import { CloseIcon } from "../../../public/Close";
import { SendIcon } from "../../../public/SendIcon";
import PropTypes from "prop-types";
import { RoomContext } from "../../context/RoomContext";

function ChatSidebar({ openModal, handleButton }) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(RoomContext);
  const handelSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("")
  };
  return (
    <div
      className={`fixed top-0 right-0 w-96 h-[90%] rounded-xl bg-white my-6 text-black transform ${
        openModal ? "-translate-x-3" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <button
        className="text-black p-4 flex w-full justify-end"
        onClick={handleButton}
      >
        <CloseIcon />
      </button>
      <div className="flex flex-col h-[90%] p-4">
        <div className="flex-1 overflow-y-auto">
          {/* {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg ${
                index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
              }`}
            >
              {message}
            </div>
          ))} */}
        </div>
        <form
          onSubmit={handelSubmit}
          className="flex items-center border rounded-3xl p-2 bg-[#F1F3F4]"
        >
          <button className="p-2 ml-2 text-white rounded-lg">
            <SendIcon />
          </button>
          <input
            type="text"
            className="flex-1 p-2 focus:outline-none text-black bg-[#F1F3F4] "
            style={{ direction: "rtl" }}
            placeholder="نوشتن پیام ....."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}
ChatSidebar.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleButton: PropTypes.func.isRequired,
};
export default ChatSidebar;
