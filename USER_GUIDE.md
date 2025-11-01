# User Guide - ShortShare File Sharing Application

Complete guide for using the ShortShare file sharing application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Features](#user-features)
3. [Admin Features](#admin-features)
4. [Tips and Best Practices](#tips-and-best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Creating an Account

1. **Open the application** in your web browser
2. **Click "회원가입" (Sign Up)** at the bottom of the login form
3. **Fill in your information:**
   - Username (unique identifier)
   - Email address (valid email)
   - Password (minimum 6 characters)
4. **Click "회원가입" button** to create your account
5. You'll be **automatically logged in** after registration

### Logging In

1. **Enter your username** in the first field
2. **Enter your password** in the second field
3. **Click "로그인" button**
4. If successful, you'll see the file upload page

### Logging Out

1. **Click your profile icon** in the top-right corner
2. **Select "로그아웃" (Logout)** from the menu
3. You'll be redirected to the login page

---

## User Features

### Uploading Files

#### Method 1: Drag and Drop
1. Navigate to the **"파일 업로드" (File Upload)** tab
2. **Drag a file** from your computer
3. **Drop it** in the blue dashed area
4. **Click "업로드" button** to upload

#### Method 2: Click to Select
1. Navigate to the **"파일 업로드" tab**
2. **Click the blue dashed area**
3. **Select a file** from the file picker dialog
4. **Click "업로드" button** to upload

#### Upload Result
After uploading, you'll see:
- ✅ Success message
- File name and size
- Maximum download limit (default: varies)
- Expiration time (24 hours)

**Important Notes:**
- Files expire after **24 hours**
- Files have a **download limit** (varies by file)
- All file types are supported

---

### Downloading Files

#### Viewing Available Files
1. Navigate to the **"파일 다운로드" (File Download)** tab
2. You'll see all available files in a **grid layout**
3. Each file card shows:
   - File type icon
   - File name
   - File size
   - Download count (used/total)
   - Upload date
   - Status (활성/비활성)

#### Filtering Files
Use the **category buttons** at the top to filter:
- **전체** - All files
- **이미지** - Images (jpg, png, gif, etc.)
- **비디오** - Videos (mp4, avi, mov, etc.)
- **오디오** - Audio (mp3, wav, ogg, etc.)
- **문서** - Documents (pdf, doc, xls, txt, etc.)
- **압축파일** - Archives (zip, rar, 7z, etc.)
- **코드** - Code files (js, py, html, etc.)
- **기타** - Other file types

#### Downloading a Single File
1. **Click the file card** you want to download
2. **Click "⬇️ 바로 다운로드" button**
3. **Choose save location** in the dialog
4. File will be downloaded to selected location

**Note:** If your browser doesn't support the save dialog, files will be downloaded to your default download folder.

#### Downloading Multiple Files
1. **Click the checkboxes** on files you want to download
2. Selected files will be **highlighted in blue**
3. **Click "다운로드 (X)" button** at the top
   - (X) shows how many files are selected
4. **Review the file list** in the confirmation dialog
5. **Click "다운로드" button**
6. **Select a folder** where all files will be saved
7. Wait for downloads to complete
8. You'll see a **success message** with count

**Tips:**
- Use **"전체 선택"** to select all visible files
- Use **"전체 해제"** to deselect all files
- Filter by category first, then select all for targeted bulk downloads

---

### Changing Your Password

1. **Click your profile icon** in the top-right corner
2. **Select "비밀번호 변경"** from the menu
3. In the modal dialog:
   - Enter your **current password**
   - Enter your **new password** (min 6 characters)
   - **Confirm your new password**
4. **Click "변경하기" button**
5. If successful, you'll see a **success message**
6. Modal will **close automatically** after 2 seconds

**Password Requirements:**
- Minimum 6 characters
- New password and confirmation must match
- Current password must be correct

**Error Messages:**
- "현재 비밀번호가 일치하지 않습니다" - Current password is wrong
- "새 비밀번호가 일치하지 않습니다" - New passwords don't match
- "새 비밀번호는 최소 6자 이상이어야 합니다" - Password too short

---

## Admin Features

### Admin Dashboard Access
Admin users will see an **additional tab** called "다운로드 로그" (Download Logs).

### Viewing Download Logs

1. **Navigate to "다운로드 로그" tab**
2. You'll see a **table** with all download activity:
   - User who downloaded
   - File name
   - Download timestamp
   - IP address

### Deleting Download Logs

#### Deleting a Single Log
1. Find the log entry you want to delete
2. **Click the trash icon** in the "작업" column
3. **Confirm deletion** in the dialog
4. Log will be removed from the list

#### Bulk Deleting Logs
1. **Check the boxes** next to logs you want to delete
2. Selected rows will be **highlighted in blue**
3. **Click "선택 항목 삭제 (X)" button** at the top
   - (X) shows how many logs are selected
4. **Confirm deletion** in the dialog
5. Wait for deletion to complete
6. You'll see a **success message** with count

**Selection Features:**
- **Check the header checkbox** to select/deselect all logs
- **Individual checkboxes** for selecting specific logs
- **Blue highlighting** shows selected logs
- **Counter** shows "X개 선택됨" (X selected)

### Managing Files (Admin Only)

Admin users see **additional buttons** on each file card:

#### Resetting Download Limits
1. **Find the file** you want to reset
2. **Click "🔄 제한 재설정" button**
3. **Enter new download limit** in the prompt
4. **Click OK** to confirm
5. File's download count will be **reset to 0**
6. File's max downloads will be **updated** to new limit

**Use Cases:**
- User needs more downloads for a file
- File was downloaded by mistake
- Increase limit for important files

#### Deleting Files
1. **Find the file** you want to delete
2. **Click "🗑️ 파일 삭제" button**
3. **Confirm deletion** in the dialog
   - Warning: "이 작업은 되돌릴 수 없습니다"
4. File will be **permanently deleted**
5. You'll see a **confirmation message**

**Warning:** File deletion is **permanent** and **cannot be undone**.

---

## Tips and Best Practices

### File Upload Tips
1. **Check file size** before uploading
2. **Use descriptive filenames** for easy identification
3. **Compress large files** (zip) before uploading
4. **Upload important files early** (they expire in 24 hours)

### Download Tips
1. **Download important files immediately**
2. **Use bulk download** for multiple files to save time
3. **Check remaining downloads** before downloading
4. **Filter by category** to find files faster

### Password Security
1. **Use strong passwords** (mix of letters, numbers, symbols)
2. **Change password regularly**
3. **Don't share your password**
4. **Log out on shared computers**

### For Administrators
1. **Monitor download logs** regularly
2. **Delete old logs** to keep database clean
3. **Reset download limits** when users need access
4. **Remove inactive files** to free up storage
5. **Check for suspicious activity** in download logs

---

## Troubleshooting

### Login Issues

#### "Invalid credentials" Error
- **Check username spelling** (case-sensitive)
- **Check password** (case-sensitive)
- **Try resetting your password** (contact admin)

#### "Connection error"
- **Check internet connection**
- **Try refreshing the page**
- **Check if backend server is running**

### Upload Issues

#### Upload Fails
- **Check file size** (may exceed limit)
- **Check internet connection**
- **Try a different file**
- **Refresh page and try again**

#### "No file selected" Error
- **Make sure you selected a file**
- **Try using click-to-upload** instead of drag-drop
- **Check file permissions**

### Download Issues

#### "Download failed" Error
- **File may have expired** (24-hour limit)
- **Download limit may be reached**
- **Check internet connection**
- **Try again later**

#### File Not Downloading
- **Check browser download settings**
- **Check if downloads are blocked**
- **Try a different browser**
- **Check available disk space**

#### Folder Selection Doesn't Work
- **Your browser may not support this feature**
- Files will download to **default folder** instead
- **Update your browser** to latest version
- **Use Chrome or Edge** for best experience

### Password Change Issues

#### "Current password incorrect"
- **Double-check your current password**
- **Make sure Caps Lock is off**
- **Contact admin if you forgot password**

#### "Password too short" Error
- **Use at least 6 characters**
- **Include letters and numbers** for security

#### "Passwords don't match" Error
- **Carefully re-enter new password**
- **Make sure confirmation matches exactly**

### Admin Issues

#### Can't See Admin Features
- **Check if you have admin privileges**
- **Log out and log back in**
- **Contact system administrator**

#### Bulk Delete Fails
- **Check internet connection**
- **Try deleting fewer items at once**
- **Refresh page and try again**

### General Issues

#### Page Not Loading
- **Refresh the page** (F5 or Ctrl+R)
- **Clear browser cache**
- **Try a different browser**
- **Check if backend is running**

#### Session Expired
- **You'll be auto-logged out** after inactivity
- **Simply log back in** to continue
- **Your data is safe**

#### Visual Glitches
- **Refresh the page**
- **Try zooming to 100%** (Ctrl+0)
- **Clear browser cache**
- **Update your browser**

---

## Keyboard Shortcuts

### General Navigation
- **Tab** - Move to next field/button
- **Shift + Tab** - Move to previous field/button
- **Enter** - Submit form / Click focused button
- **Escape** - Close modal dialogs

### File Selection
- **Click + Shift + Click** - Select range of files
- **Ctrl + Click** (Windows) / **Cmd + Click** (Mac) - Toggle individual selection

---

## Browser Compatibility

### Fully Supported (All Features)
- ✅ **Chrome 90+**
- ✅ **Edge 90+**
- ✅ **Opera 75+**

### Supported (Fallback Mode)
- ⚠️ **Firefox 88+** (No folder selection)
- ⚠️ **Safari 14+** (No folder selection)

### Not Supported
- ❌ **Internet Explorer** (Use Edge instead)
- ❌ **Older browsers** (Update to latest version)

**Note:** Fallback mode means files download to default folder instead of allowing you to choose location.

---

## Mobile Usage

### Responsive Design
The application works on **mobile devices**, but some features are **limited**:

- ✅ File upload (tap to select)
- ✅ File download (single files)
- ✅ Login/logout
- ✅ Password change
- ⚠️ Bulk download (limited)
- ⚠️ Admin features (better on desktop)

### Mobile Tips
1. **Use portrait orientation** for best layout
2. **Tap and hold** for file options
3. **Use browser menu** to access downloads
4. **Switch to desktop** for bulk operations

---

## Frequently Asked Questions

### How long do files stay available?
Files are automatically deleted after **24 hours** from upload.

### Can I extend file expiration?
No, all files expire after 24 hours. **Download important files** before they expire.

### What happens when download limit is reached?
The file becomes **inactive** and cannot be downloaded. Admins can **reset the limit**.

### Can I upload multiple files at once?
Currently, you can only upload **one file at a time**. Upload each file separately.

### What's the maximum file size?
File size limits are set by the administrator. **Try uploading** to see if your file is accepted.

### Can I delete my own uploaded files?
Only **administrators** can delete files. Contact your admin if you need a file removed.

### How do I become an administrator?
Admin privileges are granted by the **system administrator**. Contact them to request access.

### Is my data secure?
- All communication uses **HTTPS** (in production)
- Passwords are **hashed** and never stored in plain text
- **JWT tokens** for secure authentication
- Files expire after 24 hours

### Can I download a file multiple times?
Yes, until the **download limit is reached**. Each download counts toward the limit.

### What if I forgot my password?
Contact your **system administrator** to reset your password.

### Can I share files with non-users?
Currently, only **logged-in users** can download files. Share the short URL with other registered users.

---

## Contact and Support

### Getting Help
1. **Check this user guide** for common solutions
2. **Try the troubleshooting section**
3. **Contact your system administrator**
4. **Report bugs** to the development team

### Providing Feedback
We welcome your feedback! Contact us about:
- Feature requests
- Bug reports
- Usability issues
- General suggestions

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** November 2025
**Platform:** Web Application (React + FastAPI)

---

## Legal and Privacy

### Data Privacy
- Your **personal information** is stored securely
- **Download logs** track file access (admin visible)
- **IP addresses** are logged for security
- **Files expire** after 24 hours

### Terms of Use
- Files are for **personal or business use** only
- Do not upload **illegal content**
- Do not share your **login credentials**
- Files may be **removed** by administrators

---

## Quick Reference Card

### Common Tasks

| Task | Steps |
|------|-------|
| **Upload file** | Upload tab → Drag file or click → Upload button |
| **Download file** | Download tab → Click file → Download button |
| **Bulk download** | Select checkboxes → Click download button → Choose folder |
| **Change password** | Profile menu → Password change → Enter passwords |
| **Filter files** | Click category buttons (이미지, 문서, etc.) |
| **Admin: Delete log** | Logs tab → Select logs → Delete button |
| **Admin: Reset limit** | Find file → Reset button → Enter new limit |

### Button Guide

| Button | Meaning |
|--------|---------|
| **로그인** | Login |
| **회원가입** | Sign up / Register |
| **로그아웃** | Logout |
| **업로드** | Upload |
| **다운로드** | Download |
| **비밀번호 변경** | Change password |
| **파일 업로드** | File upload (tab) |
| **파일 다운로드** | File download (tab) |
| **다운로드 로그** | Download logs (admin tab) |
| **전체 선택** | Select all |
| **전체 해제** | Deselect all |
| **선택 항목 삭제** | Delete selected |
| **제한 재설정** | Reset download limit |
| **파일 삭제** | Delete file |
| **바로 다운로드** | Direct download |

---

## Changelog

### Version 1.0.0 (November 2025)
**Initial Release**
- ✅ User authentication (login/register)
- ✅ File upload with drag-and-drop
- ✅ File download (single and bulk)
- ✅ Download logs (admin)
- ✅ Password change
- ✅ File management (admin)
- ✅ Professional, compact design
- ✅ Responsive mobile layout

---

This user guide covers all features of the ShortShare file sharing application. For technical documentation, see `IMPLEMENTATION_SUMMARY.md` and `API_REFERENCE.md`.
