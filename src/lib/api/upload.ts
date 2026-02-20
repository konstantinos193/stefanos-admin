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

  async uploadMultipleRoomImages(files: File[]): Promise<{ success: boolean; data: { urls: string[] } }> {
    const uploadPromises = files.map(file => this.uploadRoomImage(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const urls = successfulUploads.map(result => result.data.url);
      
      return {
        success: successfulUploads.length > 0,
        data: { urls }
      };
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },

  async uploadPropertyImage(file: File, propertyId?: string): Promise<{ success: boolean; data: { url: string } }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', propertyId ? `properties/${propertyId}` : 'properties');

    return apiRequest('/upload/room-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadMultiplePropertyImages(files: File[], propertyId?: string): Promise<{ success: boolean; data: { urls: string[] } }> {
    const uploadPromises = files.map(file => this.uploadPropertyImage(file, propertyId));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const urls = successfulUploads.map(result => result.data.url);
      
      return {
        success: successfulUploads.length > 0,
        data: { urls }
      };
    } catch (error) {
      console.error('Error uploading multiple property images:', error);
      throw error;
    }
  },
};
