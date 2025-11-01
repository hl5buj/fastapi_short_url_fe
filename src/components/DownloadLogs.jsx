import React, { useState, useEffect } from 'react';
import { getDownloadLogs, formatDate, deleteDownloadLog } from '../utils/api';

const DownloadLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLogs, setSelectedLogs] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getDownloadLogs();
      setLogs(data.logs || []);
    } catch (err) {
      setError(err.response?.data?.detail || '로그를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLog = (logId) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLogs.size === logs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(logs.map(log => log.id)));
    }
  };

  const handleDelete = async (logId) => {
    if (!confirm('이 로그를 삭제하시겠습니까?')) return;

    try {
      await deleteDownloadLog(logId);
      setLogs(logs.filter(log => log.id !== logId));
      setSelectedLogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(logId);
        return newSet;
      });
    } catch (err) {
      alert(err.response?.data?.detail || '로그 삭제에 실패했습니다.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLogs.size === 0) {
      alert('삭제할 로그를 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedLogs.size}개의 로그를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const logId of selectedLogs) {
      try {
        await deleteDownloadLog(logId);
        successCount++;
      } catch (err) {
        failCount++;
        console.error('Delete error:', err);
      }
    }

    setDeleting(false);
    setSelectedLogs(new Set());
    await loadLogs();

    if (failCount > 0) {
      alert(`${successCount}개 삭제 완료, ${failCount}개 실패`);
    } else {
      alert(`${successCount}개의 로그가 삭제되었습니다.`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft border border-surface-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-surface-600">로그 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft border border-surface-200 p-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow border border-surface-200">
        <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-900">다운로드 로그</h2>
            <p className="text-xs text-surface-600 mt-0.5">총 {logs.length}개 | 선택됨 {selectedLogs.size}개</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedLogs.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : `선택 항목 삭제 (${selectedLogs.size})`}
              </button>
            )}
            <button
              onClick={loadLogs}
              className="p-1.5 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded transition-colors"
              title="새로고침"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={logs.length > 0 && selectedLogs.size === logs.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-700 uppercase">사용자</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-700 uppercase">파일명</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-700 uppercase">다운로드 시각</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-700 uppercase">IP</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-surface-700 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-8 text-center text-sm text-surface-500">
                    다운로드 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className={`hover:bg-surface-50 transition-colors ${selectedLogs.has(log.id) ? 'bg-primary-50' : ''}`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedLogs.has(log.id)}
                        onChange={() => handleSelectLog(log.id)}
                        className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                          {log.username ? log.username[0].toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs font-medium text-surface-900">{log.username || '알 수 없음'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 max-w-xs">
                      <div className="text-xs text-surface-900 truncate" title={log.filename}>
                        {log.filename || '알 수 없음'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-xs text-surface-700">{formatDate(log.downloaded_at)}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <code className="text-xs text-surface-600 bg-surface-50 px-1.5 py-0.5 rounded">{log.ip_address || '-'}</code>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DownloadLogs;
