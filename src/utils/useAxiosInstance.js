import { useMemo } from "react";
import axiosInstance from "../utils/";

const useAxiosInstance = () => {
  return useMemo(() => axiosInstance, []);
};

export default useAxiosInstance;
