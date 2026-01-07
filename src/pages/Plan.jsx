
import React, { useState } from 'react';
import { db } from '../lib/db';
import { Calendar as CalIcon, IndianRupee, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import './Plan.css';

export default function Plan() {
    const [step, setStep] = useState('input');
    const [formData, setFormData] = useState({
        budget: '',
        hours: '',
        niche: '',
        location: '',
        description: ''
    });
    const [plan, setPlan] = useState(null);

    const handleSuggest = async () => {
        setStep('loading');
        setTimeout(() => {
            // STRICT LOGIC
            const budget = parseInt(formData.budget) || 0;
            const hours = parseInt(formData.hours) || 0;

            let strategy = "Aggressive Organic Growth";
            let platforms = ["Instagram", "Google Business"];
            let strictMessage = "";

            if (budget < 5000) {
                strictMessage = "STRICT MODE: Your budget (₹" + budget + ") is too low for paid ads. We withdrew 'Facebook Ads' from the proposal. Focus is 100% Organic.";
                strategy = "Grassroots Community Building";
            } else if (hours < 3) {
                strictMessage = "STRICT MODE: Strict time limit detected (" + hours + "hrs). We denied 'YouTube' (requires 5+ hrs). Switched to high-efficiency 'Reels'.";
                strategy = "High-Efficiency Content Ops";
            } else {
                strategy = "Hybrid Paid & Organic";
                platforms.push("Facebook Ads");

                // Dynamic Split based on Budget
                if (budget > 100000) {
                    strictMessage = "High Budget Detected (₹" + budget + "). We shifted strategy to Aggressive Paid Scaling: 20% Organic / 80% Paid.";
                    platforms.push("Google Search Ads", "Influencer Collabs");
                } else if (budget > 50000) {
                    strictMessage = "Substantial Resources. We adjusted the split for faster growth: 40% Organic / 60% Paid.";
                    platforms.push("Instagram Boosts");
                } else if (budget > 20000) {
                    strictMessage = "Healthy Budget. Allocation set to Growth Mode: 60% Organic / 40% Paid.";
                } else {
                    strictMessage = "Resources approved. We've allocated a balanced mix of 70% Organic and 30% Paid Reach.";
                }
            }

            // Dynamic Scheduling based on Hours
            let daysToPost = 2;
            if (hours >= 10) daysToPost = 6;
            else if (hours >= 6) daysToPost = 4;
            else if (hours >= 3) daysToPost = 3;

            const taskPool = [
                { day: "Monday", task: "Content Creation (Deep Work)", time: "10:00 AM", type: "content", detail: "Film 3 short-form videos (Reels) back-to-back. Focus on 'How-to' or 'Product Demo'." },
                { day: "Tuesday", task: "Community Engagement", time: "11:00 AM", type: "engagement", detail: "Reply to all comments, DMs, and comment on 10 partner accounts." },
                { day: "Wednesday", task: "Mid-Week Social Proof", time: "2:00 PM", type: "proof", detail: "Repost a user review to your Story. Add a 'Link' sticker to shop." },
                { day: "Thursday", task: "Educational Carousel", time: "5:00 PM", type: "value", detail: "Design 4 slides in Canva answering a Common Customer Question." },
                { day: "Friday", task: "Sales/Promo Push", time: "6:00 PM", type: "sales", detail: "Post the best video from Monday. Add a clear CTA: 'Order Now' or 'Book Slot'." },
                { day: "Saturday", task: "Admin & Review", time: "12:00 PM", type: "admin", detail: "Check 'Insights'. Note which posts got new followers. Plan next week." },
            ];

            // Select tasks based on frequency
            const selectedSchedule = taskPool.filter((_, index) => {
                if (daysToPost === 2) return index === 0 || index === 4; // Mon & Fri
                if (daysToPost === 3) return index === 0 || index === 2 || index === 4; // Mon, Wed, Fri
                if (daysToPost === 4) return index === 0 || index === 1 || index === 3 || index === 4;
                return true; // All
            });

            // Dynamic Key Actions Calculation
            let generatedKeyActions = [
                "Optimize Bio with Keywords relevant to " + (formData.niche || "your niche"),
                "Setup 'Shop' tab or Service Link in Bio"
            ];

            if (budget < 5000) {
                generatedKeyActions.push("DM 5 new local prospects daily (Zero Cost)");
                generatedKeyActions.push("Join 3 Facebook Groups related to " + (formData.niche || "your industry"));
            } else if (budget > 50000) {
                generatedKeyActions.push("Review Ad Performance metrics daily");
                generatedKeyActions.push("A/B Test Creative variations weekly");
            }

            if (hours < 3) {
                generatedKeyActions.push("Batch create all content on Sunday (Time Saving)");
                generatedKeyActions.push("Use auto-replies for FAQs");
            } else {
                generatedKeyActions.push("Engage with 10 industry leaders daily (15 mins)");
                generatedKeyActions.push("Go Live once a week for Q&A");
            }

            const generatedPlan = {
                strategy,
                platforms,
                strictMessage,
                keyActions: generatedKeyActions,
                schedule: selectedSchedule
            };

            db.createPlan(generatedPlan);
            setPlan(generatedPlan);
            setStep('result');
        }, 1500);
    };

    return (
        <div className="page-container">
            <header className="plan-header">
                <h1>Growth Planner</h1>
                <p>Tell us your constraints. The AI will <span className="highlight">strictly optimize</span> your week.</p>
            </header>

            {step === 'input' && (
                <div className="glass-panel form-panel">
                    <div className="form-grid">

                        <div className="form-group">
                            <label>Monthly Marketing Budget (₹)</label>
                            <div className="input-wrapper">
                                <IndianRupee size={18} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="e.g 5000"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Time Available (Hours/Week)</label>
                            <div className="input-wrapper">
                                <Clock size={18} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="e.g 4"
                                    value={formData.hours}
                                    onChange={e => setFormData({ ...formData, hours: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Business Niche</label>
                            <input
                                type="text"
                                className="simple-input"
                                placeholder="e.g. Handmade Candles"
                                value={formData.niche}
                                onChange={e => setFormData({ ...formData, niche: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea
                                className="simple-input"
                                rows="4"
                                placeholder="Any specific goals or ideas?"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ resize: 'none', padding: '0.75rem 1rem' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Location (City)</label>
                            <div className="input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input
                                    type="text"
                                    list="indian-cities"
                                    placeholder="e.g. Mumbai, Maharashtra"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                                <datalist id="indian-cities">
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Ahmedabad">Ahmedabad</option>
                                    <option value="Jaipur">Jaipur</option>
                                    <option value="Surat">Surat</option>
                                </datalist>
                            </div>
                        </div>

                        <button onClick={handleSuggest} className="btn-primary full-width">
                            Generate Strict Plan
                        </button>
                    </div>
                </div>
            )}

            {step === 'loading' && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Analyzing constraints and market data...</p>
                </div>
            )}

            {step === 'result' && plan && (
                <div className="animate-enter plan-results">

                    <div className="strict-alert">
                        <AlertTriangle className="alert-icon" />
                        <div>
                            <h3>AI Consultant Note</h3>
                            <p>{plan.strictMessage}</p>
                        </div>
                    </div>

                    <div className="results-grid">
                        <div className="schedule-section">
                            <h2><CalIcon className="section-icon" /> Your Week</h2>
                            <div className="glass-panel schedule-list">
                                {plan.schedule.map((item, idx) => (
                                    <div key={idx} className="schedule-item">
                                        <div className="schedule-left">
                                            <div className="day-label">{item.day}</div>
                                            <div className="task-info">
                                                <p className="task-title">{item.task}</p>
                                                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.detail}</p>
                                                <span className="task-tag">{item.type}</span>
                                            </div>
                                        </div>
                                        <div className="time-label">{item.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="strategy-section">
                            <h2>Strategy</h2>
                            <div className="glass-panel strategy-card">
                                <div className="strategy-label">Focus</div>
                                <div className="strategy-title gradient-text">{plan.strategy}</div>

                                <div className="strategy-label">Approved Platforms</div>
                                <div className="platform-tags">
                                    {plan.platforms.map(p => (
                                        <span key={p} className="platform-tag">
                                            <CheckCircle size={14} /> {p}
                                        </span>
                                    ))}
                                </div>

                                <div className="strategy-label" style={{ marginTop: '1.5rem' }}>Execution Protocol</div>
                                <ul style={{ margin: 0, padding: '0 0 0 1rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                    {plan.keyActions.map((action, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{action}</li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => setStep('input')} className="btn-outline full-width">
                                Refine Constraints
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
