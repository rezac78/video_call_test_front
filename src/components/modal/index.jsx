import PropTypes from "prop-types";

function Modal({
  setName,
  isModalOpen,
  setPhoneNumber,
  handleConnect,
  phoneNumber,
  name,
}) {
  return (
    <>
      {isModalOpen && (
        <div className="fixed top-10 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div
            className="bg-[#F1F3F4] p-8 rounded shadow-lg w-96"
            style={{ direction: "rtl" }}
          >
            <input
              type="text"
              placeholder="نام کاربر (اختیاری)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-4 border rounded bg-[#D7D9DA] text-[#202124]"
            />
            <input
              type="text"
              placeholder="شماره تماس"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 mb-4 border rounded bg-[#D7D9DA] text-[#202124]"
            />
            <div className="flex justify-center">
              <button
                onClick={handleConnect}
                className="w-20 bg-[#0B57D0] text-white p-2 rounded"
              >
                اتصال
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Modal.propTypes = {
  setName: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  setPhoneNumber: PropTypes.func.isRequired,
  handleConnect: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Modal;
