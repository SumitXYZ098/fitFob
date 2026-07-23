import apiInstance from './apiInstance';
import { ENDPOINTS } from './endpoint';

export const clientBasicDetails = async (
  name: string,
  email: string,
  phoneNumber: string,
  gender?: string
) => {
  try {
    const response = await apiInstance.post(ENDPOINTS.BASIC_DETAILS, {
      name,
      email,
      phoneNumber,
      gender,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientBodyInfo = async (height: string, weight: string, date_of_birth: string) => {
  try {
    const response = await apiInstance.post(ENDPOINTS.BODY_INFO, {
      height,
      weight,
      date_of_birth,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientLocation = async (latitude: string, longitude: string) => {
  try {
    const response = await apiInstance.post(ENDPOINTS.LOCATION, {
      latitude,
      longitude,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientSelfie = async (image: string) => {
  try {
    const formData = new FormData();
    const filename = image.split('/').pop() || 'selfie.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('selfieUpload', {
      uri: image,
      name: filename,
      type,
    } as any);

    const response = await apiInstance.post(ENDPOINTS.SELFIE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientGovId = async (image: string) => {
  try {
    const formData = new FormData();
    const filename = image.split('/').pop() || 'governmentId.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('governmentId', {
      uri: image,
      name: filename,
      type,
    } as any);

    const response = await apiInstance.post(ENDPOINTS.GOVERNMENT_ID, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientSubmit = async () => {
  try {
    const response = await apiInstance.post(ENDPOINTS.VERIFY_PENDING_CLIENT);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUserStep = async () => {
  try {
    const response = await apiInstance.get(ENDPOINTS.CHECK_STEP);
    console.log(response.data, new Date().toISOString());
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Get Qr
export const getQr = async () => {
  try {
    const response = await apiInstance.get(ENDPOINTS.GET_QR);

    return response;
  } catch (error) {
    throw error;
  }
};