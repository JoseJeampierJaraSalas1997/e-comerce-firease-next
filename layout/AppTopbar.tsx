import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { classNames } from 'primereact/utils';
import cart from '@/public/demo/images/icons8-carrito-de-la-compra-cargado.gif'
import { CartItem } from '@/app/(main)/uikit/list/page';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Swal from 'sweetalert2';
import { Badge } from 'primereact/badge';

interface DentalTip {
    icon: string;
    title: string;
    message: string;
}

const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [flag, setFlag] = useState<boolean>(false)
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [currentMessage, setCurrentMessage] = useState<DentalTip | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    useEffect(() => {
        const data = localStorage.getItem('token');
        if (!data) {
            setFlag(true);
        }
    }, []);

    useEffect(() => {
        if (isUpdating) return;

        setIsUpdating(true);

        const updateCart = () => {
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
            setCartItems(existingCart);
            const totalQuantity = existingCart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalQuantity);
            const subtotal = existingCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            setTotalAmount(subtotal);
        };

        updateCart();

        setIsUpdating(false);
    }, [cartItems, cartCount, isUpdating]);

    const increaseQuantity = (id: string) => {
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (id: string) => {
        const updatedCart = cartItems.map(item =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id: string) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const completeOrder = () => {
        if (!customerName) {
            Swal.fire({
                title: 'Falta información',
                text: 'Por favor ingrese su nombre.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const orderDetails = cartItems
            .map(item => `- ${item.product.name} (${item.quantity})`)
            .join('\n');

        const message = `Hola, vengo de tu página web. Mi nombre es: ${customerName}.\n\nQuiero adquirir los siguientes productos:\n${orderDetails}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/+51968097419?text=${encodedMessage}`; // Reemplaza <TU_NUMERO_DE_TELEFONO> por el número de WhatsApp.
        setIsSidebarOpen(false)

        Swal.fire({
            title: '¿Confirmar pedido?',
            text: '¿Está seguro de que desea completar el pedido?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar por WhatsApp',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(whatsappURL, '_blank');
                Swal.fire({
                    title: 'Pedido confirmado',
                    text: 'Su pedido ha sido confirmado por WhatsApp.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
                setCartItems([]);
                localStorage.setItem('cart', JSON.stringify([]));
            }
        });
    };

    const dentalTips = [
        {
            icon: '🦷',
            title: 'Consejo del día',
            message: "Cepíllate los dientes después de cada comida para una mejor salud bucal"
        },
        {
            icon: '⭐',
            title: 'Recordatorio',
            message: "El uso diario de hilo dental previene las caries interproximales"
        },
        {
            icon: '💫',
            title: '¿Sabías que?',
            message: "Una buena higiene dental está relacionada con la salud cardiovascular"
        },
        {
            icon: '🪥',
            title: 'Tip profesional',
            message: "Cambia tu cepillo dental cada 3 meses para mantener una limpieza efectiva"
        },
        {
            icon: '✨',
            title: 'Dato importante',
            message: "La primera visita al dentista debe ser antes del primer año de edad"
        }
    ];

    useEffect(() => {
        const showRandomMessage = () => {
            setIsVisible(false);

            // Esperamos a que termine la animación de salida
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * dentalTips.length);
                setCurrentMessage(dentalTips[randomIndex]);
                setIsVisible(true);
            }, 500);
        };

        showRandomMessage();
        const intervalId = setInterval(showRandomMessage, 15000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="layout-topbar">
            {currentMessage ? (
                <div className="px-4 py-2 w-full max-w-3xl mx-auto">
                    <div
                        className={`
                            relative overflow-hidden
                            bg-gradient-to-r from-blue-50 to-indigo-50
                            border border-blue-200
                            shadow-lg rounded-xl
                            transition-all duration-500 ease-in-out
                            ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}
                            `}
                    >
                        <div className="flex items-center p-4">
                            <div className="flex-shrink-0 mr-4">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">{currentMessage.icon}</span>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                    {currentMessage.title}
                                </p>
                                <p className="text-sm text-blue-700 leading-5">
                                    {currentMessage.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {!flag && (
                <>
                    <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                        <i className="pi pi-bars" />
                    </button>
                    <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                        <i className="pi pi-ellipsis-v" />
                    </button>
                </>
            )}
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={() => setIsSidebarOpen(true)}>
                    <img src={cart.src} alt="" style={{ width: '70%' }} />
                    <span
                        className="absolute top-0 right-0 flex items-center justify-center"
                        style={{
                            backgroundColor: cartCount > 1 ? '#dc2626' : cartCount > 0 ? '#16a34a' : 'transparent',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: '9999px',
                        }}
                    >
                        
                    </span>
                </button>
                <Badge value={`${cartCount}`} severity="success"></Badge>
            </div>

            <Sidebar visible={isSidebarOpen} position="right" onHide={() => setIsSidebarOpen(false)} style={{ width: '50vw' }} header="Mi carrito">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total a pagar</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>S/. {item.product.price}</td>
                                <td>S/. {(item.product.price * item.quantity).toFixed(2)}</td>
                                <div className="flex space-x-2">
                                    <Button
                                        icon="pi pi-plus"
                                        onClick={() => increaseQuantity(item.id)}
                                        className="p-button-rounded p-button-success p-button-outlined p-button-sm"
                                        tooltip="Aumentar cantidad"
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <Button
                                        icon="pi pi-minus"
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="p-button-rounded p-button-warning p-button-outlined p-button-sm"
                                        tooltip="Disminuir cantidad"
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        onClick={() => removeItem(item.id)}
                                        className="p-button-rounded p-button-danger p-button-outlined p-button-sm"
                                        tooltip="Eliminar producto"
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <Card title="Resumen de Pedido">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-semibold text-lg text-gray-700">Total a pagar:</span>
                                <span className="text-xl text-red-600 font-bold">S/. {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <InputText
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Ingrese su nombre"
                                className="w-full"
                            />
                        </div>
                        {cartItems.length > 0 && (
                            <Button
                                label="Completar Pedido"
                                onClick={completeOrder}
                                className="p-button-primary mt-4 w-full"
                            />
                        )}
                    </Card>

                </div>
            </Sidebar>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
