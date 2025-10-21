import api from '@/utils/api';

export interface UploadResponse {
  url: string;
  publicId: string;
  _id: string;
}

class ImageUploadService {
  async uploadSingleImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file); 

    const response = await api.post('/api/v1/media/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, 
    });

    return response.data;
  }

  async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    if (files.length > 3) {
      throw new Error('Maximum 3 images allowed for batch upload');
    }

    const formData = new FormData();
    files.forEach((file, _) => {
      formData.append('images', file);
    });

    const response = await api.post('/api/v1/media/images/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data;
  }

  // Validate file size and type
  validateFile(file: File, maxSizeMB: number = 10): string | null {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'File must be an image (JPEG, PNG, GIF, or WebP)';
    }

    return null;
  }
}

export const imageUploadService = new ImageUploadService();