
function ShowChat({ message, myID }) {
        const isSelf = message.author === myID?.id
        return (
                <div
                        className={`p-2 my-2 rounded-lg ${isSelf ? "bg-gray-200" : "bg-gray-500"
                                }`}
                >
                        {message.content}
                </div>
        );
}

export default ShowChat;
