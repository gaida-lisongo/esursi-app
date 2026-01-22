"use server";

const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export async function uploadPhoto(formData: FormData) {
    try {
        const file = formData.get("file");
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ml_default"); // Using default unsigned preset
        data.append("folder", "esursi");

        const result = await fetch(cloudinaryUrl, {
            method: "POST",
            body: data,
        });

        const res = await result.json();

        if (res.secure_url) {
            return { success: true, url: res.secure_url };
        }

        return { success: false, error: res.error?.message || "Failed to upload photo" };
    } catch (error) {
        console.error("Failed to upload photo:", error);
        return { success: false, error: "Network or server error" };
    }
}