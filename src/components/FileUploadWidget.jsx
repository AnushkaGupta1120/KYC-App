import React, { useState } from 'react';
import { X, File, FileText, Image, Music, AlertCircle } from 'lucide-react';
import FileHandler from '../utils/fileHandler';

const FileUploadWidget = ({ 
  field, 
  onFilesSelected, 
  acceptedFormats = '*',
  maxFiles = null,
  multiple = true,
  showFileList = true
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    processFiles(e.target.files);
  };

  const processFiles = (fileList) => {
    const fileArray = Array.from(fileList);
    
    // Respect maxFiles limit
    const filesToProcess = maxFiles 
      ? fileArray.slice(0, maxFiles - files.length)
      : fileArray;

    // Validate files
    const validation = FileHandler.validateFiles(filesToProcess);
    
    if (validation.hasErrors) {
      setErrors(validation.errors);
    } else {
      setErrors([]);
    }

    // Add valid files
    if (validation.validFiles.length > 0) {
      const newFiles = validation.validFiles.map(v => v.file);
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      onFilesSelected(newFiles, field);
    }
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected(updated, field);
  };

  const getFileIcon = (filename) => {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return <Image size={16} className="text-blue-500" />;
    }
    if (ext === '.pdf') {
      return <FileText size={16} className="text-red-500" />;
    }
    return <File size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 bg-white hover:border-indigo-400'
        }`}
      >
        <input
          type="file"
          id={`file-input-${field}`}
          onChange={handleFileInput}
          accept={acceptedFormats}
          multiple={multiple}
          className="hidden"
        />
        <label htmlFor={`file-input-${field}`} className="cursor-pointer block">
          <div className="text-sm font-medium text-gray-700">
            Drag & drop files here or click to browse
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {maxFiles && `Up to ${maxFiles} file(s)`}
          </div>
        </label>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
          {errors.map((error, i) => (
            <div key={i} className="flex gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                <strong>{error.filename}</strong>: {error.errors.join(', ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {showFileList && files.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-600">
            {files.length} file(s) selected
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-gray-700 font-medium">
                      {file.name}
                    </div>
                    <div className="text-gray-500">
                      {FileHandler.formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadWidget;
