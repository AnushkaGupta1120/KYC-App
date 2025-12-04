/**
 * File Upload Integration Examples
 * This file demonstrates how to use the file upload features in the KYC app
 */

// ============================================
// Example 1: Basic File Upload Handling
// ============================================
import FileHandler from './utils/fileHandler';

// Handle files in component
const handleFilesSelected = (files, field) => {
  // Validate files
  const validation = FileHandler.validateFiles(files);
  
  if (validation.hasErrors) {
    console.error('Invalid files:', validation.errors);
    // Show error to user
    return;
  }

  // Create summary
  const summary = FileHandler.createFileSummary(files);
  console.log('Upload Summary:', summary);
  // Output: { fileCount: 2, totalSize: 2048000, totalSizeFormatted: "1.95 MB", ... }

  // Update form state
  setFormData(prev => ({
    ...prev,
    [field]: summary
  }));
};

// ============================================
// Example 2: Using FileUploadWidget Component
// ============================================
import FileUploadWidget from './components/FileUploadWidget';

function MyDocumentForm() {
  const [documents, setDocuments] = useState([]);

  const handleDocumentUpload = (files, field) => {
    setDocuments(prev => [...prev, ...files]);
    
    // Process files
    FileHandler.readMultipleFiles(files, 'dataURL').then(results => {
      console.log('Files processed:', results);
      // results: [{ file, data, success }]
    });
  };

  return (
    <div>
      <h2>Upload Documents</h2>
      <FileUploadWidget
        field="documents"
        onFilesSelected={handleDocumentUpload}
        acceptedFormats=".pdf,image/*,.doc,.docx"
        maxFiles={10}
        multiple={true}
        showFileList={true}
      />
      
      <div>
        <h3>Selected Files: {documents.length}</h3>
        <ul>
          {documents.map((doc, idx) => (
            <li key={idx}>
              {doc.name} - {FileHandler.formatFileSize(doc.size)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// Example 3: Server Upload Integration
// ============================================
async function uploadFilesToServer(files, uploadUrl) {
  try {
    // Create FormData
    const formData = new FormData();
    
    // Add files
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    // Add metadata
    formData.append('metadata', JSON.stringify({
      uploadedAt: new Date().toISOString(),
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    }));

    // Send to server
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Usage in KYC flow
const handleFileUpload = async (field, files) => {
  try {
    const result = await uploadFilesToServer(files, '/api/kyc/documents');
    setFormData(prev => ({
      ...prev,
      [field]: {
        status: 'uploaded',
        serverUrl: result.urls,
        uploadedAt: new Date().toISOString()
      }
    }));
  } catch (error) {
    speak('Upload failed, please try again');
  }
};

// ============================================
// Example 4: File Preview Generation
// ============================================
async function generateFilePreview(file) {
  // Check if image
  if (file.type.startsWith('image/')) {
    const dataUrl = await FileHandler.readFileAsDataURL(file);
    return {
      type: 'image',
      preview: dataUrl,
      thumbnail: dataUrl // Could be resized version
    };
  }

  // Check if PDF
  if (file.type === 'application/pdf') {
    return {
      type: 'pdf',
      preview: '📄 PDF Document',
      size: FileHandler.formatFileSize(file.size)
    };
  }

  // Check if text
  if (file.type.startsWith('text/')) {
    const text = await FileHandler.readFileAsText(file);
    const preview = text.substring(0, 100) + '...';
    return {
      type: 'text',
      preview: preview,
      fullText: text
    };
  }

  // Other file types
  return {
    type: 'document',
    preview: `${file.name} (${FileHandler.formatFileSize(file.size)})`,
    metadata: FileHandler.extractMetadata(file)
  };
}

// Usage
files.forEach(async (file) => {
  const preview = await generateFilePreview(file);
  console.log('File preview:', preview);
});

// ============================================
// Example 5: Batch File Processing
// ============================================
async function processFileBatch(files, processFn) {
  const results = [];
  let processed = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const metadata = FileHandler.extractMetadata(file);
      const processed_file = await processFn(file, metadata);
      results.push({
        file: metadata,
        result: processed_file,
        status: 'success'
      });
      processed++;
    } catch (error) {
      results.push({
        file: file.name,
        error: error.message,
        status: 'failed'
      });
      failed++;
    }
  }

  return {
    total: files.length,
    processed,
    failed,
    results
  };
}

// Usage: Convert images to WebP
const conversionFn = async (file, metadata) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Not an image');
  }
  // Convert to WebP (would need image processing library)
  return { name: file.name, format: 'webp' };
};

const batchResult = await processFileBatch(selectedFiles, conversionFn);
console.log('Batch processing complete:', batchResult);

// ============================================
// Example 6: Folder Structure Simulation
// ============================================
function simulateFolderStructure(files) {
  // Group files by extension
  const structure = {
    byExtension: {},
    bySize: [],
    total: files.length
  };

  files.forEach(file => {
    const metadata = FileHandler.extractMetadata(file);
    const ext = metadata.extension || 'unknown';
    
    // Group by extension
    if (!structure.byExtension[ext]) {
      structure.byExtension[ext] = [];
    }
    structure.byExtension[ext].push(metadata);

    // Sort by size
    structure.bySize.push({
      name: file.name,
      size: file.size,
      sizeFormatted: FileHandler.formatFileSize(file.size)
    });
  });

  structure.bySize.sort((a, b) => b.size - a.size);
  return structure;
}

// Usage
const folderStructure = simulateFolderStructure(uploadedFiles);
console.log('Folder structure:', folderStructure);
/* Output:
{
  byExtension: {
    '.pdf': [{ name: 'doc1.pdf', ... }],
    '.jpg': [{ name: 'photo1.jpg', ... }, { name: 'photo2.jpg', ... }]
  },
  bySize: [
    { name: 'large_doc.pdf', size: 5242880, sizeFormatted: '5.00 MB' },
    { name: 'photo1.jpg', size: 2097152, sizeFormatted: '2.00 MB' }
  ],
  total: 3
}
*/

// ============================================
// Example 7: Real-time Progress Tracking
// ============================================
function trackUploadProgress(files) {
  let currentIndex = 0;
  let totalBytes = 0;
  let uploadedBytes = 0;

  // Calculate total
  files.forEach(file => {
    totalBytes += file.size;
  });

  // Simulate upload progress
  const uploadProgressInterval = setInterval(() => {
    // Simulate upload (in real app, use XMLHttpRequest or Fetch with progress)
    uploadedBytes += Math.random() * totalBytes * 0.1;

    const progress = {
      currentFile: files[currentIndex]?.name,
      currentIndex: currentIndex + 1,
      totalFiles: files.length,
      uploadedBytes,
      totalBytes,
      percentage: Math.min((uploadedBytes / totalBytes) * 100, 100)
    };

    console.log(`Uploading: ${progress.percentage.toFixed(0)}%`);

    if (uploadedBytes >= totalBytes) {
      clearInterval(uploadProgressInterval);
      console.log('Upload complete!');
    }
  }, 1000);
}

// ============================================
// Example 8: Drag & Drop with Custom Handler
// ============================================
function setupDragAndDrop(element, onFilesDropped) {
  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.add('drag-over');
  });

  element.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('drag-over');
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    
    // Validate before calling handler
    const validation = FileHandler.validateFiles(Array.from(files));
    if (validation.hasErrors) {
      console.error('Invalid files in drop:', validation.errors);
      return;
    }

    onFilesDropped(validation.validFiles.map(v => v.file));
  });
}

// Usage
const uploadArea = document.getElementById('upload-area');
setupDragAndDrop(uploadArea, (files) => {
  console.log('Files dropped:', files);
  handleFilesSelected(files, 'documents');
});

// ============================================
// Example 9: File Validation Custom Rules
// ============================================
function validateFileWithCustomRules(file, rules = {}) {
  const {
    allowedExtensions = FileHandler.SUPPORTED_EXTENSIONS,
    maxSize = FileHandler.MAX_FILE_SIZE,
    customValidator = null
  } = rules;

  const errors = [];

  // Check extension
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    errors.push(`Extension ${ext} not allowed`);
  }

  // Check size
  if (file.size > maxSize) {
    errors.push(`File exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  // Custom validation
  if (customValidator && !customValidator(file)) {
    errors.push('Custom validation failed');
  }

  return { valid: errors.length === 0, errors };
}

// Usage with custom rules
const customRules = {
  allowedExtensions: ['.jpg', '.png'],
  maxSize: 10 * 1024 * 1024, // 10MB
  customValidator: (file) => {
    // E.g., check image dimensions would go here
    return file.size > 1024; // Min 1KB
  }
};

const validation = validateFileWithCustomRules(selectedFile, customRules);

// ============================================
// Example 10: KYC Form Integration
// ============================================
function KYCFormWithFileUpload() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    docFront: null,
    docBack: null,
    selfie: null
  });

  const handleDocumentUpload = (files, field) => {
    const summary = FileHandler.createFileSummary(files);
    
    setFormData(prev => ({
      ...prev,
      [field]: {
        files: files,
        summary: summary,
        uploadedAt: new Date().toISOString()
      }
    }));

    // You can also send to server here
    console.log(`${field} documents updated:`, summary);
  };

  const submitForm = async () => {
    // Prepare form for submission
    const submitData = {
      name: formData.name,
      dob: formData.dob,
      documents: {
        front: {
          fileCount: formData.docFront?.summary.fileCount,
          size: formData.docFront?.summary.totalSizeFormatted
        },
        back: {
          fileCount: formData.docBack?.summary.fileCount,
          size: formData.docBack?.summary.totalSizeFormatted
        }
      }
    };

    // Send to server
    const response = await fetch('/api/kyc/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });

    return response.json();
  };

  return (
    <div>
      {/* Form fields */}
      <FileUploadWidget
        field="docFront"
        onFilesSelected={handleDocumentUpload}
        acceptedFormats="image/*,.pdf"
        maxFiles={5}
      />
      
      <FileUploadWidget
        field="docBack"
        onFilesSelected={handleDocumentUpload}
        acceptedFormats="image/*,.pdf"
        maxFiles={5}
      />

      <button onClick={submitForm}>Submit KYC</button>
    </div>
  );
}

// ============================================
// Export Examples for Testing
// ============================================
export {
  handleFilesSelected,
  uploadFilesToServer,
  generateFilePreview,
  processFileBatch,
  simulateFolderStructure,
  trackUploadProgress,
  setupDragAndDrop,
  validateFileWithCustomRules,
  KYCFormWithFileUpload
};
