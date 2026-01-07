
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, PenTool, HandCoins, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/plan", icon: Calendar, label: "Plan Growth" },
        { to: "/create", icon: PenTool, label: "Create Content" },
        { to: "/fund", icon: HandCoins, label: "Fund & Collab" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">G</div>
                <span className="brand-text">Growth<span className="highlight">AI</span></span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item">
                    <Settings size={20} />
                    Settings
                </button>
                <button className="nav-item">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
