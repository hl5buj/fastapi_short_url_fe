import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import Auth from './components/Auth';
import DownloadLogs from './components/DownloadLogs';
import { isLoggedIn, isAdmin, getUser, logout, changePassword } from './utils/api';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setUser(getUser());
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUser(null);
    setActiveTab('upload');
    setShowUserMenu(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.detail || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-accent-50/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-3 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
                Short<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Share</span>
              </h1>
              <p className="text-sm text-surface-600 max-w-2xl mx-auto">
                간편하고 빠른 파일 공유 서비스
              </p>
            </div>

            {loggedIn && user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow border border-surface-200 hover:shadow-md transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-surface-900">{user.username}</div>
                    {user.is_admin && (
                      <div className="text-xs text-primary-600">관리자</div>
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-200 overflow-hidden z-10">
                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      비밀번호 변경
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Tab Navigation */}
        {loggedIn && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow border border-surface-200 p-1">
              <div className={`grid ${isAdmin() ? 'grid-cols-3' : 'grid-cols-2'} gap-1`}>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    파일 업로드
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('download')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'download'
                      ? 'bg-gradient-to-r from-accent-600 to-primary-600 text-white shadow'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    파일 다운로드
                  </div>
                </button>
                {isAdmin() && (
                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      activeTab === 'logs'
                        ? 'bg-gradient-to-r from-accent-600 to-primary-600 text-white shadow'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      다운로드 로그
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-surface-900 mb-4">비밀번호 변경</h2>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5">현재 비밀번호</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5">새 비밀번호</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5">새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                    비밀번호가 성공적으로 변경되었습니다!
                  </div>
                )}
                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-3 py-2 text-sm bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        <main>
          {!loggedIn ? (
            <Auth onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {activeTab === 'upload' && <FileUpload />}
              {activeTab === 'download' && <FileDownload />}
              {activeTab === 'logs' && isAdmin() && <DownloadLogs />}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-surface-200">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-surface-600">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>안전한 전송</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>24시간 자동 삭제</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>빠른 업로드</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-surface-200">
                <p className="text-xs text-surface-500">
                  FastAPI + React 파일 공유 서비스
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
