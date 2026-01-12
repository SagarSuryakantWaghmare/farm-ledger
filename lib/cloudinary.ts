import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryResult {
    secure_url: string;
    public_id: string;
    [key: string]: any;
}

export const uploadImage = async (file: File): Promise<CloudinaryResult> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'farmledger/bills',
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryResult);
            }
        ).end(buffer);
    });
};

export const deleteImage = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
