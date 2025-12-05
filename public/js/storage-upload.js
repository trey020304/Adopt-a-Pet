// Supabase Storage Upload Utility
// Handles file uploads to Supabase Storage buckets

// Get the Supabase URL from the initialized client if available
const getSupabaseUrl = () => {
  if (window.supabase && window.supabase.getBaseUrl) {
    return window.supabase.getBaseUrl();
  }
  // Fallback: extract from the supabase client
  try {
    const url = window.supabase.rest._url || 'https://wdocnovzaymlxthbfdnt.supabase.co';
    return url.replace('/rest/v1', '');
  } catch (e) {
    return 'https://wdocnovzaymlxthbfdnt.supabase.co';
  }
};

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The bucket name (e.g., 'adoption', 'rescue', 'donate')
 * @param {string} folder - Optional folder within the bucket
 * @returns {Promise<{url: string, error: null|string}>}
 */
async function uploadFileToSupabase(file, bucket, folder = '') {
  try {
    if (!file) {
      return { url: null, error: 'No file selected' };
    }

    // Validate file type (images and videos only) - accept any mime that starts with image/ or video/
    if (!file.type || (!(file.type.startsWith('image/') || file.type.startsWith('video/')))) {
      return { url: null, error: 'File type not allowed. Please upload an image or video.' };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { url: null, error: 'File size exceeds 10MB limit.' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;

    // Build the path
    const filePath = folder ? `${folder}/${filename}` : filename;

    console.log('Starting upload:', { bucket, filePath, fileSize: file.size, fileType: file.type });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (data) {
      console.log('Upload response data:', data);
    }

    // If upload failed, try fallback bucket (useful if project uses a single 'animal' bucket)
    const FALLBACK_BUCKET = 'animal';
    if (error) {
      console.warn(`Upload to bucket '${bucket}' failed:`, error.message || error);
      if (FALLBACK_BUCKET && bucket !== FALLBACK_BUCKET) {
        try {
          const { data: fbData, error: fbError } = await supabase.storage
            .from(FALLBACK_BUCKET)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!fbError) {
            const { data: urlData } = supabase.storage
              .from(FALLBACK_BUCKET)
              .getPublicUrl(filePath);
            
            const publicUrl = urlData.publicUrl;
            const SUPABASE_URL = getSupabaseUrl();
            const finalUrl = publicUrl.startsWith('http') 
              ? publicUrl 
              : `${SUPABASE_URL}/storage/v1/object/public/${FALLBACK_BUCKET}/${filePath}`;
            
            console.log('Fallback upload successful:', finalUrl);
            return { url: finalUrl, error: null };
          }
          console.error(`Fallback upload to '${FALLBACK_BUCKET}' also failed:`, fbError);
          return { url: null, error: fbError.message || 'Upload failed (fallback)' };
        } catch (fbEx) {
          console.error('Fallback upload exception:', fbEx);
          return { url: null, error: fbEx.message || 'Upload failed (fallback exception)' };
        }
      }
      return { url: null, error: error.message || 'Upload failed' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error('Failed to generate public URL', { bucket, filePath, urlData });
      return { url: null, error: 'Failed to generate public URL' };
    }

    console.log('File uploaded successfully:', { bucket, filePath, publicUrl: urlData.publicUrl });
    
    // Ensure the URL is properly formatted
    const publicUrl = urlData.publicUrl;
    const SUPABASE_URL = getSupabaseUrl();
    
    // If the URL doesn't start with http, prepend the Supabase project URL
    const finalUrl = publicUrl.startsWith('http') 
      ? publicUrl 
      : `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Final public URL:', finalUrl);
    return { url: finalUrl, error: null };
  } catch (err) {
    console.error('Upload exception:', err);
    return { url: null, error: err.message || 'An error occurred during upload' };
  }
}

/**
 * Preview a file before upload
 * @param {File} file - The file to preview
 * @param {string} previewContainerId - ID of the container for preview
 */
function previewFile(fileOrFiles, previewContainerId) {
  const container = document.getElementById(previewContainerId);
  if (!container) return;

  container.innerHTML = '';
  if (!fileOrFiles) return;

  const files = fileOrFiles instanceof FileList || Array.isArray(fileOrFiles)
    ? Array.from(fileOrFiles)
    : [fileOrFiles];

  files.forEach(file => {
    try {
      const url = URL.createObjectURL(file);

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '160px';
        img.style.marginRight = '8px';
        img.style.borderRadius = '8px';
        img.style.maxHeight = '120px';
        img.style.objectFit = 'cover';
        container.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const vid = document.createElement('video');
        vid.src = url;
        vid.controls = true;
        vid.style.maxWidth = '220px';
        vid.style.maxHeight = '120px';
        vid.style.marginRight = '8px';
        vid.style.borderRadius = '8px';
        container.appendChild(vid);
      } else {
        const p = document.createElement('p');
        p.textContent = `📎 ${file.name}`;
        p.style.fontSize = '14px';
        container.appendChild(p);
      }
    } catch (err) {
      console.error('Preview error:', err);
    }
  });
}

/**
 * Upload multiple files to Supabase Storage and return array of public URLs
 * @param {FileList|File[]} files
 * @param {string} bucket
 * @param {string} folder
 * @returns {Promise<{urls: string[], errors: Array}>}
 */
async function uploadFilesToSupabase(files, bucket, folder = '') {
  const results = { urls: [], errors: [] };
  if (!files || files.length === 0) return results;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { url, error } = await uploadFileToSupabase(file, bucket, folder);
    if (error) results.errors.push({ file: file.name, error });
    else results.urls.push(url);
  }

  return results;
}
