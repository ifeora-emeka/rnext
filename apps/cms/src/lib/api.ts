import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export const APICall = async (route: string, axiosOptions?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return axios(`http://localhost:1339/rnext-admin/api${route}`, axiosOptions);
};