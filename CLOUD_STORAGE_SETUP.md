# Cloud Storage Setup Guide for Stefanos Admin

## Recommended Options

### 1. Cloudinary (Recommended for Images)
**Best for:** Image optimization, transformations, CDN delivery

**Free Tier:**
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

**Setup:**
1. Sign up at https://cloudinary.com/
2. Get API Key, API Secret, and Cloud Name from dashboard
3. Install SDK: `npm install cloudinary`
4. Configure environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Firebase Storage
**Best for:** Google ecosystem integration, real-time apps

**Free Tier:**
- 1GB storage
- 10GB bandwidth/day
- 20,000 read operations/day

**Setup:**
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Storage service
3. Download service account key
4. Install SDK: `npm install firebase`
5. Configure:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
```

### 3. AWS S3
**Best for:** Enterprise-grade reliability, scalability

**Free Tier:**
- 5GB storage
- 20,000 requests/month
- 15GB data transfer/month

**Setup:**
1. Create AWS account
2. Create S3 bucket with public access
3. Create IAM user with S3 permissions
4. Install SDK: `npm install @aws-sdk/client-s3`
5. Configure:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 4. Supabase Storage
**Best for:** Open-source, PostgreSQL integration

**Free Tier:**
- 1GB storage
- 2GB bandwidth
- 50MB file size limit

**Setup:**
1. Create Supabase project at https://supabase.com/
2. Enable Storage in dashboard
3. Create storage bucket
4. Install SDK: `npm install @supabase/supabase-js`
5. Configure:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Implementation Example (Cloudinary)

### Backend Integration

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(buffer: Buffer, folder: string = 'rooms') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
}
```

### API Route

```typescript
// pages/api/upload/room-image.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { uploadImage } from '@/lib/cloudinary'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buffer = Buffer.from(await req.arrayBuffer())
    const result = await uploadImage(buffer, 'rooms')
    
    res.status(200).json({
      success: true,
      data: { url: (result as any).secure_url }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, error: 'Upload failed' })
  }
}
```

## Features Comparison

| Feature | Cloudinary | Firebase | AWS S3 | Supabase |
|---------|------------|----------|--------|----------|
| **Image Optimization** | ✅ Excellent | ❌ Basic | ❌ None | ❌ Basic |
| **CDN** | ✅ Built-in | ✅ Built-in | ✅ CloudFront | ✅ Built-in |
| **Transformations** | ✅ Advanced | ❌ None | ❌ None | ❌ None |
| **Free Storage** | 25GB | 1GB | 5GB | 1GB |
| **Setup Complexity** | Easy | Medium | Hard | Easy |
| **File Size Limit** | 100MB | 10MB | 5GB | 50MB |

## Migration Steps

1. **Choose Provider** - Based on your needs and budget
2. **Setup Account** - Create account and get credentials
3. **Install SDK** - Add required dependencies
4. **Configure Environment** - Set up environment variables
5. **Update Upload API** - Integrate with chosen provider
6. **Test Upload** - Verify functionality
7. **Update Frontend** - Add progress indicators and error handling
8. **Migrate Existing Images** - Move current images to cloud storage

## Security Considerations

- Never expose API secrets in frontend code
- Use signed URLs for private content
- Implement file type and size validation
- Set appropriate CORS policies
- Monitor usage and costs
- Implement backup strategies

## Cost Optimization

- Use image optimization to reduce bandwidth
- Implement caching strategies
- Set up lifecycle policies for old files
- Monitor usage regularly
- Consider CDN costs for high traffic

## Recommended Choice

**For Stefanos Hotel Admin:**

**Cloudinary** is recommended because:
- Excellent image optimization reduces bandwidth costs
- Built-in CDN ensures fast loading globally
- Easy to implement with great documentation
- Generous free tier for hotel image collections
- Automatic format optimization (WebP, AVIF)
- Smart cropping and resizing features
