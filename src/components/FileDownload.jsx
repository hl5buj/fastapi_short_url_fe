import React, { useState, useEffect } from 'react';
import { getFiles, downloadFile, formatFileSize, formatDate, getFileTypeCategory, resetFileDownloads, isAdmin, deleteFile } from '../utils/api';

const FileDownload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFiles();
      setFiles(data.files || []);
    } catch (err) {
      setError('파일 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (shortId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(shortId)) {
      newSelected.delete(shortId);
    } else {
      newSelected.add(shortId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    const filteredFileIds = getFilteredFiles().map(f => f.short_id);
    if (filteredFileIds.every(id => selectedFiles.has(id))) {
      filteredFileIds.forEach(id => selectedFiles.delete(id));
      setSelectedFiles(new Set(selectedFiles));
    } else {
      setSelectedFiles(new Set([...selectedFiles, ...filteredFileIds]));
    }
  };

  const handleDownloadClick = () => {
    if (selectedFiles.size === 0) {
      setError('다운로드할 파일을 선택해주세요.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmDownload = async () => {
    setShowConfirm(false);
    setDownloading(true);
    setError(null);

    const selectedFileObjects = files.filter(f => selectedFiles.has(f.short_id));
    let successCount = 0;
    let failCount = 0;
    const failedFiles = [];

    // File System Access API를 사용하여 폴더 선택 (한 번만)
    let dirHandle = null;
    if ('showDirectoryPicker' in window && selectedFileObjects.length > 1) {
      try {
        dirHandle = await window.showDirectoryPicker();
      } catch (err) {
        if (err.name === 'AbortError') {
          setDownloading(false);
          return; // 사용자가 취소한 경우
        }
        console.error('Directory picker error:', err);
      }
    }

    for (const file of selectedFileObjects) {
      try {
        const response = await downloadFile(file.short_id);
        const blob = new Blob([response.data]);

        if (dirHandle) {
          // 선택한 폴더에 파일 저장
          const fileHandle = await dirHandle.getFileHandle(file.original_filename, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } else {
          // Fallback: 기본 다운로드 방식
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.original_filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }

        successCount++;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error('Download error:', err);
        failCount++;
        failedFiles.push(file.original_filename);
      }
    }

    setDownloading(false);
    setSelectedFiles(new Set());
    await loadFiles();

    if (failCount > 0) {
      setError(`${failCount}개 파일 다운로드 실패 (성공: ${successCount}개)\n실패한 파일: ${failedFiles.join(', ')}`);
    } else {
      setError(null);
      if (dirHandle) {
        alert(`${successCount}개 파일이 선택한 폴더에 다운로드되었습니다!`);
      } else {
        alert(`${successCount}개 파일이 다운로드되었습니다.\n\n💡 저장 위치는 브라우저 설정에서 변경할 수 있습니다.\n(설정 > 다운로드 > 다운로드 전 저장 위치 묻기)`);
      }
    }
  };

  const handleResetDownloads = async (file, e) => {
    e.stopPropagation();

    const newLimit = prompt(`"${file.original_filename}"의 다운로드 제한을 입력하세요:`, file.max_downloads);
    if (newLimit === null) return; // 취소

    const limitNum = parseInt(newLimit);
    if (isNaN(limitNum) || limitNum < 1) {
      setError('다운로드 제한은 1 이상의 숫자여야 합니다.');
      return;
    }

    try {
      await resetFileDownloads(file.short_id, limitNum);
      await loadFiles();
      alert(`다운로드 제한이 ${limitNum}회로 재설정되었습니다!`);
    } catch (err) {
      console.error('Reset error:', err);
      setError(`제한 재설정 실패: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleDeleteFile = async (file, e) => {
    e.stopPropagation();

    if (!confirm(`"${file.original_filename}" 파일을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteFile(file.short_id);
      await loadFiles();
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.short_id);
        return newSet;
      });
      alert(`"${file.original_filename}" 파일이 삭제되었습니다.`);
    } catch (err) {
      console.error('Delete error:', err);
      setError(`파일 삭제 실패: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleSingleDownload = async (file, e) => {
    e.stopPropagation();

    try {
      const response = await downloadFile(file.short_id);
      const blob = new Blob([response.data]);

      // File System Access API 지원 확인
      if ('showSaveFilePicker' in window) {
        try {
          // 파일 확장자 추출
          const fileExt = file.original_filename.split('.').pop();
          const acceptTypes = fileExt ? {
            description: 'File',
            accept: { '*/*': [`.${fileExt}`] }
          } : undefined;

          const handle = await window.showSaveFilePicker({
            suggestedName: file.original_filename,
            types: acceptTypes ? [acceptTypes] : []
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          await loadFiles();
          alert(`"${file.original_filename}" 다운로드 완료!`);
        } catch (err) {
          if (err.name === 'AbortError') {
            return; // 사용자가 취소한 경우
          }
          throw err;
        }
      } else {
        // Fallback: 기본 다운로드 방식
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.original_filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        await loadFiles();
        alert(`"${file.original_filename}" 다운로드 완료!\n\n💡 파일은 브라우저 기본 다운로드 폴더에 저장됩니다.`);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError(`"${file.original_filename}" 다운로드 실패: ${err.response?.data?.detail || err.message}`);
    }
  };

  const getFilteredFiles = () => {
    if (filter === 'all') return files;
    return files.filter(file => getFileTypeCategory(file.original_filename) === filter);
  };

  const getFileIcon = (filename) => {
    const category = getFileTypeCategory(filename);
    const icons = {
      '이미지': '🖼️',
      '비디오': '🎥',
      '오디오': '🎵',
      '문서': '📄',
      '압축파일': '📦',
      '코드': '💻',
      '기타': '📁'
    };
    return icons[category] || '📁';
  };

  const categories = ['all', '이미지', '비디오', '오디오', '문서', '압축파일', '코드', '기타'];
  const filteredFiles = getFilteredFiles();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-primary-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-surface-600">파일 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* 확인 다이얼로그 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-3">다운로드 확인</h3>
            <div className="mb-4">
              <p className="text-xs text-surface-700 mb-3">선택한 {selectedFiles.size}개의 파일을 다운로드하시겠습니까?</p>
              <div className="bg-surface-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                {files.filter(f => selectedFiles.has(f.short_id)).map(file => (
                  <div key={file.short_id} className="flex items-center gap-2 py-1.5 border-b border-surface-200 last:border-0">
                    <span className="text-xl">{getFileIcon(file.original_filename)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-900 break-all">{file.original_filename}</p>
                      <p className="text-xs text-surface-500">{formatFileSize(file.file_size)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>파일 저장:</strong> 다운로드 버튼을 누르면 폴더 선택 창이 열립니다. 원하는 폴더를 선택하면 모든 파일이 해당 폴더에 저장됩니다.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-surface-200 text-surface-700 rounded-lg text-sm font-semibold hover:bg-surface-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDownload}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-600 to-primary-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-surface-900">파일 다운로드</h2>
          <button
            onClick={loadFiles}
            className="p-1.5 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
            title="새로고침"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200'
                }`}
              >
                {cat === 'all' ? '전체' : cat}
              </button>
            ))}
          </div>

          {filteredFiles.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-600">
                {selectedFiles.size}개 선택됨
              </span>
              <button
                onClick={handleSelectAll}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                {filteredFiles.every(f => selectedFiles.has(f.short_id)) ? '전체 해제' : '전체 선택'}
              </button>
              <button
                onClick={handleDownloadClick}
                disabled={downloading || selectedFiles.size === 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  downloading || selectedFiles.size === 0
                    ? 'bg-surface-300 text-surface-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-accent-600 to-primary-600 text-white hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {downloading ? '다운로드 중...' : `다운로드 (${selectedFiles.size})`}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            {filter === 'all' ? '저장된 파일이 없습니다' : `${filter} 파일이 없습니다`}
          </h3>
          <p className="text-xs text-surface-600">파일을 업로드하면 여기에 표시됩니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map(file => {
            const isSelected = selectedFiles.has(file.short_id);

            return (
              <div
                key={file.short_id}
                className={`bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                  isSelected
                    ? 'border-primary-500 shadow-md'
                    : 'border-surface-200 hover:border-primary-300'
                }`}
              >
                <div
                  className="relative aspect-video bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSelectFile(file.short_id)}
                >
                  <span className="text-5xl">{getFileIcon(file.original_filename)}</span>

                  <div className="absolute top-2 right-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-surface-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      file.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {file.is_active ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-surface-900 mb-2 break-all">
                    {file.original_filename}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-surface-600 mb-2">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{file.download_count}/{file.max_downloads}</span>
                  </div>
                  <div className="mb-2 pt-2 border-t border-surface-100">
                    <p className="text-xs text-surface-500">
                      {formatDate(file.created_at)}
                    </p>
                  </div>
                  {isAdmin() && (
                    <>
                      <button
                        onClick={(e) => handleResetDownloads(file, e)}
                        className="w-full px-3 py-1.5 mb-1.5 rounded-lg font-semibold transition-all text-xs bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        🔄 제한 재설정
                      </button>
                      <button
                        onClick={(e) => handleDeleteFile(file, e)}
                        className="w-full px-3 py-1.5 mb-1.5 rounded-lg font-semibold transition-all text-xs bg-red-500 text-white hover:bg-red-600"
                      >
                        🗑️ 파일 삭제
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => handleSingleDownload(file, e)}
                    disabled={!file.is_active || file.remaining_downloads === 0}
                    className={`w-full px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
                      !file.is_active || file.remaining_downloads === 0
                        ? 'bg-surface-200 text-surface-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-md hover:scale-[1.02]'
                    }`}
                  >
                    {!file.is_active || file.remaining_downloads === 0 ? '다운로드 불가' : '⬇️ 바로 다운로드'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileDownload;
