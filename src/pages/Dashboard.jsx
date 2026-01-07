
import React, { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { TrendingUp, Users, IndianRupee, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([
        { label: "Community Reach", value: "2.4k", change: "+12%", icon: Users, color: "#3b82f6" },
        { label: "Growth Index", value: "85%", change: "+5%", icon: TrendingUp, color: "#10b981" },
        { label: "Funds Raised", value: "₹0", change: "0%", icon: IndianRupee, color: "#f59e0b" },
        { label: "Active Plans", value: "1", change: "", icon: Calendar, color: "#8b5cf6" },
    ]);

    useEffect(() => {
        db.getUser().then(setUser);
    }, []);

    if (!user) return <div className="page-container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Engagement',
                data: [120, 190, 300, 500, 200, 300, 450],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Reach',
                data: [80, 100, 200, 300, 400, 350, 600],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1f2937',
                titleColor: '#f3f4f6',
                bodyColor: '#d1d5db',
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#9ca3af' } },
            y: { grid: { color: '#374151', drawBorder: false }, ticks: { color: '#9ca3af' } }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="page-container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                    Welcome back, <span className="gradient-text">{user.businessName}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Here is your growth overview for today.
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: `${stat.color}15`,
                                color: stat.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={24} />
                            </div>
                            {stat.change && (
                                <span style={{
                                    color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: stat.change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '20px'
                                }}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="dashboard-grid">
                <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} className="text-blue-500" style={{ color: 'var(--primary)' }} />
                        Activity Overview
                    </h3>
                    <div style={{ flex: 1, position: 'relative', minHeight: '250px' }}>
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0' }}>Success Checklist</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: "Connect Instagram", done: true },
                            { label: "Create first Campaign", done: false },
                            { label: "Post weekly content", done: true },
                            { label: "Update Business Bio", done: false }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '8px', background: item.done ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${item.done ? 'var(--success)' : 'var(--border)'}`,
                                    backgroundColor: item.done ? 'var(--success)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    {item.done && <Users size={12} color="white" />}
                                </div>
                                <span style={{
                                    color: item.done ? 'var(--text-dim)' : 'var(--text-main)',
                                    textDecoration: item.done ? 'line-through' : 'none',
                                    fontSize: '0.9rem'
                                }}>{item.label}</span>
                            </div>
                        ))}
                        <button className="btn-outline" style={{ marginTop: 'auto', width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}>View All Tasks</button>
                    </div>
                </div>
            </div>
            <style>{`
        @media (max-width: 900px) {
           .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
