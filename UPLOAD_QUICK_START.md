# File Upload Features - Quick Reference

## What's New

### 1. **Enhanced File Upload in KYCFlow (Step 2)**
- ✅ **Drag & Drop Support**: Drag files directly into upload areas
- ✅ **Multi-File Upload**: Select multiple files at once
- ✅ **File Information Display**: Shows file count, names, and sizes
- ✅ **Multiple File Formats**: JPG, PNG, PDF, DOC, XLS, TXT and more
- ✅ **Visual Feedback**: Color changes during drag operations

### 2. **File Metadata Tracking**
- File names (with comma-separated list for multiple files)
- File sizes in MB
- File count
- Upload timestamp
- File type information

### 3. **Reusable FileUploadWidget Component**
A standalone component that can be used in any part of the app:
```jsx
<FileUploadWidget
  field="myDocuments"
  onFilesSelected={(files, field) => handleFiles(files)}
  acceptedFormats="image/*,.pdf"
  maxFiles={5}
/>
```

### 4. **FileHandler Utility Module**
Comprehensive file handling utilities:
- `validateFile()` / `validateFiles()`
- `extractMetadata()` / `extractMetadataArray()`
- `formatFileSize()`
- `createFileSummary()`
- `readFileAsDataURL()` / `readFileAsText()`
- `readMultipleFiles()`

---

## Files Created

1. **`src/utils/fileHandler.js`** (160+ lines)
   - File validation logic
   - Metadata extraction
   - File processing utilities
   - Format: CommonJS export

2. **`src/components/FileUploadWidget.jsx`** (140+ lines)
   - Reusable upload component
   - Drag & drop support
   - Error handling & display
   - File list with remove buttons

3. **`FILE_UPLOAD_GUIDE.md`** (Complete documentation)
   - Feature overview
   - Component structure
   - API reference
   - Usage examples
   - Browser compatibility

---

## Files Modified

1. **`src/screens/KYCFlow.jsx`**
   - Added imports: `useRef`, `useState`
   - Added file info state: `frontFileInfo`, `backFileInfo`
   - Enhanced `handleFileChange()`: Handles file arrays and metadata
   - New `handleDrop()`: Drag-and-drop functionality
   - New `handleDragOver()`: Visual feedback for drag
   - Updated file inputs: Support multiple files with extended formats
   - Enhanced display: Shows file count, names, and sizes

2. **`src/App.jsx`**
   - Enhanced `handleFileUpload()`: Processes file arrays and creates metadata
   - Added file metadata extraction
   - Voice feedback for file uploads

---

## Key Features

### Upload Interface (Step 2 - Document Upload)
```
┌─────────────────────────────────────┐
│  Front Document Upload              │
│  ┌─────────────────────────────────┐│
│  │ Drag & drop files here          ││
│  │ or click to select              ││
│  │ JPG, PNG, PDF, DOC, XLS, TXT    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

When files are selected:
```
┌─────────────────────────────────────┐
│  ✓ 2 file(s) uploaded               │
│  doc_front.pdf, resume.docx         │
│  1.25 MB, 0.85 MB                   │
└─────────────────────────────────────┘
```

### Supported File Types
- **Images**: .jpg, .jpeg, .png, .webp
- **Documents**: .pdf, .doc, .docx, .xls, .xlsx, .txt
- **Size Limit**: 50MB per file

### Validation
- File type checking (MIME type + extension)
- File size validation
- Clear error messages for invalid files
- Supports multiple files with individual validation

---

## How to Test

### Manual Testing
1. **Navigate to Step 2** in KYC Flow (Document Upload)
2. **Try clicking** the upload area and selecting a file
3. **Try dragging** files from your file explorer
4. **Try selecting multiple** files with Ctrl+Click (Cmd+Click on Mac)
5. **Observe**:
   - File count display
   - File names shown
   - File sizes in MB
   - Green checkmark ✓

### Test Cases
- ✅ Single file upload
- ✅ Multiple file upload
- ✅ Drag & drop single file
- ✅ Drag & drop multiple files
- ✅ File size display
- ✅ File count display
- ✅ Error handling (unsupported format)
- ✅ Error handling (file too large)

---

## Accessing File Data

### In Component
```javascript
formData.docFront  // File names as string
frontFileInfo      // { names, sizes, count, files }
formData.docBack   // File names as string
backFileInfo       // { names, sizes, count, files }
```

### File Metadata
```javascript
const metadata = FileHandler.extractMetadata(file);
// Returns: { name, size, sizeFormatted, type, extension, lastModified, ... }
```

### Creating Summary
```javascript
const summary = FileHandler.createFileSummary(files);
// Returns: { fileCount, totalSize, totalSizeFormatted, files, summary }
```

---

## Browser Support
- ✅ Chrome/Edge: Full support (v90+)
- ✅ Firefox: Full support (v88+)
- ✅ Safari: Full support (v14+)
- ⚠️ IE11: Limited (no drag & drop)

---

## Next Steps

### To Connect to a Server
Update `handleFileUpload()` in `App.jsx`:
```javascript
const handleFileUpload = async (field, files) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    // Handle response
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### To Add File Preview
```javascript
const preview = await FileHandler.readFileAsDataURL(file);
// Use preview data for image display
```

### To Process Files as Text
```javascript
const text = await FileHandler.readFileAsText(file);
// Process text file contents
```

---

## File Size Limits

Current: **50MB per file**

To change, edit `src/utils/fileHandler.js`:
```javascript
MAX_FILE_SIZE: 100 * 1024 * 1024, // Change to 100MB
```

---

## Troubleshooting

### Files not uploading?
1. Check browser console for errors
2. Verify file format is in supported list
3. Check file size < 50MB
4. Try a different file format

### Drag & drop not working?
1. Make sure you're dragging over the upload area
2. Check browser supports drag & drop (not IE11)
3. Try clicking to select instead

### File size showing incorrectly?
- File sizes are calculated as: `size / 1024 / 1024` MB
- This is approximate; actual may vary by 0-5%

---

## Support

For more details, see: **`FILE_UPLOAD_GUIDE.md`**

For utility API reference, see: **`src/utils/fileHandler.js`**

For component details, see: **`src/components/FileUploadWidget.jsx`**
