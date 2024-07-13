import React from 'react';
import '../styles/Menu.css';
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';

function Menucomp() {
    return (
        <div className="menu-container">
            <a href='/dashboard'>
                <DashboardOutlined style={{ fontSize: '28px', color: '#878787' }} />
            </a>
            <a href='/profile'>
                <UserOutlined style={{ fontSize: '28px', color: '#878787' }} />
            </a>
        </div>
    );
}

export default Menucomp;
