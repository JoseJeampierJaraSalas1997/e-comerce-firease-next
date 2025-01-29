import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { createProduct } from "@/app/api/firestoreFecth/post";
import { Demo } from "@/types";
import Swal from "sweetalert2";
import { Rating, RatingChangeEvent } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import * as filestack from 'filestack-js';

type DropdownChangeEvent = React.ChangeEvent<HTMLInputElement>;
const filestackClient = filestack.init('AP4HNVeB5T8G5Fd3jdhdez');
const NewProductModal = ({ visible, onHide }: { visible: boolean, onHide: () => void }) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        category: "",
        image: "",
        inventoryStatus: "bajo",
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string>(''); 
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent | RatingChangeEvent,
        field: string
    ) => {
        let value: any;
        if ("value" in e) {
            value = e.value;
        } else {
            value = e.target.value;
        }
        setProduct((prevProduct) => ({
            ...prevProduct,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createProduct(product as Demo.Product);
            Swal.fire({
                icon: 'success',
                title: '¡Producto creado exitosamente!',
                text: 'El nuevo producto ha sido agregado a la base de datos.',
                confirmButtonText: 'Aceptar'
            });
            setProduct({
                name: "",
                description: "",
                price: 0,
                quantity: 0,
                category: "",
                image: "",
                inventoryStatus: "bajo",
                rating: 0
            });
            setLoading(false);
            onHide();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear el producto. Intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
            setLoading(false);
        }
        setLoading(false);
    };

    const handleUpload = () => {
        setLoading(true); // Activamos el loading
    
        // Abre el selector de archivos Filestack
        filestackClient.picker({
          accept: 'image/*',
          fromSources: ['local_file_system'],
          onFileUploadFinished: (file: any) => {
            const uploadedImageUrl = file.url;
            setImageUrl(uploadedImageUrl);
            setImageName(uploadedImageUrl);
            setLoading(false);
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: uploadedImageUrl,
              }));
            console.log('Imagen subida:', uploadedImageUrl);
          },
        }).open();
      };


    return (
        <>
            <Dialog header="Crear nuevo producto" style={{ width: '50vw' }} visible={visible} onHide={onHide}>
                {/* Spinner de carga */}
                {loading ? (
                    <div className="flex justify-content-center p-mt-4">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={product.name} onChange={(e) => handleInputChange(e, "name")} />
                        </div>

                        <div className="field">
                            <label htmlFor="description">Descripción</label>
                            <InputText id="description" value={product.description} onChange={(e) => handleInputChange(e, "description")} />
                        </div>

                        <div className="field">
                            <label htmlFor="price">Precio</label>
                            <InputNumber id="price" value={product.price} onValueChange={(e) => handleInputChange(e as any, "price")} mode="currency" currency="PEN" />
                        </div>

                        <div className="field">
                            <label htmlFor="quantity">Cantidad</label>
                            <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => handleInputChange(e as any, "quantity")} />
                        </div>

                        <div className="field">
                            <label htmlFor="category">Categoría</label>
                            <InputText id="category" value={product.category} onChange={(e) => handleInputChange(e, "category")} />
                        </div>

                        <div>
                            <div className="field">
                                <label htmlFor="image">Imagen</label>
                                <InputText
                                    id="image"
                                    value={imageName}
                                    onChange={() => {}}
                                    disabled={false}
                                />
                            </div>

                            <div>
                                <button onClick={handleUpload} disabled={loading}>Subir Imagen</button>
                                {loading && <p>Subiendo...</p>}
                                {imageUrl && !loading && (
                                    <div>
                                        <h3>Imagen subida:</h3>
                                        <img src={imageUrl} alt="Imagen subida" width="300" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="inventoryStatus">Estado de Inventario</label>
                            <Dropdown
                                id="inventoryStatus"
                                value={product.inventoryStatus}
                                options={['disponible', 'bajo', 'AGOTADO']}
                                onChange={(e) => handleInputChange(e, "inventoryStatus")}
                                placeholder="Selecciona un estado de inventario"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="rating">Calificación</label>
                            <Rating
                                id="rating"
                                value={product.rating}
                                onChange={(e) => handleInputChange(e, "rating")}
                                cancel={false}
                                stars={5}
                            />
                        </div>

                        <div className="flex justify-content-end">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                            <Button label="Crear" icon="pi pi-check" onClick={handleSubmit} />
                        </div>
                    </div>
                )}
            </Dialog>

        </>
    );
};

export default NewProductModal;
