import { db } from "@/config/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteProduct(id: string) {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    console.log("Producto eliminado");
  } catch (error) {
    console.error("Error al eliminar el producto: ", error);
  }
}
