import { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../context/RoomContext';
import { useNavigate } from 'react-router-dom';

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
                setCallRequests((prevRequests) => prevRequests.filter(request => request.id !== requestId));
                ws.emit("delete-call-request", requestId);
        };

        return (
                <div className="min-h-screen bg-gray-100 p-4">
                        <h1 className="text-2xl font-bold mb-4">Dashboard - Call Requests</h1>
                        <div className="bg-white shadow-md rounded p-4">
                                {callRequests.length === 0 ? (
                                        <p>No call requests yet.</p>
                                ) : (
                                        <table className="w-full table-auto">
                                                <thead>
                                                        <tr>
                                                                <th className="px-4 py-2">ID</th>
                                                                <th className="px-4 py-2">Name</th>
                                                                <th className="px-4 py-2">Phone Number</th>
                                                                <th className="px-4 py-2">Timestamp</th>
                                                                <th className="px-4 py-2">Action</th>
                                                                <th className="px-4 py-2">Delete</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {callRequests.map((request, index) => (
                                                                <tr key={index}>
                                                                        <td className="border px-4 py-2">{request.id}</td>
                                                                        <td className="border px-4 py-2">{request.name}</td>
                                                                        <td className="border px-4 py-2">{request.phoneNumber}</td>
                                                                        <td className="border px-4 py-2">
                                                                                {new Date(request.timestamp).toLocaleString()}
                                                                        </td>
                                                                        <td className="border px-4 py-2">
                                                                                <button
                                                                                        onClick={() => handleCall(request)}
                                                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                                                >
                                                                                        Call
                                                                                </button>
                                                                        </td>
                                                                        <td className="border px-4 py-2">
                                                                                <button
                                                                                        onClick={() => handleDelete(request.id)}
                                                                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                                                                >
                                                                                        X
                                                                                </button>
                                                                        </td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                )}
                        </div>
                </div>
        );
};
