import { apiRequest } from './config';

export const uploadApi = {
  async uploadRoomImage(file: File): Promise<{ success: boolean; data: { url: string } }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'rooms');

    return apiRequest('/upload/room-image', {
      method: 'POST',
      body: formData,
    });
  },
};
