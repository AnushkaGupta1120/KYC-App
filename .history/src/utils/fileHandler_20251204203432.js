/**
 * File Upload Handler Utility
 * Handles file and folder uploads with validation and metadata extraction
 */

export const FileHandler = {
  /**
   * Supported file types for KYC documents
   */
  SUPPORTED_FORMATS: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],

  SUPPORTED_EXTENSIONS: [
    '.jpg', '.jpeg', '.png', '.webp',
    '.pdf',
    '.doc', '.docx',
    '.xls', '.xlsx',
    '.txt'
  ],

  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB

  /**
   * Validate a single file
   */
  validateFile(file) {
    const errors = [];
    
    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Check file type
    const isValidType = this.SUPPORTED_FORMATS.includes(file.type) ||
                       this.SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      errors.push(`File type not supported. Allowed: ${this.SUPPORTED_EXTENSIONS.join(', ')}`);
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate multiple files
   */
  validateFiles(files) {
    const results = [];
    const errors = [];

    files.forEach((file, index) => {
      const validation = this.validateFile(file);
      if (validation.valid) {
        results.push({
          index,
          file,
          valid: true
        });
      } else {
        errors.push({
          filename: file.name,
          errors: validation.errors
        });
      }
    });

    return { validFiles: results, errors, hasErrors: errors.length > 0 };
  },

  /**
   * Extract file metadata
   */
  extractMetadata(file) {
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified).toLocaleString(),
      extension: file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    };
  },

  /**
   * Extract metadata for multiple files
   */
  extractMetadataArray(files) {
    return files.map(file => this.extractMetadata(file));
  },

  /**
   * Format file size to human readable format
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Create a file summary for display
   */
  createFileSummary(files) {
    const fileArray = Array.isArray(files) ? files : [files];
    const totalSize = fileArray.reduce((sum, f) => sum + f.size, 0);
    
    return {
      fileCount: fileArray.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatFileSize(totalSize),
      files: this.extractMetadataArray(fileArray),
      summary: `${fileArray.length} file(s) - ${this.formatFileSize(totalSize)}`
    };
  },

  /**
   * Read file as data URL (for preview/preview purposes)
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Read file as text
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  },

  /**
   * Read multiple files
   */
  async readMultipleFiles(files, readType = 'dataURL') {
    const results = [];
    for (const file of files) {
      try {
        const data = readType === 'text' 
          ? await this.readFileAsText(file)
          : await this.readFileAsDataURL(file);
        results.push({ file, data, success: true });
      } catch (error) {
        results.push({ file, error, success: false });
      }
    }
    return results;
  },

  /**
   * Process folder structure (simulated - browsers can't access real folder structure)
   * This creates a virtual folder representation
   */
  processFolderUpload(files) {
    // Group files by directory path (if available)
    const structure = {
      files: [],
      folderCount: 0,
      totalFiles: files.length
    };

    files.forEach(file => {
      // Extract relative path if available (web API limitation: only filename available)
      const metadata = this.extractMetadata(file);
      structure.files.push(metadata);
    });

    return structure;
  }
};

export default FileHandler;
