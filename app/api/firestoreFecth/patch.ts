import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Demo } from "@/types";

export async function updateProduct(id: string, updatedData: Partial<Demo.Product>) {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Datos actuales del producto:", docSnap.data());

      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(([key, value]) => value !== undefined)
      );

      console.log("Datos filtrados antes de actualizar:", filteredData);

      await updateDoc(docRef, filteredData);
      console.log("Producto actualizado exitosamente.");
    } else {
      console.log("El documento no existe.");
    }
  } catch (error) {
    console.error("Error al actualizar el producto: ", error);
  }
}
