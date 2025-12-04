# File Upload Functionality Documentation

## Overview
The KYC app now supports comprehensive file and folder upload capabilities with the following features:

### Features Implemented

#### 1. **Multi-File Upload Support**
- Upload single or multiple files simultaneously
- Supports batch file processing
- File count and size display

#### 2. **Drag & Drop Interface**
- Drag files directly into upload areas
- Visual feedback during drag operations
- Drop zone highlighting for better UX

#### 3. **Supported File Formats**
- **Images**: JPG, JPEG, PNG, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT
- File type validation with clear error messages
- Maximum file size: 50MB per file

#### 4. **File Metadata Extraction**
- File name, size, type, and modification date
- Formatted file sizes (Bytes, KB, MB, GB)
- Upload timestamp tracking

#### 5. **Folder Upload (Simulated)**
- Browser security limitation: Direct folder access not available
- Workaround: Users can select all files from a folder
- Files display with virtual folder structure information

#### 6. **File Validation**
- Validates file type and size
- Prevents upload of unsupported formats
- Clear error messages for invalid files
- Accepts multiple files with validation for each

---

## Component Structure

### 1. **KYCFlow.jsx** (Enhanced)
**Location**: `src/screens/KYCFlow.jsx`

**New Imports**:
```javascript
import { useRef, useState } from 'react';
```

**New Features**:
- `handleFileChange()`: Processes selected files and extracts metadata
- `handleDrop()`: Handles drag-and-drop file upload
- `handleDragOver()`: Visual feedback for drag operations
- File info state: `frontFileInfo`, `backFileInfo`

**Upload Areas**:
- Front Document Upload (Step 2)
- Back Document Upload (Step 2)

Both areas support:
- Click to select files
- Drag & drop
- Multiple file selection
- File count and size display

### 2. **FileUploadWidget.jsx** (New)
**Location**: `src/components/FileUploadWidget.jsx`

**Purpose**: Reusable file upload component with advanced features

**Props**:
```typescript
{
  field: string;                    // Unique identifier for upload field
  onFilesSelected: (files, field) => void;  // Callback when files selected
  acceptedFormats: string;          // File type filter (e.g., "image/*,.pdf")
  maxFiles: number | null;          // Maximum number of files allowed
  multiple: boolean;                // Allow multiple files (default: true)
  showFileList: boolean;            // Display selected files list (default: true)
}
```

**Features**:
- Drag & drop support
- File validation
- Error display
- File list with remove buttons
- File type icons

### 3. **fileHandler.js** (New Utility)
**Location**: `src/utils/fileHandler.js`

**Methods**:

#### Validation Methods
```javascript
// Single file validation
FileHandler.validateFile(file)
// Returns: { valid: boolean, errors: string[] }

// Multiple files validation
FileHandler.validateFiles(files)
// Returns: { validFiles: array, errors: array, hasErrors: boolean }
```

#### Metadata Methods
```javascript
// Extract single file metadata
FileHandler.extractMetadata(file)
// Returns: { name, size, type, lastModified, extension, ... }

// Extract metadata for multiple files
FileHandler.extractMetadataArray(files)
// Returns: metadata array

// Create file summary
FileHandler.createFileSummary(files)
// Returns: { fileCount, totalSize, files, summary }
```

#### File Reading Methods
```javascript
// Read as Data URL (preview)
await FileHandler.readFileAsDataURL(file)

// Read as text
await FileHandler.readFileAsText(file)

// Read multiple files
await FileHandler.readMultipleFiles(files, 'dataURL' | 'text')
```

#### Utility Methods
```javascript
// Format file size
FileHandler.formatFileSize(bytes)
// Returns: "1.5 MB"

// Process folder upload
FileHandler.processFolderUpload(files)
```

---

## How to Use

### In KYCFlow Component

The file upload is already integrated in Step 2 (Document Upload):

```jsx
{/* Front Side Upload Area */}
<div 
  onClick={() => frontFileRef.current.click()}
  onDrop={(e) => handleDrop(e, 'docFront')}
  onDragOver={handleDragOver}
  className={`border-2 border-dashed rounded-xl p-8 ...`}
>
  {/* Shows file count, names, and sizes */}
</div>
```

### Using FileUploadWidget in Custom Components

```jsx
import FileUploadWidget from './components/FileUploadWidget';
import FileHandler from './utils/fileHandler';

function MyComponent() {
  const handleFilesSelected = (files, field) => {
    console.log(`Files selected for ${field}:`, files);
    const summary = FileHandler.createFileSummary(files);
    console.log('Summary:', summary);
  };

  return (
    <FileUploadWidget
      field="documents"
      onFilesSelected={handleFilesSelected}
      acceptedFormats=".pdf,image/*"
      maxFiles={5}
      multiple={true}
      showFileList={true}
    />
  );
}
```

### File Processing Pipeline

1. **User Action**: Click or drag files into upload area
2. **File Selection**: Browser's file picker dialog appears
3. **Validation**: Files are validated against type and size
4. **Metadata Extraction**: File info is extracted and stored
5. **State Update**: Form state is updated with file info
6. **Display**: File count, names, and sizes shown to user
7. **Callback**: `onFileUpload()` callback executed (can send to server)

---

## Folder Upload - Browser Limitations

### Current Limitation
Due to web browser security restrictions, direct folder access is not possible. However, users can:
1. Select all files from a folder using Ctrl+A in file picker
2. Files will be processed and displayed
3. Virtual folder structure information is tracked

### Future Enhancement
For true folder upload, consider:
- Using Electron for desktop app
- Using file system API with proper permissions
- Server-side directory creation before upload

---

## File Size Limits

- **Per File**: 50MB
- **Total Session**: Unlimited (browser dependent)

These can be adjusted in `fileHandler.js`:
```javascript
MAX_FILE_SIZE: 50 * 1024 * 1024, // Change this value
```

---

## Supported MIME Types

```javascript
SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
]

SUPPORTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp',
  '.pdf',
  '.doc', '.docx',
  '.xls', '.xlsx',
  '.txt'
]
```

---

## Error Handling

### Validation Errors
- File type not supported
- File size exceeds limit
- Invalid file format

### Display
Errors are displayed in red alert boxes with:
- Filename
- Specific error message
- User-friendly formatting

---

## Integration with Form State

Files are stored in `formData` state:

```javascript
formData = {
  docFront: "file1.pdf, file2.jpg",  // File names (comma-separated if multiple)
  docBack: "doc_back.pdf",            // Single or multiple files
  // Additional metadata
  docFrontInfo: { count, sizes, files }, // File metadata
  docBackInfo: { count, sizes, files }
}
```

---

## Localization Support

File upload messages include localization strings:
- English: "Drag & drop or click to select files"
- Hindi: (Can be added to localization.js)

---

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Partial support (no drag & drop)

---

## Testing the Feature

1. **Single File Upload**
   - Click upload area
   - Select one file
   - File name and size displayed

2. **Multiple File Upload**
   - Click upload area
   - Select multiple files (Ctrl+Click)
   - All files listed with sizes

3. **Drag & Drop**
   - Drag one or more files into drop zone
   - Visual feedback appears
   - Files added to list

4. **Error Testing**
   - Try uploading unsupported file type
   - Try uploading file > 50MB
   - Error message displays

---

## Files Modified/Created

### Created
- `/src/utils/fileHandler.js` - File handling utility
- `/src/components/FileUploadWidget.jsx` - Reusable upload component

### Modified
- `/src/screens/KYCFlow.jsx` - Enhanced with drag-drop and file info
- `/src/App.jsx` - Updated `handleFileUpload()` to process file arrays

---

## Next Steps

1. Connect to backend API for actual file uploads
2. Add progress bars for file upload progress
3. Add file preview functionality
4. Implement chunk-based uploading for large files
5. Add cancel/pause functionality
