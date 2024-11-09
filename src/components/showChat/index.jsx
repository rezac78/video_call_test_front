import PropTypes from "prop-types";

function ShowChat({ message, myID, userName, admin }) {
  const isSelf = message.author === myID?.id;

  const displayedName = admin === "ادمین"
    ? isSelf ? "ادمین" : userName
    : isSelf ? userName : "ادمین";

  return (
    <div
      style={{ direction: isSelf ? "ltr" : "rtl" }}
      className="flex gap-x-2 my-2"
    >
      <span className="text-[12px]">{displayedName} :</span>
      <div className="w-10/12 break-words whitespace-pre-wrap text-justify">
        {message.content}
      </div>
    </div>
  );
}

ShowChat.propTypes = {
  message: PropTypes.shape({
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  myID: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  userName: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
};

export default ShowChat;
