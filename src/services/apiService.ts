import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnknownObjects } from '../interfaces/generalProps';

// export const AppDomainUrl = 'https://kanakku-web.dreamstechnologies.com:7008/';
// export const AppDomainUrl = 'https://app.kanakku.uk:8443/';

export const AppDomainUrl = 'https://kanakku-web.dreamstechnologies.com:7008/';
// export const AppDomainUrl = 'https://app.kanakku.uk:8443/';

const client = axios.create({ baseURL: AppDomainUrl });

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

export async function postMethod(
    url: string,
    data: FormData | object,
    successCallback: (res: any, details: UnknownObjects) => void,
    errorCallback: (er: any) => void,
    details?: any,
) {
    console.log(url);
    // console.log('param===>', JSON.stringify(data));
    console.log("Token from post method", await getToken());
    const isFormData = data instanceof FormData;
    const content_type = isFormData ? 'multipart/form-data' : 'application/json';
    // const content_type =
    //     typeof data === 'object' ? 'application/json' : 'multipart/form-data';
    var headersConfig: Record<string, string> = {
        Accept: content_type,
        'Content-Type': content_type,
    };
    console.log(headersConfig);

    // const token = await getToken();
    // token ? (headersConfig.Authorization = `Bearer ${token}`) : null;

    const token = await getToken();
    token ? (headersConfig['token'] = token) : null;
    try{
    client
        .post(url, data, { headers: headersConfig })
        .then(response => {
            console.log("url ==>", url)
            // console.log(JSON.stringify(response.data));
            successCallback(response.data, details);
            return response.data;
        })
        .catch(error => {
            // console.log(JSON.stringify(error.response.data));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error.response.data;
        });
    }
    catch(error){
        console.log(error)
    }
}

export async function patchMethod<TResponse, TError>(
    url: string,
    data: object,
    successCallback: (res: TResponse) => void,
    errorCallback: (er: TError) => void,
) {
    console.log('url===>', url);
    // console.log(
    //     'param===>',
    //     JSON.stringify(data).length <= 300
    //         ? JSON.stringify(data)
    //         : JSON.stringify(data).slice(0, 1000),
    // );

    const content_type = 'application/json'; // Assuming data is always JSON for PATCH requests
    var headersConfig: Record<string, string> = {
        Accept: content_type,
        'Content-Type': content_type,
    };
    const token = await getToken();
    token ? (headersConfig['token'] = token) : null;
    client
        .patch(url, data, { headers: headersConfig })
        .then(response => {
            // console.log(JSON.stringify(response.data));
            successCallback(response.data as TResponse);
            return response.data;
        })
        .catch(error => {
            // console.log(JSON.stringify(error.response ? error.response.data : error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error.response.data;
        });
}


export async function getMethod(
    url: string,
    successCallback: (res: any) => void,
    errorCallback: (er: any) => void,
) {
    console.log(url);
    console.log("Token from get method", await getToken());
    var headersConfig: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    const token = await getToken();
    token ? (headersConfig['token'] = token) : null;

    client
        .get(url, { headers: headersConfig })
        .then(response => {
            // console.log(JSON.stringify(response.data));
            successCallback(response.data);
            return response.data;
        })
        .catch(error => {
            // console.log(JSON.stringify(error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error?.response?.data;
        });
}

export async function putMethod<TResponse, TError>(
    url: string,
    data: FormData | object,
    successCallback: (res: TResponse) => void,
    errorCallback: (er: TError) => void,
) {
    console.log('url===>', url);
    // console.log(
    //     'param===>',
    //     JSON.stringify(data).length <= 300
    //         ? JSON.stringify(data)
    //         : JSON.stringify(data).slice(0, 1000),
    // );
    // Determine the content type based on the data type
    const isFormData = data instanceof FormData;
    const content_type = isFormData ? 'multipart/form-data' : 'application/json';

    var headersConfig: Record<string, string> = {
        Accept: content_type,
        'Content-Type': content_type,
    };
    const token = await getToken();
    // token ? (headersConfig['Authorization'] = `Bearer ${token}`) : null;
    console.log(headersConfig,'TOKEN', token);
    // const token = await getToken();
    token ? (headersConfig['token'] = token) : null;
    client
        .put(url, data, { headers: headersConfig })
        .then(response => {
            console.log('RESPONSEE')
            // console.log(JSON.stringify(response.data));
            successCallback(response.data as TResponse);
            return response.data;
        })
        .catch(error => {
            console.log('ERROR')
            // console.log(JSON.stringify(error.response ? error.response.data : error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error?.response?.data ?? error;
        });
}

export async function deleteMethod<TResponse, TError>(
    url: string,
    data: FormData | object,
    successCallback: (res: TResponse) => void,
    errorCallback: (er: TError) => void,
) {
    console.log('url===>', url);
    // console.log(
    //     'param===>',
    //     JSON.stringify(data).length <= 300
    //         ? JSON.stringify(data)
    //         : JSON.stringify(data).slice(0, 1000),
    // );
    // Determine the content type based on the data type
    const isFormData = data instanceof FormData;
    const content_type = isFormData ? 'multipart/form-data' : 'application/json';

    var headersConfig: Record<string, string> = {
        Accept: content_type,
        'Content-Type': content_type,
    };
    const token = await getToken();
    // token ? (headersConfig['Authorization'] = `Bearer ${token}`) : null;
    console.log('TOKEN', token);
    // const token = await getToken();
    token ? (headersConfig['token'] = token) : null;
    client
        .delete(url,)
        .then(response => {
            console.log('RESPONSEE')
            // console.log(JSON.stringify(response.data));
            successCallback(response.data as TResponse);
            return response.data;
        })
        .catch(error => {
            console.log('ERROR')
            // console.log(JSON.stringify(error.response ? error.response.data : error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error.response.data;
        });
}
// New get and post methods with interface  //

export async function postMethodNew<TResponse, TError>(
    url: string,
    data: FormData | object,
    successCallback: (res: TResponse) => void,
    errorCallback: (er: TError) => void,
) {
    console.log('url===>', url);
    // console.log(
    //     'param===>',
    //     JSON.stringify(data).length <= 300
    //         ? JSON.stringify(data)
    //         : JSON.stringify(data).slice(0, 1000),
    // );

    const content_type =
        typeof data == 'object' ? 'application/json' : 'multipart/form-data';
    var headersConfig: Record<string, string> = {
        Accept: content_type,
        'Content-Type': content_type,
    };

    const token = await getToken();
    token && console.log('token===>', token);
    token ? (headersConfig.Authorization = `Bearer ${token}`) : null;
    // Adjust the login endpoint here
    const loginUrl = `${AppDomainUrl}login`;

    client
        .post(loginUrl, data, { headers: headersConfig })
        .then(response => {
            // console.log(JSON.stringify(response.data));
            successCallback(response.data as TResponse);
            return response.data;
        })
        .catch(error => {
            // console.log(JSON.stringify(error.response ? error.response.data : error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error.response.data;
        });
}

export async function getMethodNew<TResponse, TError>(
    url: string,
    successCallback: (res: TResponse) => void,
    errorCallback: (er: TError) => void,
) {
    console.log('url===>', url);

    var headersConfig: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const token = await getToken();
    // console.log("token===>", token)
    token ? (headersConfig.Authorization = `Bearer ${token}`) : null;
    client
        .get(url, { headers: headersConfig })
        .then(response => {
            // console.log(JSON.stringify(response.data));
            successCallback(response.data as TResponse);
            return response.data;
        })

        .catch(error => {
            // console.log(JSON.stringify(error.response ? error.response.data : error));
            error.response
                ? errorCallback(error.response.data)
                : errorCallback(error);
            return error.response.data;
        });
}