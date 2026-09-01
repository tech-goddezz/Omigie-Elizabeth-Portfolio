/**
 * Cloudinary Media Delivery Optimization Utility
 * 
 * Provides automated transformation parameters (f_auto, q_auto, width scaling, responsive srcset)
 * to deliver optimal image and video formats without degrading visual fidelity.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
  gravity?: string;
  videoCodec?: string;
}

/**
 * Injects or updates Cloudinary transformation parameters (f_auto, q_auto, width, etc.)
 * into a Cloudinary asset URL.
 */
export function optimizeCloudinaryUrl(
  rawUrl?: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  if (!rawUrl.includes('res.cloudinary.com')) return rawUrl;

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop,
    gravity,
    videoCodec,
  } = options;

  // Build the transformation parameters array
  const params: string[] = [];

  if (format) params.push(`f_${format}`);
  if (quality) params.push(`q_${quality}`);
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  if (crop) params.push(`c_${crop}`);
  if (gravity) params.push(`g_${gravity}`);
  if (videoCodec) params.push(`vc_${videoCodec}`);

  const transformString = params.join(',');

  // Check if URL already has transformation segment after /upload/
  // Format: https://res.cloudinary.com/<cloud_name>/<media_type>/upload/<existing_transforms>/v<version>/<public_id>
  const uploadIndex = rawUrl.indexOf('/upload/');
  if (uploadIndex === -1) return rawUrl;

  const beforeUpload = rawUrl.slice(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = rawUrl.slice(uploadIndex + 8);

  // If afterUpload starts with a version (v1234...) or folder/filename
  if (/^v\d+\//.test(afterUpload) || !/^[a-z0-9_,-]+\/v\d+\//i.test(afterUpload)) {
    return `${beforeUpload}${transformString}/${afterUpload}`;
  }

  // If there are existing transforms before /v.../, replace/merge them cleanly
  const versionMatch = afterUpload.match(/\/(v\d+\/.*)$/);
  if (versionMatch) {
    const assetPath = versionMatch[1];
    return `${beforeUpload}${transformString}/${assetPath}`;
  }

  return `${beforeUpload}${transformString}/${afterUpload}`;
}

/**
 * Generates a responsive srcset string for a Cloudinary image URL.
 */
export function getCloudinarySrcSet(
  rawUrl?: string,
  widths: number[] = [480, 768, 1080, 1440]
): string {
  if (!rawUrl || !rawUrl.includes('res.cloudinary.com')) return '';

  return widths
    .map((w) => `${optimizeCloudinaryUrl(rawUrl, { width: w })} ${w}w`)
    .join(', ');
}

/**
 * Optimizes a Cloudinary video URL with auto format, quality, and optional width scaling.
 */
export function optimizeCloudinaryVideoUrl(
  rawUrl?: string,
  options: CloudinaryTransformOptions = {}
): string {
  return optimizeCloudinaryUrl(rawUrl, {
    format: 'auto',
    quality: 'auto',
    ...options,
  });
}
