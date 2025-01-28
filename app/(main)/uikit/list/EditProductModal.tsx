import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Demo } from '@/types';
import { Rating } from 'primereact/rating';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

interface EditProductModalProps {
    showModal: boolean;
    product: Demo.Product | null;
    onHide: () => void;
    onSave: (product: Demo.Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ showModal, product, onHide, onSave }) => {
    const [editedProduct, setEditedProduct] = useState<Demo.Product>({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        inventoryStatus: 'bajo',
        rating: 0,
        quantity: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setEditedProduct({
                ...product,
                inventoryStatus: product.inventoryStatus || 'bajo', // Default value if undefined
                rating: product.rating || 0, // Default value if undefined
            });
        }
    }, [product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
        const { value } = e.target;
        setEditedProduct((prev) => ({
            ...prev,
            [field]: value || "",
        }));
    };

    const handleDropdownChange = (e: { value: string }, field: string) => {
        setEditedProduct((prev) => ({
            ...prev,
            [field]: e.value,
        }));
    };

    const handleNumberChange = (value: number | null, field: string) => {
        setEditedProduct((prev) => ({
            ...prev,
            [field]: value ?? 0,
        }));
    };

    const handleSave = async () => {
        setLoading(true)
        await onSave(editedProduct);
        setLoading(false)
    };

    return (
        <Dialog
            header="Actualizar Producto"
            visible={showModal}
            onHide={onHide}
            modal
            style={{ width: '50vw' }}
        >
            {loading ? (
                <div className="flex justify-content-center p-mt-4">
                    <ProgressSpinner />
                </div>
            ) : (
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="name">Nombre</label>
                        <InputText
                            id="name"
                            value={editedProduct.name}
                            onChange={(e) => handleInputChange(e, "name")}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description">Descripción</label>
                        <InputText
                            id="description"
                            value={editedProduct.description}
                            onChange={(e) => handleInputChange(e, "description")}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="price">Precio</label>
                        <InputNumber
                            id="price"
                            value={editedProduct.price}
                            onValueChange={(e) => handleNumberChange(e.value as number, "price")}
                            mode="currency"
                            currency="PEN"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="category">Categoría</label>
                        <InputText
                            id="category"
                            value={editedProduct.category}
                            onChange={(e) => handleInputChange(e, "category")}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="image">Imagen</label>
                        <InputText
                            id="image"
                            value={editedProduct.image}
                            onChange={(e) => handleInputChange(e, "image")}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="inventoryStatus">Estado de Inventario</label>
                        <Dropdown
                            id="inventoryStatus"
                            value={editedProduct.inventoryStatus}
                            options={['disponible', 'bajo', 'AGOTADO']}
                            onChange={(e) => handleDropdownChange(e, "inventoryStatus")}
                            placeholder="Selecciona un estado de inventario"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="rating">Calificación</label>
                        <Rating
                            id="rating"
                            value={editedProduct.rating}
                            onChange={(e) => handleNumberChange(e.value as number, "rating")}
                            cancel={false}
                            stars={5}
                        />
                    </div>

                    <div className="flex justify-content-end">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={onHide}
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default EditProductModal;
