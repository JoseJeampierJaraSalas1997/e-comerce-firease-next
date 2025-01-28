import { db } from "@/config/firebaseConfig";
import { Demo } from "@/types";
import { collection, getDocs } from "firebase/firestore";

export async function getProducts(): Promise<Demo.Product[]> {
    const products: Demo.Product[] = [];
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      console.log("Esto es lo que me trae: ", querySnapshot);
      
      querySnapshot.forEach((doc) => {
        console.log("Este es el id de la bbdd: ", doc.id);
        
        const data = doc.data();
        const productWithFirestoreId: Demo.Product = {
            id: doc.id,
            name: data.name,
            description: data.description,
            category: data.category,
            image: data.image,
            price: data.price,
            quantity: data.quantity,
            inventoryStatus: data.inventoryStatus,
            rating: data.rating,
            code: data.code,
            date: data.date
          };
    
          products.push(productWithFirestoreId);
      });
    } catch (error) {
      console.error("Error al obtener los productos: ", error);
    }
  
    console.log("Esto es lo que voy a traer de mi backend: ", products);
    
    return products;
  }
  
