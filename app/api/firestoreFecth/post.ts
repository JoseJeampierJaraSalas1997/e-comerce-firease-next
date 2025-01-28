import { db } from "@/config/firebaseConfig";
import { Demo } from "@/types";
import { collection, addDoc } from "firebase/firestore";

export async function createProduct(product: Demo.Product) {
  try {
    console.log("Entramos a la funcion con los datos de prueba: ", product);
    
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Producto creado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al crear el producto: ", error);
  }
}

