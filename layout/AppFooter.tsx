/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            2025 ®
            by
            <span className="font-medium ml-2">Jose Jeampier Jara Salas</span>
        </div>
    );
};

export default AppFooter;
