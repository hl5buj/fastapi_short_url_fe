import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== 인증 관련 유틸리티 =====

/**
 * Get token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set token to localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user to localStorage
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user from localStorage
 */
export const removeUser = () => {
  localStorage.removeItem('user');
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!getToken();
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.is_admin;
};

// Axios request interceptor - 모든 요청에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor - 401 에러 시 로그아웃
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      removeUser();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * Upload a file and get short URL
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload response with short_url
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Get file information without downloading
 * @param {string} shortId - Short ID from URL
 * @returns {Promise<Object>} File information
 */
export const getFileInfo = async (shortId) => {
  const response = await apiClient.get(`/info/${shortId}`);
  return response.data;
};

/**
 * Download file by short ID
 * @param {string} shortId - Short ID from URL
 * @returns {Promise<Blob>} File blob for download
 */
export const downloadFile = async (shortId) => {
  const response = await apiClient.get(`/download/${shortId}`, {
    responseType: 'blob',
  });
  return response;
};

/**
 * Get all available files
 * @returns {Promise<Object>} List of files
 */
export const getFiles = async () => {
  const response = await apiClient.get('/files');
  return response.data;
};

/**
 * Delete a shared file
 * @param {string} shortId - Short ID from URL
 * @returns {Promise<Object>} Delete response
 */
export const deleteFile = async (shortId) => {
  const response = await apiClient.delete(`/files/${shortId}`);
  return response.data;
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Get file type category from filename
 * @param {string} filename - File name
 * @returns {string} File type category
 */
export const getFileTypeCategory = (filename) => {
  const ext = getFileExtension(filename);

  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt'];
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  const codeTypes = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'html', 'css', 'json', 'xml', 'yaml', 'yml'];

  if (imageTypes.includes(ext)) return '이미지';
  if (videoTypes.includes(ext)) return '비디오';
  if (audioTypes.includes(ext)) return '오디오';
  if (documentTypes.includes(ext)) return '문서';
  if (archiveTypes.includes(ext)) return '압축파일';
  if (codeTypes.includes(ext)) return '코드';

  return '기타';
};

/**
 * Group files by type category
 * @param {Array} files - Array of file objects
 * @returns {Object} Files grouped by category
 */
export const groupFilesByType = (files) => {
  const grouped = {};

  files.forEach(file => {
    const category = getFileTypeCategory(file.original_filename);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(file);
  });

  return grouped;
};

// ===== 인증 API =====

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response with token and user info
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  if (response.data.access_token) {
    setToken(response.data.access_token);
    setUser(response.data.user);
  }
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Username and password
 * @returns {Promise<Object>} Response with token and user info
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data.access_token) {
    setToken(response.data.access_token);
    setUser(response.data.user);
  }
  return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
  removeToken();
  removeUser();
};

/**
 * Get current user info
 * @returns {Promise<Object>} User info
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// ===== 관리자 API =====

/**
 * Get download logs (admin only)
 * @returns {Promise<Object>} Download logs
 */
export const getDownloadLogs = async () => {
  const response = await apiClient.get('/admin/download-logs');
  return response.data;
};

/**
 * Reset file download limit (admin only)
 * @param {string} shortId - File short ID
 * @param {number} newMaxDownloads - New download limit
 * @returns {Promise<Object>} Updated file info
 */
export const resetFileDownloads = async (shortId, newMaxDownloads) => {
  const response = await apiClient.patch(
    `/admin/files/${shortId}/reset-downloads`,
    null,
    { params: { new_max_downloads: newMaxDownloads } }
  );
  return response.data;
};

/**
 * Delete download log (admin only)
 * @param {number} logId - Log ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteDownloadLog = async (logId) => {
  const response = await apiClient.delete(`/admin/download-logs/${logId}`);
  return response.data;
};

/**
 * Change password for current user
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Change password response
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.patch('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  });
  return response.data;
};

export default apiClient;
