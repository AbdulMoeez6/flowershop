"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads an image to Cloudinary.
 * Expects a FormData object containing a "file" (File/Blob) field.
 */
export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "flowershop_products" },
        (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image.");
  }
}

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string) {
  try {
    if (!publicId) return { success: true };
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === "ok" };
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image.");
  }
}
