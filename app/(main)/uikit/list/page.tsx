'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';
import type { Demo } from '@/types';
import { getProducts } from '@/app/api/firestoreFecth/get';
import { deleteProduct } from '@/app/api/firestoreFecth/delete';
import NewProductModal from './newItem';
import EditProductModal from './EditProductModal';
import { updateProduct } from '@/app/api/firestoreFecth/patch';
import Swal from 'sweetalert2';

export interface CartItem {
    id: string;
    product: Demo.Product;
    quantity: number;
}

const ListDemo = () => {
    const [dataViewValue, setDataViewValue] = useState<Demo.Product[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Demo.Product[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const [filters, setFilters] = useState<{ [key: string]: string | null }>({});
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string | null }[]>([]);
    const [stockOptions, setStockOptions] = useState<{ label: string; value: string | null }[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Demo.Product | null>(null);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [flag, setFlag] = useState(false);
    const sortOptions = [
        { label: 'Mayor Precio', value: '!price' },
        { label: 'Menor Precio', value: 'price' },
    ];
    const fetchProducts = async () => {
        const data = await getProducts();
        setDataViewValue(data);
        setCategoryOptions(generateFilterOptions(data, 'category'));
        setStockOptions(generateFilterOptions(data, 'inventoryStatus'));
      };

    useEffect(() => {
        const toke = localStorage.getItem('token_with_google')
        if (toke) {
            setFlag(true)
        }
        fetchProducts();
        setGlobalFilterValue('');
      }, []);

    const generateFilterOptions = (data: Demo.Product[], key: keyof Demo.Product) => {
        const uniqueValues = Array.from(new Set(data.map((item) => item[key]).filter(Boolean))) as string[];
        return [
            { label: 'Todos', value: null },
            ...uniqueValues.map((value) => ({ label: capitalize(value), value })),
        ];
    };

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    const [isModalVisible, setIsModalVisibleNewForms] = useState(false);
    const showModal = () => setIsModalVisibleNewForms(true);
    const hideModal = () => {setIsModalVisibleNewForms(false); fetchProducts()}
    

    const onFilterChange = (key: string, value: string | null) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
        applyFilters(globalFilterValue, { ...filters, [key]: value });
    };    

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        applyFilters(value, filters);
    };

    const applyFilters = (globalFilter: string, filters: { [key: string]: string | null }) => {
        let filtered = dataViewValue;

        // Filtrar por texto global
        if (globalFilter.length > 0) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        // Filtrar dinámicamente por las propiedades seleccionadas
        for (const key of Object.keys(filters)) {
            const value = filters[key];
            if (value) {
                filtered = filtered.filter((product) => product[key] === value);
            }
        }

        setFilteredValue(filtered);
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (productId) {
            try {
                await deleteProduct(productId);
                await fetchProducts();
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto eliminado!',
                    text: 'El producto ha sido eliminado exitosamente.',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el producto. Intenta nuevamente.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'ID inválido',
                text: 'Por favor, ingresa un ID de producto válido.',
                confirmButtonText: 'Aceptar'
            });
        }
    };
      
    const generateUniqueId = (): string => {
        const now = new Date();
        const id = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}` +
                   `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}` +
                   `${now.getSeconds().toString().padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`;
        return id;
    };

    const addToCart = (product: Demo.Product) => {
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
        
        const existingProductIndex = existingCart.findIndex(item => item.product.id === product.id);

        if (existingProductIndex > -1) {
            existingCart[existingProductIndex].quantity += 1;
        } else {
            existingCart.push({
                id: generateUniqueId(),
                product,
                quantity: 1,
            });
        }
        localStorage.setItem('cart', JSON.stringify(existingCart));
        alert('Producto agregado al carrito');
    };
    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown
                value={sortKey}
                options={sortOptions}
                optionLabel="label"
                placeholder="Filtro por precio"
                onChange={onSortChange}
            />
            <Dropdown
                value={filters['category']}
                options={categoryOptions}
                optionLabel="label"
                placeholder="Filtro por categoría"
                onChange={(e) => onFilterChange('category', e.value)}
            />
            <Dropdown
                value={filters['inventoryStatus']}
                options={stockOptions}
                optionLabel="label"
                placeholder="Filtro por stock"
                onChange={(e) => onFilterChange('inventoryStatus', e.value)}
            />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar aquí" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            {flag && (
                <Button onClick={showModal}>Crear Producto</Button>
            )}
        </div>
    );

    const dataviewListItem = (data: Demo.Product) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={`/demo/images/product/depsoito_dental.png`} alt={data.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false} className="mb-2"></Rating>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">S/. {data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Agregar al carrito" disabled={data.inventoryStatus == 'AGOTADO'} size="small" className="mb-2" onClick={() => addToCart(data)}></Button>
                        <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: Demo.Product) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>
                            {data.inventoryStatus}
                        </span>
                    </div>
            
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img src={data.image && data.image.startsWith('http') ? data.image : '/demo/images/product/depsoito_dental.png'} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false} />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">S/. {data.price}</span>
                        <Button icon="pi pi-shopping-cart" disabled={data.inventoryStatus === 'AGOTADO'} onClick={() => addToCart(data)} />
                        {flag && (
                            <><Button icon="pi pi-pencil" onClick={() => handleUpdateProduct(data.id as string)}/>
                            <Button icon="pi pi-trash" onClick={() => handleDeleteProduct(data.id as string)}/></>)}
                    </div>
                </div>
            </div>
        );
    };
    

    const itemTemplate = (data: Demo.Product, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };


    const handleUpdateProduct = (productId: string) => {
        const product = dataViewValue.find((p) => p.id === productId);
        setSelectedProduct(product || null);
        setShowModalUpdate(true);
    };

    const handleSaveProduct = async (updatedProduct: Demo.Product) => {
        console.log("Este es el id del producto: ",updatedProduct.id);
        
        if (updatedProduct.id) {
            try {
                await updateProduct(updatedProduct.id, updatedProduct); 
                setShowModalUpdate(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto actualizado!',
                    text: 'El producto ha sido actualizado exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await fetchProducts();
                        setShowModalUpdate(false);
                    }
                });
            } catch (error) {
                console.error("Error al actualizar el producto", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el producto. Intenta nuevamente.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'ID de producto inválido',
                text: 'Por favor, asegúrate de que el producto tenga un ID válido.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Productos</h5>
                    <NewProductModal visible={isModalVisible} onHide={hideModal} />
                    {/* Aquí agregamos el modal */}
                    <EditProductModal 
                        showModal={showModalUpdate}
                        product={selectedProduct}
                        onHide={() => setShowModalUpdate(false)} 
                        onSave={handleSaveProduct}
                    />
                    <DataView
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}
                    ></DataView>
                </div>
            </div>
        </div>
    );
};

export default ListDemo;
