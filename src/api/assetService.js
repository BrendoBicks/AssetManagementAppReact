import axiosInstance from './axiosInstance';

export const getAssets = () => {
    return axiosInstance.get('/assets');
}

export const getAssetById = (id) => {
    return axiosInstance.get(`/assets/${id}`);
}

export const createAsset = (data) => {
    return axiosInstance.post('/assets/create', data);
}

export const updateAsset = (data) => {
    return axiosInstance.put(`/assets/${data.id}`, data);
}

export const deleteAsset = (id) => {
    return axiosInstance.delete(`/assets/${id}`);
}

export const getAssetTypes = () => {
    return axiosInstance.get('/asset-type');
}

export const getAssetTypeById = (id) => {
    return axiosInstance.get(`/asset-type/${id}`);
}

export const createAssetType = (data) => {
    return axiosInstance.post('/asset-type/create', data);
}

export const updateAssetType = (data) => {
    return axiosInstance.put(`/asset-type/${data.id}`, data);
}

export const deleteAssetType = (id) => {
    return axiosInstance.delete(`/asset-type/${id}`);
}

export const getAssetStatuses = () => {
    return axiosInstance.get('/asset-status');
}

export const getAssetStatusById = (id) => {
    return axiosInstance.get(`/asset-status/${id}`);
}

export const createAssetStatus = (data) => {
    return axiosInstance.post('/asset-status/create', data);
}

export const updateAssetStatus = (data) => {
    return axiosInstance.put(`/asset-status/${data.id}`, data);
}

export const deleteAssetStatus = (id) => {
    return axiosInstance.delete(`/asset-status/${id}`);
}