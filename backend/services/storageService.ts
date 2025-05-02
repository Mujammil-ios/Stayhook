import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { SupabaseError } from '../supabaseBase';

/**
 * File metadata returned by storage operations
 */
export interface FileMetadata {
  path: string;
  id: string;
  fullPath: string;
  lastModified: number;
  mimetype: string;
  name: string;
  size: number;
  publicUrl: string;
}

/**
 * Progress callback for upload operations
 */
export type ProgressCallback = (progress: number, bytesUploaded: number, bytesTotal: number) => void;

/**
 * Storage service for handling file operations with Supabase Storage
 */
export class StorageService {
  private client: SupabaseClient;
  private buckets: Map<string, boolean> = new Map();

  /**
   * Creates a new StorageService instance
   */
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new SupabaseError('Supabase URL or key not found in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Ensures a bucket exists, creating it if necessary
   * 
   * @param bucket - The bucket name
   * @param isPublic - Whether the bucket should be public (defaults to false)
   * @returns True if the bucket exists or was created successfully
   * 
   * @rbac Super Admin only
   */
  async ensureBucket(bucket: string, isPublic: boolean = false): Promise<boolean> {
    // Check if we've already verified this bucket
    if (this.buckets.has(bucket)) {
      return this.buckets.get(bucket) as boolean;
    }

    // Check if the bucket exists
    const { data: buckets, error: getBucketError } = await this.client.storage.listBuckets();
    
    if (getBucketError) {
      throw new SupabaseError('Failed to list storage buckets', getBucketError);
    }
    
    const bucketExists = buckets.some(b => b.name === bucket);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await this.client.storage.createBucket(bucket, {
        public: isPublic,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg', 
          'image/png', 
          'image/webp', 
          'image/gif', 
          'application/pdf',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Word
        ]
      });
      
      if (createError) {
        throw new SupabaseError('Failed to create storage bucket', createError);
      }
    }
    
    // If the bucket should be public, update its policy
    if (isPublic) {
      await this.setPublicPolicy(bucket);
    }
    
    // Cache the result
    this.buckets.set(bucket, true);
    
    return true;
  }

  /**
   * Sets a public access policy for a bucket
   * 
   * @param bucket - The bucket name
   * 
   * @rbac Super Admin only
   */
  private async setPublicPolicy(bucket: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).getPublicUrl('policy-check');
    
    if (error) {
      // If we can't get a public URL, the bucket is not public, so set the policy
      const { error: policyError } = await this.client.storage.from(bucket).createSignedUrl(
        'policy-check',
        60,
        { allowedOperations: ['select'] }
      );
      
      if (policyError && policyError.message !== 'The resource was not found') {
        throw new SupabaseError('Failed to create storage policy', policyError);
      }
    }
  }

  /**
   * Upload a file to Supabase Storage
   * 
   * @param bucket - The bucket name
   * @param file - The file to upload (browser File or node Buffer)
   * @param path - The path within the bucket
   * @param onProgress - Optional callback for upload progress
   * @returns Metadata about the uploaded file including public URL
   * 
   * @rbac Super Admin, Property Owner, Staff (limited by path)
   */
  async upload(
    bucket: string, 
    file: File | Buffer | Blob, 
    path: string,
    onProgress?: ProgressCallback
  ): Promise<FileMetadata> {
    // Ensure the bucket exists
    await this.ensureBucket(bucket);
    
    // Handle different file types
    let fileData: File | Blob | ArrayBuffer;
    let fileName: string;
    
    if (file instanceof File) {
      fileData = file;
      fileName = file.name;
    } else if (file instanceof Buffer) {
      fileData = new Blob([file]);
      fileName = path.split('/').pop() || 'file';
    } else {
      fileData = file;
      fileName = path.split('/').pop() || 'file';
    }
    
    // Construct the full path
    const fullPath = path.endsWith(fileName) ? path : `${path}/${fileName}`;
    
    // Upload the file
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(fullPath, fileData, {
        cacheControl: '3600',
        upsert: true,
        onUploadProgress: onProgress ? 
          (progress) => onProgress(
            progress.percent || 0, 
            progress.loaded || 0, 
            progress.total || 0
          ) : undefined
      });
    
    if (error) {
      throw new SupabaseError('Failed to upload file', error);
    }
    
    // Get the public URL
    const { data: publicUrlData } = await this.client.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Return metadata
    return {
      path: data.path,
      id: data.id || '',
      fullPath: `${bucket}/${data.path}`,
      lastModified: new Date().getTime(),
      mimetype: file instanceof File ? file.type : '',
      name: fileName,
      size: file instanceof File ? file.size : 0,
      publicUrl: publicUrlData.publicUrl
    };
  }

  /**
   * Get a public URL for a file
   * 
   * @param bucket - The bucket name
   * @param path - The path within the bucket
   * @returns The public URL of the file
   * 
   * @rbac Any role
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Get a signed URL for a file (time-limited access)
   * 
   * @param bucket - The bucket name
   * @param path - The path within the bucket
   * @param expiresIn - Seconds until the URL expires (default: 60 mins)
   * @returns The signed URL for the file
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      throw new SupabaseError('Failed to create signed URL', error);
    }
    
    return data.signedUrl;
  }

  /**
   * Remove a file from storage
   * 
   * @param bucket - The bucket name
   * @param path - The path within the bucket
   * 
   * @rbac Super Admin, Property Owner, Staff (limited by path)
   */
  async remove(bucket: string, path: string | string[]): Promise<void> {
    const paths = Array.isArray(path) ? path : [path];
    
    const { error } = await this.client.storage
      .from(bucket)
      .remove(paths);
    
    if (error) {
      throw new SupabaseError('Failed to remove file(s)', error);
    }
  }

  /**
   * List files in a bucket path
   * 
   * @param bucket - The bucket name
   * @param path - The path within the bucket
   * @returns Array of file metadata
   * 
   * @rbac Super Admin, Property Owner, Staff (limited by path)
   */
  async list(bucket: string, path: string = ''): Promise<FileMetadata[]> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .list(path);
    
    if (error) {
      throw new SupabaseError('Failed to list files', error);
    }
    
    // Filter out folders
    const files = data.filter(item => !item.id.endsWith('/'));
    
    // Transform to FileMetadata
    return Promise.all(files.map(async (file) => {
      const { data: publicUrlData } = await this.client.storage
        .from(bucket)
        .getPublicUrl(file.name);
      
      return {
        path: file.name,
        id: file.id,
        fullPath: `${bucket}/${file.name}`,
        lastModified: new Date(file.created_at).getTime(),
        mimetype: file.metadata?.mimetype || '',
        name: file.name.split('/').pop() || file.name,
        size: file.metadata?.size || 0,
        publicUrl: publicUrlData.publicUrl
      };
    }));
  }
}

export default new StorageService();