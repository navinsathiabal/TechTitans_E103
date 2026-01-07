
import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <div className="animate-enter">
                    {children}
                </div>
            </main>
        </div>
    );
}
