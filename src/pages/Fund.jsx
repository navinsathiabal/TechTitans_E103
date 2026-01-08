
import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Users, HandCoins, Sparkles, Copy, X, Briefcase, UserCircle, ArrowRight } from 'lucide-react';
import './Fund.css';

export default function Fund() {
    const [activeTab, setActiveTab] = useState('fund'); // fund | collab
    const [userMode, setUserMode] = useState('business'); // business (hiring) | creative (finding work)

    // Data
    const [talents, setTalents] = useState([]);
    const [gigs, setGigs] = useState([]);

    // Pitch Generator State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchResult, setPitchResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Detail Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [appliedIds, setAppliedIds] = useState([]);

    useEffect(() => {
        db.getCollaborators().then(setTalents);
        if (db.getGigs) db.getGigs().then(setGigs);
    }, []);

    const handleGeneratePitch = () => {
        if (!pitchTopic) return;
        setIsGenerating(true);
        setTimeout(() => {
            const topic = pitchTopic.toLowerCase();
            let story = "";
            let tags = ["#SupportLocal", "#SmallBizGrowth"];

            if (topic.includes("expand") || topic.includes("location") || topic.includes("branch")) {
                story = `Hey everyone! We have some big news to share. Thanks to your incredible support, we are looking to ${pitchTopic.replace(/\.$/, '')}. This new chapter will allow us to serve more of you in the community we love. We're raising funds to cover the initial renovation and permits. Be a part of our journey and help us bring this vision to life!`;
                tags.push("#Expansion", "#NewLocation", "#Growth");
            } else if (topic.includes("machine") || topic.includes("equipment") || topic.includes("tool")) {
                story = `To keep up with demand and improve our quality, we are fundraising for ${pitchTopic}. This equipment is a game-changer for us—it means faster service and better consistency for you. We've been saving up, but we need this final push to make it happen. Every contribution brings us one step closer!`;
                tags.push("#Upgrade", "#Quality", "#Craftsmanship");
            } else if (topic.includes("hire") || topic.includes("team") || topic.includes("staff")) {
                story = `Our family is growing! We are raising capital to ${pitchTopic}. Investing in great talent is how we ensure the best experience for every customer who walks through our doors. Your support directly helps create local jobs and sustains our commitment to excellence.`;
                tags.push("#Hiring", "#LocalJobs", "#TeamWork");
            } else {
                // Generic Fallback
                story = `Hi community! We are launching a campaign to ${pitchTopic.replace(/\.$/, '')}. This is a huge milestone for our small business. We've been bootstrapping for 2 years, and this capital allows us to take the next leap. Support us today and get exclusive early access to our future offerings!`;
                tags.push("#Crowdfunding", "#CommunityFirst");
            }

            setPitchResult({
                story: story,
                keywords: tags
            });
            setIsGenerating(false);
        }, 1500);
    };

    const handleApply = (id) => {
        if (appliedIds.includes(id)) return;
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            setAppliedIds(prev => [...prev, id]);
        }, 1000);
    };

    return (
        <div className="page-container">
            <header className="fund-header">
                <h1>Community Engine</h1>
                <p>Crowdfunding Tools & Talent Marketplace.</p>
            </header>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'fund' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fund')}
                >
                    <HandCoins size={18} /> Pitch Generator
                </button>
                <button
                    className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collab')}
                >
                    <Users size={18} /> Marketplace
                </button>
            </div>

            <div className="animate-enter">
                {activeTab === 'fund' ? (
                    <div className="fund-grid">
                        <div className="glass-panel stats-panel">
                            <div className="panel-header">
                                <HandCoins className="icon-gold" />
                                <h2>Campaign Performance</h2>
                            </div>
                            <div className="stats-content">
                                <div className="progress-circle-container">
                                    <div className="progress-circle" style={{ '--percent': '75' }}>
                                        <div className="inner-label">
                                            <span className="percent-val">75%</span>
                                            <span className="percent-label">Reaching Goal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="stats-details">
                                    <div className="stat-card">
                                        <label>Amount Received</label>
                                        <div className="stat-val">₹3,75,000</div>
                                    </div>
                                    <div className="stat-card">
                                        <label>Campaign Goal</label>
                                        <div className="stat-val goal">₹5,00,000</div>
                                    </div>
                                    <div className="stat-card">
                                        <label>Backers</label>
                                        <div className="stat-val">128</div>
                                    </div>
                                    <div className="stat-card">
                                        <label>Time Left</label>
                                        <div className="stat-val warning">12 Days</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel pitch-builder">
                            <div className="panel-header">
                                <Sparkles className="icon-gold" />
                                <h2>Crowdfunding Story AI</h2>
                            </div>
                            <p className="desc-text">Describe your goal (e.g., New Espresso Machine, Expansion). We'll write a compelling story for Kickstarter/GoFundMe.</p>

                            <div className="input-group">
                                <textarea
                                    placeholder="What are you raising money for? e.g. Opening a second location in Downtown..."
                                    rows="3"
                                    value={pitchTopic}
                                    onChange={e => setPitchTopic(e.target.value)}
                                />
                                <button className="btn-primary" onClick={handleGeneratePitch} disabled={isGenerating}>
                                    {isGenerating ? "Writing..." : "Generate Story"}
                                </button>
                            </div>

                            {pitchResult && (
                                <div className="pitch-result animate-enter">
                                    <div className="result-group">
                                        <label>Your Story / Bio</label>
                                        <div className="result-box">
                                            {pitchResult.story}
                                        </div>
                                    </div>
                                    <div className="result-group">
                                        <label>Recommended Tags</label>
                                        <div className="tags-list">
                                            {pitchResult.keywords.map(k => <span key={k} className="tag-chip">{k}</span>)}
                                        </div>
                                    </div>
                                    <button className="btn-outline sm mt-4">
                                        <Copy size={14} /> Copy to Clipboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="collab-container">
                        <div className="role-toggle">
                            <button
                                className={`toggle-option ${userMode === 'business' ? 'active' : ''}`}
                                onClick={() => setUserMode('business')}
                            >
                                <Briefcase size={16} /> I'm Hiring (Find Talent)
                            </button>
                            <button
                                className={`toggle-option ${userMode === 'creative' ? 'active' : ''}`}
                                onClick={() => setUserMode('creative')}
                            >
                                <UserCircle size={16} /> I'm a Creative (Find Work)
                            </button>
                        </div>

                        {userMode === 'business' ? (
                            <div className="listings-grid">
                                {talents.map(t => (
                                    <div key={t.id} className="glass-panel listing-card" onClick={() => setSelectedItem(t)}>
                                        <div className="card-top">
                                            <div className="avatar__">{t.name[0]}</div>
                                            <div>
                                                <h4>{t.name}</h4>
                                                <span className="role-badge">{t.role}</span>
                                            </div>
                                        </div>
                                        <div className="card-stats">
                                            <span>⭐ {t.exp} Exp</span>
                                            <span className="rate">{t.rate}</span>
                                        </div>
                                        <button className="btn-primary full-width mt-2">View Profile</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="listings-grid">
                                {gigs.map(g => (
                                    <div key={g.id} className="glass-panel listing-card" onClick={() => setSelectedItem(g)}>
                                        <div className="card-top">
                                            <div className="avatar__ proj">P</div>
                                            <div>
                                                <h4>{g.title}</h4>
                                                <span className="role-badge">{g.type}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p>{g.desc}</p>
                                        </div>
                                        <div className="card-stats">
                                            <span className="rate">{g.budget}</span>
                                            <button
                                                className={`btn-outline sm ${appliedIds.includes(g.id) ? 'success' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); handleApply(g.id); }}
                                                disabled={isApplying && !appliedIds.includes(g.id)}
                                            >
                                                {appliedIds.includes(g.id) ? "Interest Sent!" : "Apply"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedItem(null)}><X size={20} /></button>

                        <div className="modal-header">
                            <h2>{selectedItem.name || selectedItem.title}</h2>
                            <span className="highlight-text">{selectedItem.role || selectedItem.type}</span>
                        </div>

                        <div className="modal-body">
                            {selectedItem.posterName && (
                                <div className="posted-by">
                                    <label>Posted By</label>
                                    <p className="poster-name">{selectedItem.posterName}</p>
                                </div>
                            )}
                            <p className="bio">{selectedItem.bio || selectedItem.desc}</p>

                            <div className="meta-grid">
                                <div className="meta-item">
                                    <label>Rate/Budget</label>
                                    <span>{selectedItem.rate || selectedItem.budget}</span>
                                </div>
                                {selectedItem.phone && (
                                    <>
                                        <div className="meta-item">
                                            <label>{selectedItem.name ? "Contact Number" : "Mobile Number"}</label>
                                            <span>{selectedItem.phone}</span>
                                        </div>
                                        <div className="meta-item">
                                            <label>{selectedItem.name ? "Email Address" : "Company Email"}</label>
                                            <span>{selectedItem.email}</span>
                                        </div>
                                    </>
                                )}
                                {selectedItem.tags && (
                                    <div className="meta-item">
                                        <label>Specialties</label>
                                        <div className="tags-row">
                                            {selectedItem.tags.map(t => <span key={t} className="tiny-tag">{t}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className={`btn-primary full-width mt-4 ${appliedIds.includes(selectedItem.id) ? 'success' : ''}`}
                                onClick={() => handleApply(selectedItem.id)}
                                disabled={isApplying || appliedIds.includes(selectedItem.id)}
                            >
                                {appliedIds.includes(selectedItem.id) ? "Interest Sent! Please wait" : (
                                    <>
                                        {selectedItem.name ? `Send Interest to ${selectedItem.name.split(' ')[0]}` : "Apply for Project"} <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
