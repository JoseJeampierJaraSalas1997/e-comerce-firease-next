const CLOUDINARY_CLOUD_NAME = "drb7rbodk";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  console.log("📂 Archivo recibido para subir:", file.name, file.type, file.size, "bytes");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "ml_default");

  console.log("🚀 Subiendo imagen a Cloudinary...");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Error en Cloudinary:", data);
      throw new Error(data.error?.message || "Error desconocido");
    }

    console.log("✅ Imagen subida con éxito:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Error al subir la imagen:", error);
    throw error;
  }
};
