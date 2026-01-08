
import React, { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { TrendingUp, Users, IndianRupee, Calendar, CheckCircle2, X, ArrowRight } from 'lucide-react';
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
        { label: "Funds Raised", value: "₹3,75,000", change: "75%", icon: IndianRupee, color: "#f59e0b" },
        { label: "Active Plans", value: "1", change: "", icon: Calendar, color: "#8b5cf6" },
    ]);

    const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);

    const checklistItems = [
        { label: "Connect Instagram", done: false, desc: "Link your business profile to start analyzing engagement." },
        { label: "Create first Campaign", done: true, desc: "Launch your first community funding drive (Already Completed!)" },
        { label: "Post weekly content", done: false, desc: "Maintain consistency with at least 3 posts per week." },
        { label: "Update Business Bio", done: false, desc: "Ensure your story is compelling for new visitors." },
        { label: "Hire local talent", done: false, desc: "Find a creative to scale your production." },
        { label: "Analyze monthly growth", done: false, desc: "Review your Growth Index trends for improvements." }
    ];

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
                        {checklistItems.slice(0, 4).map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${item.done ? 'var(--success)' : 'var(--border)'}`,
                                    backgroundColor: item.done ? 'var(--success)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {item.done && <CheckCircle2 size={14} color="white" />}
                                </div>
                                <span style={{
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem'
                                }}>{item.label}</span>
                            </div>
                        ))}
                        <button
                            className="btn-outline"
                            style={{ marginTop: 'auto', width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
                            onClick={() => setIsTasksModalOpen(true)}
                        >
                            View All Tasks
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
        @media (max-width: 900px) {
           .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(8px);
        }
        
        .modal-content {
            width: 90%;
            max-width: 550px;
            padding: 2rem;
            position: relative;
            border: 1px solid var(--border);
            max-height: 85vh;
            overflow-y: auto;
        }
        
        .task-list-full {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            margin-top: 1.5rem;
        }
        
        .task-item-large {
            display: flex;
            gap: 1.25rem;
            padding: 1.25rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.2s;
        }
        
        .task-item-large:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        .task-info-large h4 {
            margin: 0 0 0.4rem 0;
            font-size: 1.1rem;
        }
        
        .task-info-large p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--text-dim);
            line-height: 1.4;
        }
      `}</style>

            {/* View All Tasks Modal */}
            {isTasksModalOpen && (
                <div className="modal-overlay" onClick={() => setIsTasksModalOpen(false)}>
                    <div className="modal-content glass-panel animate-enter" onClick={e => e.stopPropagation()}>
                        <button
                            className="close-btn"
                            onClick={() => setIsTasksModalOpen(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div className="modal-header" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Complete Journey</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Follow these steps to unlock full potential.</p>
                        </div>

                        <div className="task-list-full">
                            {checklistItems.map((item, i) => (
                                <div key={i} className="task-item-large">
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        border: `2px solid ${item.done ? 'var(--success)' : 'var(--border)'}`,
                                        backgroundColor: item.done ? 'var(--success)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        marginTop: '2px'
                                    }}>
                                        {item.done && <CheckCircle2 size={18} color="white" />}
                                    </div>
                                    <div className="task-info-large">
                                        <h4>{item.label}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-primary full-width"
                            style={{ marginTop: '2rem' }}
                            onClick={() => setIsTasksModalOpen(false)}
                        >
                            Got it <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
