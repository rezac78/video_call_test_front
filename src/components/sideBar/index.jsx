import { useContext, useState } from "react";
import { CloseIcon } from "../../../public/Close";
import { SendIcon } from "../../../public/SendIcon";
import PropTypes from "prop-types";
import { RoomContext } from "../../context/RoomContext";
import ShowChat from "../showChat";

function ChatSidebar({ openModal, handleButton, userName, admin }) {
  const [message, setMessage] = useState("");
  const { sendMessage, chat, me } = useContext(RoomContext);
  const handelSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return;
    }
    sendMessage(message);
    setMessage("");
  };
  return (
    <div
      className={`fixed top-0 right-0 w-96 h-[90%] rounded-xl bg-white my-6 text-black transform ${openModal ? "-translate-x-3" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
    >
      <button
        className="text-black p-4 flex w-full justify-end"
        onClick={handleButton}
      >
        <CloseIcon />
      </button>
      <div className="flex flex-col h-[90%] p-4">
        <div className="flex-1 overflow-y-auto pr-2 ">
          {chat?.messages?.map((message, index) => (
            <ShowChat
              userName={userName}
              admin={admin}
              message={message}
              key={index}
              myID={me}
            />
          ))}
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
          />
        </form>
      </div>
    </div>
  );
}
ChatSidebar.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleButton: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  admin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]).isRequired,
};

export default ChatSidebar;
