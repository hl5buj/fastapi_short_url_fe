# API Reference - File Sharing Application

Quick reference guide for all frontend API functions and usage patterns.

## Table of Contents
1. [Authentication API](#authentication-api)
2. [File Management API](#file-management-api)
3. [Admin API](#admin-api)
4. [Utility Functions](#utility-functions)
5. [API Client Configuration](#api-client-configuration)

---

## Authentication API

### `login(credentials)`
Authenticate user and store JWT token.

**Parameters:**
```javascript
{
  username: string,  // Username
  password: string   // Password
}
```

**Returns:** `Promise<Object>`
```javascript
{
  access_token: string,
  token_type: "bearer",
  user: {
    id: number,
    username: string,
    email: string,
    is_admin: boolean
  }
}
```

**Usage:**
```javascript
import { login } from './utils/api';

try {
  const result = await login({
    username: 'john',
    password: 'password123'
  });
  console.log('Logged in:', result.user.username);
} catch (error) {
  console.error('Login failed:', error.response?.data?.detail);
}
```

**Side Effects:**
- Stores token in localStorage
- Stores user object in localStorage

---

### `register(userData)`
Register new user account.

**Parameters:**
```javascript
{
  username: string,  // Unique username
  email: string,     // Valid email address
  password: string   // Minimum 6 characters
}
```

**Returns:** `Promise<Object>`
```javascript
{
  access_token: string,
  token_type: "bearer",
  user: { id, username, email, is_admin }
}
```

**Usage:**
```javascript
import { register } from './utils/api';

try {
  await register({
    username: 'newuser',
    email: 'user@example.com',
    password: 'secure123'
  });
  // Auto-logged in after registration
} catch (error) {
  console.error('Registration failed:', error.response?.data?.detail);
}
```

**Side Effects:**
- Stores token in localStorage
- Stores user object in localStorage
- Automatically logs in user

---

### `logout()`
Clear authentication and logout user.

**Parameters:** None

**Returns:** `void`

**Usage:**
```javascript
import { logout } from './utils/api';

logout();
// User is logged out, token and user data cleared
window.location.href = '/'; // Redirect to login
```

**Side Effects:**
- Removes token from localStorage
- Removes user object from localStorage
- Does NOT redirect (handle manually)

---

### `changePassword(currentPassword, newPassword)`
Change current user's password.

**Parameters:**
```javascript
currentPassword: string  // Current password for verification
newPassword: string      // New password (min 6 characters)
```

**Returns:** `Promise<Object>`
```javascript
{
  message: "비밀번호가 성공적으로 변경되었습니다."
}
```

**Usage:**
```javascript
import { changePassword } from './utils/api';

try {
  await changePassword('oldpass123', 'newpass456');
  alert('Password changed successfully!');
} catch (error) {
  if (error.response?.status === 400) {
    alert('Current password is incorrect');
  }
}
```

**Errors:**
- 400: Current password incorrect
- 401: Not authenticated

---

### `getCurrentUser()`
Get current authenticated user information.

**Parameters:** None

**Returns:** `Promise<Object>`
```javascript
{
  id: number,
  username: string,
  email: string,
  is_admin: boolean,
  created_at: string
}
```

**Usage:**
```javascript
import { getCurrentUser } from './utils/api';

const user = await getCurrentUser();
console.log('Current user:', user.username);
```

---

### `getToken()`
Get stored JWT token from localStorage.

**Parameters:** None

**Returns:** `string | null`

**Usage:**
```javascript
import { getToken } from './utils/api';

const token = getToken();
if (token) {
  console.log('User is authenticated');
}
```

---

### `setToken(token)`
Store JWT token in localStorage.

**Parameters:**
```javascript
token: string  // JWT token from backend
```

**Returns:** `void`

**Usage:**
```javascript
import { setToken } from './utils/api';

setToken('eyJhbGciOiJIUzI1NiIs...');
```

---

### `removeToken()`
Remove JWT token from localStorage.

**Parameters:** None

**Returns:** `void`

---

### `getUser()`
Get stored user object from localStorage.

**Parameters:** None

**Returns:** `Object | null`
```javascript
{
  id: number,
  username: string,
  email: string,
  is_admin: boolean
}
```

**Usage:**
```javascript
import { getUser } from './utils/api';

const user = getUser();
if (user) {
  console.log('Username:', user.username);
  console.log('Admin:', user.is_admin);
}
```

---

### `setUser(user)`
Store user object in localStorage.

**Parameters:**
```javascript
user: Object  // User object from backend
```

**Returns:** `void`

---

### `removeUser()`
Remove user object from localStorage.

**Parameters:** None

**Returns:** `void`

---

### `isLoggedIn()`
Check if user is currently logged in.

**Parameters:** None

**Returns:** `boolean`

**Usage:**
```javascript
import { isLoggedIn } from './utils/api';

if (isLoggedIn()) {
  // Show app content
} else {
  // Show login form
}
```

---

### `isAdmin()`
Check if current user has admin privileges.

**Parameters:** None

**Returns:** `boolean`

**Usage:**
```javascript
import { isAdmin } from './utils/api';

if (isAdmin()) {
  // Show admin features
}
```

---

## File Management API

### `uploadFile(file)`
Upload file to server and get short URL.

**Parameters:**
```javascript
file: File  // File object from input or drag-drop
```

**Returns:** `Promise<Object>`
```javascript
{
  short_id: string,
  short_url: string,
  original_filename: string,
  file_size: number,
  max_downloads: number,
  created_at: string,
  expires_at: string
}
```

**Usage:**
```javascript
import { uploadFile } from './utils/api';

const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

try {
  const result = await uploadFile(file);
  console.log('File uploaded:', result.short_url);
  console.log('Expires:', result.expires_at);
} catch (error) {
  console.error('Upload failed:', error.response?.data?.detail);
}
```

**Request Format:**
- Content-Type: `multipart/form-data`
- Field name: `file`

---

### `getFiles()`
Get list of all available files for current user.

**Parameters:** None

**Returns:** `Promise<Object>`
```javascript
{
  files: [
    {
      short_id: string,
      original_filename: string,
      file_size: number,
      download_count: number,
      max_downloads: number,
      remaining_downloads: number,
      is_active: boolean,
      created_at: string,
      expires_at: string
    }
  ]
}
```

**Usage:**
```javascript
import { getFiles } from './utils/api';

const { files } = await getFiles();
console.log(`Found ${files.length} files`);

files.forEach(file => {
  console.log(`${file.original_filename}: ${file.remaining_downloads} downloads left`);
});
```

---

### `getFileInfo(shortId)`
Get file information without downloading.

**Parameters:**
```javascript
shortId: string  // Short ID from URL
```

**Returns:** `Promise<Object>`
```javascript
{
  short_id: string,
  original_filename: string,
  file_size: number,
  download_count: number,
  max_downloads: number,
  remaining_downloads: number,
  is_active: boolean,
  created_at: string,
  expires_at: string
}
```

**Usage:**
```javascript
import { getFileInfo } from './utils/api';

const info = await getFileInfo('abc123');
console.log('File:', info.original_filename);
console.log('Size:', formatFileSize(info.file_size));
console.log('Downloads:', `${info.download_count}/${info.max_downloads}`);
```

---

### `downloadFile(shortId)`
Download file by short ID.

**Parameters:**
```javascript
shortId: string  // Short ID from file list
```

**Returns:** `Promise<AxiosResponse>`
```javascript
{
  data: Blob,           // File content as Blob
  headers: {
    'content-disposition': string,  // Filename
    'content-type': string           // MIME type
  }
}
```

**Usage:**
```javascript
import { downloadFile } from './utils/api';

try {
  const response = await downloadFile('abc123');
  const blob = new Blob([response.data]);

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'filename.pdf';
  link.click();
  window.URL.revokeObjectURL(url);
} catch (error) {
  console.error('Download failed:', error.response?.data?.detail);
}
```

**Response Type:** `blob`

---

### `deleteFile(shortId)`
Delete file from server (admin only).

**Parameters:**
```javascript
shortId: string  // Short ID of file to delete
```

**Returns:** `Promise<Object>`
```javascript
{
  message: "파일이 삭제되었습니다."
}
```

**Usage:**
```javascript
import { deleteFile, isAdmin } from './utils/api';

if (isAdmin()) {
  try {
    await deleteFile('abc123');
    alert('File deleted successfully');
    // Refresh file list
  } catch (error) {
    console.error('Delete failed:', error.response?.data?.detail);
  }
}
```

**Errors:**
- 403: Not authorized (not admin)
- 404: File not found

---

## Admin API

### `getDownloadLogs()`
Get all download logs (admin only).

**Parameters:** None

**Returns:** `Promise<Object>`
```javascript
{
  logs: [
    {
      id: number,
      user_id: number,
      username: string,
      filename: string,
      downloaded_at: string,
      ip_address: string
    }
  ]
}
```

**Usage:**
```javascript
import { getDownloadLogs } from './utils/api';

const { logs } = await getDownloadLogs();
console.log(`Total downloads: ${logs.length}`);

logs.forEach(log => {
  console.log(`${log.username} downloaded ${log.filename} at ${log.downloaded_at}`);
});
```

**Errors:**
- 403: Not authorized (not admin)

---

### `deleteDownloadLog(logId)`
Delete specific download log entry (admin only).

**Parameters:**
```javascript
logId: number  // ID of log entry to delete
```

**Returns:** `Promise<Object>`
```javascript
{
  message: "로그가 삭제되었습니다."
}
```

**Usage:**
```javascript
import { deleteDownloadLog } from './utils/api';

try {
  await deleteDownloadLog(42);
  console.log('Log deleted');
  // Refresh logs list
} catch (error) {
  console.error('Delete failed:', error.response?.data?.detail);
}
```

**Errors:**
- 403: Not authorized (not admin)
- 404: Log not found

---

### `resetFileDownloads(shortId, newMaxDownloads)`
Reset file download count and limit (admin only).

**Parameters:**
```javascript
shortId: string         // File short ID
newMaxDownloads: number // New download limit (min 1)
```

**Returns:** `Promise<Object>`
```javascript
{
  short_id: string,
  download_count: number,      // Reset to 0
  max_downloads: number,       // New limit
  remaining_downloads: number  // New limit
}
```

**Usage:**
```javascript
import { resetFileDownloads } from './utils/api';

try {
  const updated = await resetFileDownloads('abc123', 10);
  console.log(`Reset to ${updated.max_downloads} downloads`);
} catch (error) {
  console.error('Reset failed:', error.response?.data?.detail);
}
```

**Errors:**
- 403: Not authorized (not admin)
- 404: File not found
- 400: Invalid download limit

---

## Utility Functions

### `formatFileSize(bytes)`
Format byte count to human-readable size.

**Parameters:**
```javascript
bytes: number  // File size in bytes
```

**Returns:** `string`

**Examples:**
```javascript
import { formatFileSize } from './utils/api';

formatFileSize(0);          // "0 Bytes"
formatFileSize(1024);       // "1 KB"
formatFileSize(1536);       // "1.5 KB"
formatFileSize(1048576);    // "1 MB"
formatFileSize(5242880);    // "5 MB"
formatFileSize(1073741824); // "1 GB"
```

---

### `formatDate(dateString)`
Format ISO date string to Korean locale.

**Parameters:**
```javascript
dateString: string  // ISO 8601 date string
```

**Returns:** `string`

**Format:** `YYYY. MM. DD. HH:MM`

**Examples:**
```javascript
import { formatDate } from './utils/api';

formatDate('2025-11-01T10:30:00Z');
// "2025. 11. 01. 오후 7:30"

formatDate('2025-01-15T09:00:00Z');
// "2025. 01. 15. 오후 6:00"
```

---

### `getFileExtension(filename)`
Extract file extension from filename.

**Parameters:**
```javascript
filename: string  // Full filename with extension
```

**Returns:** `string` (lowercase)

**Examples:**
```javascript
import { getFileExtension } from './utils/api';

getFileExtension('document.pdf');      // "pdf"
getFileExtension('image.JPG');         // "jpg"
getFileExtension('archive.tar.gz');    // "gz"
getFileExtension('noextension');       // ""
```

---

### `getFileTypeCategory(filename)`
Categorize file by extension.

**Parameters:**
```javascript
filename: string  // Full filename
```

**Returns:** `string`

**Categories:**
- `"이미지"` - Images (jpg, png, gif, svg, etc.)
- `"비디오"` - Videos (mp4, avi, mov, etc.)
- `"오디오"` - Audio (mp3, wav, ogg, etc.)
- `"문서"` - Documents (pdf, doc, xls, txt, etc.)
- `"압축파일"` - Archives (zip, rar, 7z, etc.)
- `"코드"` - Code (js, py, java, html, etc.)
- `"기타"` - Other

**Examples:**
```javascript
import { getFileTypeCategory } from './utils/api';

getFileTypeCategory('photo.jpg');      // "이미지"
getFileTypeCategory('video.mp4');      // "비디오"
getFileTypeCategory('song.mp3');       // "오디오"
getFileTypeCategory('report.pdf');     // "문서"
getFileTypeCategory('backup.zip');     // "압축파일"
getFileTypeCategory('app.js');         // "코드"
getFileTypeCategory('file.xyz');       // "기타"
```

---

### `groupFilesByType(files)`
Group array of files by type category.

**Parameters:**
```javascript
files: Array<Object>  // Array of file objects
```

**Returns:** `Object`

**Example:**
```javascript
import { groupFilesByType } from './utils/api';

const files = [
  { original_filename: 'photo.jpg', file_size: 1024 },
  { original_filename: 'video.mp4', file_size: 2048 },
  { original_filename: 'image.png', file_size: 512 }
];

const grouped = groupFilesByType(files);
// {
//   "이미지": [
//     { original_filename: 'photo.jpg', ... },
//     { original_filename: 'image.png', ... }
//   ],
//   "비디오": [
//     { original_filename: 'video.mp4', ... }
//   ]
// }

Object.keys(grouped).forEach(category => {
  console.log(`${category}: ${grouped[category].length} files`);
});
```

---

## API Client Configuration

### Base Configuration

**Base URL:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

**Default Headers:**
```javascript
{
  'Content-Type': 'application/json'
}
```

---

### Request Interceptor

Automatically adds JWT token to all requests:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

### Response Interceptor

Automatically handles 401 errors and logs out user:

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

---

## Error Handling Patterns

### Standard Error Handling
```javascript
try {
  const result = await apiFunction();
  // Handle success
} catch (error) {
  // Check for specific error status
  if (error.response?.status === 404) {
    console.error('Not found');
  }

  // Get error message from backend
  const message = error.response?.data?.detail || 'An error occurred';
  console.error(message);

  // Display to user
  setError(message);
}
```

### Validation Errors
```javascript
try {
  await uploadFile(file);
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error
    const detail = error.response.data.detail;
    if (detail.includes('size')) {
      alert('File is too large');
    } else if (detail.includes('type')) {
      alert('File type not allowed');
    }
  }
}
```

### Network Errors
```javascript
try {
  await apiFunction();
} catch (error) {
  if (!error.response) {
    // Network error (no response from server)
    alert('Network error. Please check your connection.');
  }
}
```

---

## Complete Usage Example

### File Upload with Full Error Handling
```javascript
import { uploadFile, formatFileSize } from './utils/api';

async function handleFileUpload(file) {
  // Validate file
  if (!file) {
    alert('Please select a file');
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    alert('File is too large (max 100MB)');
    return;
  }

  try {
    // Show loading state
    setUploading(true);
    setError(null);

    // Upload file
    const result = await uploadFile(file);

    // Show success
    alert(`File uploaded successfully!\n` +
          `URL: ${result.short_url}\n` +
          `Size: ${formatFileSize(result.file_size)}\n` +
          `Max downloads: ${result.max_downloads}`);

    // Clear input
    fileInput.value = '';

  } catch (error) {
    // Handle errors
    const message = error.response?.data?.detail || 'Upload failed';
    setError(message);

  } finally {
    // Hide loading state
    setUploading(false);
  }
}
```

### File Download with Folder Selection
```javascript
import { downloadFile } from './utils/api';

async function handleBulkDownload(selectedFiles) {
  try {
    // Request folder selection once
    const dirHandle = await window.showDirectoryPicker();

    let successCount = 0;
    let failCount = 0;

    // Download each file to selected folder
    for (const file of selectedFiles) {
      try {
        const response = await downloadFile(file.short_id);
        const blob = new Blob([response.data]);

        // Save to selected folder
        const fileHandle = await dirHandle.getFileHandle(
          file.original_filename,
          { create: true }
        );
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        successCount++;

      } catch (err) {
        failCount++;
        console.error(`Failed to download ${file.original_filename}:`, err);
      }
    }

    // Show result
    alert(`Downloaded ${successCount} files successfully\n` +
          (failCount > 0 ? `${failCount} failed` : ''));

  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled folder selection
      return;
    }
    alert('Download failed: ' + error.message);
  }
}
```

---

## TypeScript Type Definitions

For TypeScript projects, here are the type definitions:

```typescript
// User types
interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// File types
interface FileMetadata {
  short_id: string;
  original_filename: string;
  file_size: number;
  download_count: number;
  max_downloads: number;
  remaining_downloads: number;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

interface UploadResult {
  short_id: string;
  short_url: string;
  original_filename: string;
  file_size: number;
  max_downloads: number;
  created_at: string;
  expires_at: string;
}

// Log types
interface DownloadLog {
  id: number;
  user_id: number;
  username: string;
  filename: string;
  downloaded_at: string;
  ip_address: string;
}

// API response types
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface FilesResponse {
  files: FileMetadata[];
}

interface LogsResponse {
  logs: DownloadLog[];
}

interface MessageResponse {
  message: string;
}
```

---

## Rate Limiting and Best Practices

### Recommended Practices
1. **Debounce User Input**: Wait for user to stop typing before API calls
2. **Show Loading States**: Always show loading indicators for async operations
3. **Handle Errors Gracefully**: Display user-friendly error messages
4. **Implement Retry Logic**: Retry failed requests with exponential backoff
5. **Cache When Possible**: Store file lists in state to avoid redundant calls
6. **Validate Before Sending**: Client-side validation before API calls

### Example: Debounced Search
```javascript
import { useState, useEffect } from 'react';
import { getFiles } from './utils/api';

function FileSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(async () => {
      if (searchTerm) {
        const { files } = await getFiles();
        const filtered = files.filter(f =>
          f.original_filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFiles(filtered);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search files..."
    />
  );
}
```

---

## Environment Configuration

### Development
```env
# .env.development
VITE_API_BASE_URL=http://localhost:8000
```

### Production
```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Usage in Code
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API URL:', API_BASE_URL);
```

---

## Testing Examples

### Mock API Calls for Testing
```javascript
import { vi } from 'vitest';
import * as api from './utils/api';

// Mock successful login
vi.spyOn(api, 'login').mockResolvedValue({
  access_token: 'mock-token',
  user: { id: 1, username: 'testuser', email: 'test@example.com', is_admin: false }
});

// Mock failed login
vi.spyOn(api, 'login').mockRejectedValue({
  response: { status: 401, data: { detail: 'Invalid credentials' }}
});

// Test component
test('handles login error', async () => {
  render(<Auth />);
  // ... test logic
});
```

---

This API reference provides complete documentation for all frontend API functions and usage patterns in the file sharing application.
