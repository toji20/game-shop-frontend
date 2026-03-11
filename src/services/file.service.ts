import { axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'

class FileService {
  async upload(files: File[], folder?: string) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const { data } = await axiosWithAuth<{ url: string; name: string }[]>({
      url: API_URL.files(folder ? `?folder=${folder}` : ''),
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }
}

export const fileService = new FileService()
