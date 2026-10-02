import { v2 as cloudinary } from 'cloudinary'
import { IMAGE_FOLDER } from '#shared/schemas/content'

export interface StoredImage {
  url: string
  publicId: string
}

function client(): typeof cloudinary {
  const { cloudName, apiKey, apiSecret } = useRuntimeConfig().cloudinary
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  return cloudinary
}

/** Detects the real image type from magic bytes so a renamed file cannot pass as an image. */
export function detectImageType(data: Buffer): string | undefined {
  const ascii = (start: number, end: number) => data.subarray(start, end).toString('latin1')
  if (data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) return 'image/jpeg'
  if (ascii(0, 8) === '\x89PNG\r\n\x1A\n') return 'image/png'
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  if (ascii(4, 12) === 'ftypavif') return 'image/avif'
  return undefined
}

export async function uploadImage(data: Buffer, type: string): Promise<StoredImage> {
  const result = await client().uploader.upload(`data:${type};base64,${data.toString('base64')}`, {
    folder: IMAGE_FOLDER,
    resource_type: 'image'
  })
  return { url: result.secure_url, publicId: result.public_id }
}

/** Removes an asset after its record changed. Failures are logged, never thrown, because the database write already succeeded. */
export async function releaseImage(publicId: string | null | undefined): Promise<void> {
  if (!publicId) return
  try {
    await client().uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
    logger.info('image.deleted', { publicId })
  } catch (error) {
    logger.error('image.delete_failed', error, { publicId })
  }
}
