import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

import env from "../config/api";
import { toast } from "react-toastify";
import useLoaderStore from "../features/loader/loader.service";
import { getUser } from "../helpers/common";

const baseURL = env.baseUrl;

const api: AxiosInstance = axios.create({
    baseURL,
    timeout: 100000,
    headers: {
        "Content-Type": "application/json",
    },
});

interface ApiResponse<T> {
    data: T;
    status: string;
    response_code: string;
}

function getToken(): string | null {
    return localStorage.getItem("accessToken") || null;
}

api.interceptors.request.use((config) => {
    const token = getToken();
    config.headers["Token"] = token;
    return config;
});

interface ApiError {
    code?: string | number;
    message?: string;
    error?: string;
    errors?: { rule?: string; message?: string }[];
}
export function handleApiError(status_code: string): string {
    switch (status_code) {
        case "SC-400":
            return "Bad Request - Please check your input.";
        case "SC-401":
            return "Unauthorized - Invalid credentials.";
        case "SC-403":
            return "Forbidden - You don't have permission.";
        case "SC-404":
            return "Not Found - Requested resource doesn't exist.";
        case "SC-409":
            return "Conflict - Duplicate or conflicting data.";
        case "SC-422":
            return "Unprocessable Entity - Validation error.";
        case "SC-500":
            return "Server Error - Please try again later.";
        default:
            return "An unexpected error occurred.";
    }
}


interface GetParams {
    query?: any;
}

// Define API methods

export async function get<T>(
    endpoint: string,
    options?: GetParams
): Promise<T | any> {
    const TOAST_ID = "global-get-toast";

    try {
        const result = await toast.promise(
            api.get(endpoint, {
                params: options?.query,
            }).then((res) => res.data as any),
            {
                pending: 'Loading...',
                success: 'Fetched successfully.',
                error: {
                    render({ data }) {
                        return data as any;
                    },
                },
            },
            {
                toastId: TOAST_ID,
            }
        );

        return result;
    } catch (error: any) {
        // Already handled in toast
        return null;
    }
}



export async function post<T>(
    endpoint: string,
    data: any,
    toastMessages?: {
        pending?: string;
        success?: string;
        error?: string;
    },
    opt?: PostPutOpt,
): Promise<T | any> {
    const TOAST_ID = 'global-post-toast';


    const postData = async () => {
        // const company_id = getUser()?.company_id
        if (opt?.formData) {
            api.interceptors.request.use((config) => {
                config.headers["Content-Type"] = "multipart/form-data";
                return config;
            });
        }

        const response: AxiosResponse<ApiResponse<T>> = await api.post(endpoint, {
            ...data,
            //  company_id 
        });
        if (response.data?.status === 'failed') {
            throw handleApiError(response.data.response_code)
        }
        return response.data as any;
    };

    const { pending = ' ', success = ' ', error = ' ' } = toastMessages || {};
    const loader = useLoaderStore.getState().setLoader;


    try {

        if (opt?.isLoader) {
            loader(true)
            const res = await postData()
            loader(false)

            return res
        }
        return await postData()

    } catch (error: any) {
        loader(false)
        toast.error(error)
        throw error;
    }
}

// export async function post<T>(
//   endpoint: string,
//   data: any,
//   opt?: PostPutOpt
// ): Promise<T | any> {
//   try {
//     if (opt?.formData) {
//       api.interceptors.request.use((config) => {
//         config.headers["Content-Type"] = "multipart/form-data";
//         return config;
//       });
//     }
//     const response: AxiosResponse<ApiResponse<T>> = await api.post(
//       endpoint,
//       data
//     );
//     return response.data as any;
//   } catch (error: any) {
//     console.log(error);

//     throw handleApiError(error);
//   }
// }

export interface PostPutOpt {
    formData?: boolean;
    isLoader?: boolean;
}
export async function put<T>(
    endpoint: string,
    data: any,
    opt?: PostPutOpt
): Promise<T | any> {
    try {
        if (opt?.formData) {
            api.interceptors.request.use((config) => {
                config.headers["Content-Type"] = "multipart/form-data";
                return config;
            });
        }

        const response: AxiosResponse<ApiResponse<T>> = await api.put(
            endpoint,
            data
        );
        return response.data as any;
    } catch (error: any) {
        console.log(error);
        // throw handleApiError(error);
    }
}

export async function patch<T>(
    endpoint: string,
    data: any,
    opt?: PostPutOpt
): Promise<T> {
    try {
        if (opt?.formData) {
            api.interceptors.request.use((config) => {
                config.headers["Content-Type"] = "multipart/form-data";
                return config;
            });
        }
        const response: AxiosResponse<ApiResponse<T>> = await api.patch(
            endpoint,
            data
        );
        return response.data as any;
    } catch (error: any) {
        console.log(error);
        return error
        // throw handleApiError(error);
    }
}

export async function del<T>(endpoint: string): Promise<T | any> {
    try {
        const response: AxiosResponse<ApiResponse<T>> = await api.delete(endpoint);
        return response.data as any;
    } catch (error: any) {
        console.log(error);
        // throw handleApiError(error);
    }
}

const Api = {
    get,
    post,
    put,
    patch,
    del,
};

export default Api;






















// ------------------------------------>template for toaster<------------------------------------------ 

// return await toast.promise(
//   postData(),
//   {
//     pending,
//     success,
//     error: {
//       render({ data }) {
//         return handleApiError(data as any);
//       },
//     },
//   },
//   {
//     toastId: TOAST_ID,
//   }
// );





// ------------------------------------>template for toaster<------------------------------------------ 
