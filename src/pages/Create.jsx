
import React, { useState } from 'react';
import { db } from '../lib/db';
import { Upload, Image as ImageIcon, Send, Wand2, UserPlus, Clock } from 'lucide-react';
import './Create.css';

export default function Create() {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [generated, setGenerated] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file));
        }
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI Generation
        setTimeout(() => {
            setGenerated({
                image: imageFile || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                captions: [
                    "✨ Handcrafted with love. #Artisan #SmallBiz",
                    "Transform your space with our latest collection. 🌿 #Decor",
                    "Quality that speaks for itself. Discover more today! 💫"
                ],
                hashtags: "#SmallBusiness #Handmade #SupportLocal #Growth",
                scheduleSuggestion: "Today at 5:30 PM (Peak Time)"
            });
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="page-container">
            <header className="create-header">
                <h1>Content Studio</h1>
                <p>Upload a product shot or let us design one for you.</p>
            </header>

            <div className="create-grid">
                {/* Left: Input & Editor */}
                <div className="glass-panel editor-panel">
                    <div className="form-group">
                        <label>What are we promoting?</label>
                        <textarea
                            rows="4"
                            placeholder="e.g. Our new summer lavender candle collection..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    <div className="upload-area">
                        <input type="file" id="img-upload" hidden onChange={handleImageUpload} />
                        <label htmlFor="img-upload" className="upload-label">
                            {imageFile ? (
                                <img src={imageFile} alt="Preview" className="preview-img" />
                            ) : (
                                <div className="upload-placeholder">
                                    <ImageIcon size={32} />
                                    <span>Upload Image (Optional)</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <button
                        className="btn-primary full-width"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Generating Magic..." : (
                            <><Wand2 size={18} style={{ marginRight: 8 }} /> Generate Assets</>
                        )}
                    </button>
                </div>

                {/* Right: Preview & Actions */}
                <div className="glass-panel preview-panel">
                    {generated ? (
                        <div className="animate-enter">
                            <div className="preview-card">
                                <div className="phone-mockup">
                                    <div className="phone-header">
                                        <div className="avatar">G</div>
                                        <span>GrowthAI_Official</span>
                                    </div>
                                    <img src={generated.image} alt="Generated" className="post-image" />
                                    <div className="post-actions">
                                        <span>❤️</span> <span>💬</span> <span>✈️</span>
                                    </div>
                                    <div className="post-caption">
                                        <span className="username">GrowthAI_Official</span> {generated.captions[0]}
                                        <br />
                                        <span className="hashtags">{generated.hashtags}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-action primary">
                                    <Send size={16} /> Post Now
                                </button>
                                <button className="btn-action">
                                    <Clock size={16} /> {generated.scheduleSuggestion}
                                </button>
                                <button className="btn-action outline">
                                    <UserPlus size={16} /> Hire Editor
                                </button>
                            </div>

                            <div className="caption-selector">
                                <h4>Alternative Captions</h4>
                                {generated.captions.slice(1).map((cap, i) => (
                                    <div key={i} className="caption-option">{cap}</div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Wand2 size={48} className="empty-icon" />
                            <h3>Ready to Create</h3>
                            <p>Your AI-generated assets will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
