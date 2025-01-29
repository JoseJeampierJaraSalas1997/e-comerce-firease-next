/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebaseConfig';

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    
    const containerClassName = `surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden ${layoutConfig.inputStyle === 'filled' ? 'p-input-filled' : ''}`;

    const handleLoginSuccess = (userCredential: any) => {
        const user = userCredential.user;
        console.log("Este es el token de session: ",userCredential);
        
        if (user) {
            
            user.getIdToken().then((token: string) => {
                localStorage.setItem('token_with_google', user.accessToken);

                // Redirigir al usuario
                router.push('/uikit/list');
            });
        }
    };

    const handleLoginFailure = (error: any) => {
        console.log('Login failed', error);
        // Puedes manejar el error y mostrar un mensaje si lo deseas
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            handleLoginSuccess(result);
        } catch (error) {
            handleLoginFailure(error);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenida Dra. Mayhua!</div>
                            <span className="text-600 font-medium">Iniciar Sesion</span>
                        </div>
                        
                        <div className="text-center mb-5">
                            <Button label="Sign In with Google" icon="pi pi-google" className="p-button-outlined p-button-rounded w-full" onClick={signInWithGoogle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
