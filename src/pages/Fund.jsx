
import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Users, HandCoins, Rocket, Star, ExternalLink, ArrowRight } from 'lucide-react';
import './Fund.css';

export default function Fund() {
    const [activeTab, setActiveTab] = useState('fund'); // fund | collab
    const [collabs, setCollabs] = useState([]);

    useEffect(() => {
        db.getCollaborators().then(setCollabs);
    }, []);

    return (
        <div className="page-container">
            <header className="fund-header">
                <h1>Community Engine</h1>
                <p>Raise micro-capital or hire local creatives to scale.</p>
            </header>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'fund' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fund')}
                >
                    <HandCoins size={18} /> Fund Projects
                </button>
                <button
                    className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collab')}
                >
                    <Users size={18} /> Hire Talent
                </button>
            </div>

            <div className="animate-enter">
                {activeTab === 'fund' ? (
                    <div className="fund-grid">
                        <div className="glass-panel pitch-card">
                            <div className="pitch-header">
                                <Rocket className="pitch-icon" />
                                <h2>Launch a Campaign</h2>
                            </div>
                            <p className="pitch-desc">
                                The AI will draft a compelling story for your business to raise funds from loyal customers.
                            </p>

                            <div className="form-group">
                                <label>Goal Amount (₹)</label>
                                <input type="number" placeholder="5000" />
                            </div>

                            <div className="form-group">
                                <label>What is this for?</label>
                                <input type="text" placeholder="e.g. New Espresso Machine" />
                            </div>

                            <button className="btn-primary full-width">Generate Fundraising Pitch</button>
                        </div>

                        <div className="glass-panel active-campaigns">
                            <h3>Active Campaigns</h3>
                            <div className="campaign-item">
                                <div className="camp-top">
                                    <span className="camp-title">Expansion to Downtown</span>
                                    <span className="camp-status">Live</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '65%' }}></div>
                                </div>
                                <div className="camp-stats">
                                    <span>₹6,500 raised</span>
                                    <span>of ₹10,000</span>
                                </div>
                                <button className="btn-outline sm">Share Link <ExternalLink size={14} /></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="collab-grid">
                        <div className="collab-search glass-panel">
                            <h3>Find a Technician</h3>
                            <div className="search-tags">
                                <span className="tag active">All</span>
                                <span className="tag">Video Editors</span>
                                <span className="tag">Photographers</span>
                                <span className="tag">Web Devs</span>
                            </div>
                        </div>

                        <div className="collab-list">
                            {collabs.map(c => (
                                <div key={c.id} className="glass-panel collab-card">
                                    <div className="collab-profile">
                                        <div className="collab-avatar">{c.name[0]}</div>
                                        <div>
                                            <h4>{c.name}</h4>
                                            <span className="collab-role">{c.role}</span>
                                        </div>
                                    </div>
                                    <div className="collab-tags">
                                        {c.tags.map(t => <span key={t}>{t}</span>)}
                                    </div>
                                    <div className="collab-meta">
                                        <div className="rate">{c.rate}</div>
                                        <div className="rating"><Star size={14} fill="gold" stroke="none" /> 4.9</div>
                                    </div>
                                    <button className="btn-primary full-width mt-2">Hire Now <ArrowRight size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
