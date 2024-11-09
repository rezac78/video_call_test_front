import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import LogoLink from "../components/Logo";

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        verificationCode: ""
    });
    const [error, setError] = useState({
        phone: "",
        password: "",
        verificationCode: ""
    });

    // Get the original path or roomId
    const from = location.state?.from || "/";

    console.log(from)

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^09[0-9]{9}$/;
        return phoneRegex.test(phone);
    };

    const handlePhoneSubmit = async () => {
        if (!validatePhone(formData.phone)) {
            setError((prev) => ({ ...prev, phone: "Please enter a valid phone number" }));
            return;
        }
        setLoading(true);
        try {
            await axios.post("https://auth.tatpnu.com/api/v1/account/check", { phone_number: formData.phone }, {
                headers: {
                    "Api-Key": "5RnY2N7nQQOXxBHd8UzGQCzyGpVk69wR",
                },
            });
            setStep(1);
            enqueueSnackbar("شماره ثبت نشده", { variant: "success" });
        } catch (err) {
            enqueueSnackbar("Failed to send verification code", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!formData.password) {
            setError((prev) => ({ ...prev, password: "Please enter your password" }));
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("https://auth.tatpnu.com/api/v1/account/login", {
                phone_number: formData.phone,
                password: formData.password
            }, {
                headers: {
                    "Api-Key": "5RnY2N7nQQOXxBHd8UzGQCzyGpVk69wR",
                },
            });
            const { token } = response.data.data;
            localStorage.setItem("authToken", token);
            enqueueSnackbar("ورود موفقیت آمیز بود", { variant: "success" });

            window.location.replace(from);
        } catch (err) {
            enqueueSnackbar("خطایی رخ داده", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex">
            <div
                className={`flex  w-full lg:w-[80vw] 2xl:w-[55vw] h-screen sm:h-[650px] m-auto `}>
                <div
                    className={'hidden sm:block bg-[#484848] w-[400px] rounded-l-[24px] relative shadow-[-2px_0px_10px_rgba(0,0,0,0.25)]'}>
                    <img
                        className={'absolute left-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] object-contain'}
                        src={'/login/login-edu.png'} alt={'login-education-img'} />
                </div>
                <form
                    className={`flex flex-col gap-y-10  w-full h-full p-4 sm:pt-16 sm:px-32 rounded-r-[24px] shadow-[2px_0px_10px_rgba(0,0,0,0.25)] `}>
                    <div className={'mx-auto flex flex-col items-center text-primary font-bold'}>
                        <LogoLink />
                        <div>موسسه آموزشی</div>
                        <div>همراهان فردایی روشن</div>
                    </div>
                    <div className={'space-y-3'}>
                        <div className="">
                            <h2 className="text-lg text-right py-3 text-gray-800">
                                {step === 0 ? "ورود به همراهان" : "رمز عبور خود را وارد کنید"}
                            </h2>
                            {step === 0 && (
                                <div style={{ direction: "rtl" }}>
                                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                        شماره تلفن
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        placeholder="شماره تلفن"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                    />
                                    {error.phone && <p className="mt-1 text-sm text-red-600">{error.phone}</p>}

                                    <button
                                        onClick={handlePhoneSubmit}
                                        disabled={loading}
                                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                    >
                                        {loading ? "صبر کنید ..." : "ورود"}
                                    </button>
                                </div>
                            )}
                            {step === 1 && (
                                <div style={{ direction: "rtl" }}>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        placeholder="پسورد را وارد کنید"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                    />
                                    {error.password && <p className="mt-1 text-sm text-red-600">{error.password}</p>}

                                    <button
                                        onClick={handlePasswordSubmit}
                                        disabled={loading}
                                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                    >
                                        {loading ? "صبر کنید ..." : "تایید"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
