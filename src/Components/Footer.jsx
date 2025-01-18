import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            padding: '2rem',
            background: 'rgba(25, 25, 35, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ba0b3',
            textAlign: 'center',
            fontSize: '0.9rem'
        }}>
            <p>© 2025 Watson. All rights reserved.</p>
        </footer>
    );
}