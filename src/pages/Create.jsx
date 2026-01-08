
import React, { useState } from 'react';
import { db } from '../lib/db';
import { Upload, Image as ImageIcon, Send, Wand2, UserPlus, Clock, ChevronRight, X, Instagram, Check, Link } from 'lucide-react';
import './Create.css';

export default function Create() {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [generated, setGenerated] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestedTechnicians, setSuggestedTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState(null);
    const [user, setUser] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [appliedIds, setAppliedIds] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

    React.useEffect(() => {
        db.getUser().then(setUser);
        db.getCollaborators().then(data => {
            // Randomize or filter based on context
            setSuggestedTechnicians(data.slice(0, 3));
        });
    }, []);

    const filterTechnicians = (prompt) => {
        db.getCollaborators().then(data => {
            const lowerPrompt = prompt.toLowerCase();
            let filtered = data;
            if (lowerPrompt.match(/(shirt|dress|jeans|hoodie|wear|fashion|outfit|style|cloth|bag|wallet)/)) {
                filtered = data.filter(t => t.role === "Photographer" || t.tags.includes("Lifestyle"));
            } else if (lowerPrompt.match(/(cream|skin|oil|face|beauty|glow|serum|makeup|soap)/)) {
                filtered = data.filter(t => t.role === "Video Editor" || t.tags.includes("Product"));
            } else if (lowerPrompt.match(/(tech|app|digital|software|mouse|keyboard|laptop|phone|gadget|device|monitor)/)) {
                filtered = data.filter(t => t.role === "Web Developer" || t.role === "Graphic Design");
            }
            setSuggestedTechnicians(filtered.slice(0, 3));
        });
    };

    const handleSendInterest = (id) => {
        if (appliedIds.includes(id)) return;
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            setAppliedIds(prev => [...prev, id]);
        }, 1200);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        const prompt = content.toLowerCase();
        let aiImage = "https://images.unsplash.com/photo-1493612276216-9c78370631f3?auto=format&fit=crop&w=800&q=80"; // Default
        let aiCaptions = [];
        let aiHashtags = "";

        // Product Context Logic (Simulating AI for text & fallback image)
        if (prompt.match(/(shirt|dress|jeans|hoodie|wear|fashion|outfit|style|cloth|bag|wallet)/)) {
            aiImage = "https://loremflickr.com/800/800/fashion,style"; // Fashion
            aiCaptions = [
                "Elevate your style with the " + (content || "latest collection") + ". ✨",
                "Fit check! ✅ Showing off our new " + (content || "arrivals") + ".",
                "Comfort meets style. The " + (content || "look") + " you've been waiting for."
            ];
            aiHashtags = "#Apparel #StyleInspo #OOTD #NewSeason";
        }
        else if (prompt.match(/(cream|skin|oil|face|beauty|glow|serum|makeup|soap)/)) {
            aiImage = "https://loremflickr.com/800/800/skincare,beauty"; // Beauty
            aiCaptions = [
                "Get that natural glow with " + (content || "our essentials") + ". 🌿",
                "Self-care sort of day featuring " + (content || "our favorites") + ". ✨",
                "Pure ingredients, powerful results. Discover " + (content || "beauty") + "."
            ];
            aiHashtags = "#Skincare #BeautyRoutine #GlowUp #SelfCare";
        }
        else if (prompt.match(/(chair|table|lamp|decor|home|sofa|bed|room|wood|ceramic)/)) {
            aiImage = "https://loremflickr.com/800/800/furniture,interior"; // Home
            aiCaptions = [
                "Transform your space with " + (content || "this piece") + ". 🏠",
                "Interior goals. Featuring our " + (content || "collection") + ".",
                "Crafted for comfort and design. Meet the " + (content || "new addition") + "."
            ];
            aiHashtags = "#InteriorDesign #HomeDecor #DreamHome #Artisan";
        }
        else if (prompt.match(/(tech|app|digital|software|mouse|keyboard|laptop|phone|gadget|device|monitor)/)) {
            aiImage = "https://loremflickr.com/800/800/technology,gadget"; // Tech

            aiCaptions = [
                "Innovation meeting simplicity. 💡 " + (content || ""),
                "Level up your workflow with " + (content || "our new tools") + ". 🚀",
                "Future-proof your setup today. #TechLife"
            ];
            aiHashtags = "#Tech #Startup #Innovation #DigitalGrowth #Setup";
        }
        else {
            // Generic / Dynamic Fallback
            // Try to find a relevant image using the user's own words
            const stopWords = ['the', 'and', 'new', 'our', 'with', 'for', 'this', 'that'];
            const keywords = prompt.split(' ')
                .filter(w => w.length > 2 && !stopWords.includes(w))
                .slice(0, 2) // Take top 2 significant words
                .join(',');

            const searchTags = keywords || "product,business"; // Fallback if no keywords found
            aiImage = `https://loremflickr.com/800/800/${searchTags}`;

            aiCaptions = [
                "Introducing: " + (content || "The next big thing") + ". Experience quality like never before.",
                "Detailed look at " + (content || "our product") + ". Designed for those who appreciate craftsmanship.",
                "Why we love " + (content || "this") + ": It stands out in every way. ✨"
            ];
            aiHashtags = "#ProductDesign #Quality #SmallBiz #" + (keywords.split(',')[0] || "MustHave");
        }

        // STABILITY AI API CALL
        if (!imageFile && content.trim()) {
            try {
                const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer sk-5irx8EMwGPC7KA10UD7bzxcLQejBfLEwnLfxdJYeJeebM8b1",
                    },
                    body: JSON.stringify({
                        text_prompts: [
                            {
                                text: content + ", photorealistic, 8k, cinematic lighting, high quality, realistic texture",
                                weight: 1,
                            },
                            {
                                text: "cartoon, illustration, 2d, painting, drawing, anime, vector art, graphic, watermark, text, signature, low quality, blurry",
                                weight: -1,
                            }
                        ],
                        style_preset: "photographic",
                        cfg_scale: 7,
                        height: 1024,
                        width: 1024,
                        samples: 1,
                        steps: 30,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.artifacts && data.artifacts.length > 0) {
                        aiImage = `data:image/png;base64,${data.artifacts[0].base64}`;
                    }
                } else {
                    console.warn("Stability AI generation failed, falling back to stock image.", await response.text());
                }
            } catch (error) {
                console.error("Error generating image:", error);
            }
        }

        setGenerated({
            image: imageFile || aiImage,
            captions: aiCaptions,
            hashtags: aiHashtags,
            scheduleSuggestion: "Tomorrow at 9:00 AM (High Engagement)"
        });
        filterTechnicians(content);
        setIsGenerating(false);
    };

    const handleConnect = () => {
        setShowAuthModal(true);
    };

    const confirmAuth = async () => {
        setShowAuthModal(false);
        setIsConnecting(true);
        // Simulate Token Exchange
        await new Promise(r => setTimeout(r, 1500));
        const updatedUser = await db.updateUser({ instagram_connected: true });
        setUser(updatedUser);
        setIsConnecting(false);
    };

    const handlePost = async () => {
        if (!generated) return;
        setIsPosting(true);
        try {
            await db.postToInstagram({
                image: generated.image,
                caption: generated.captions[0],
                hashtags: generated.hashtags
            });
            setPostSuccess(true);
            setTimeout(() => setPostSuccess(false), 3000);
        } catch (error) {
            alert("Failed to post: " + error.message);
        } finally {
            setIsPosting(false);
        }
    };

    const handleCaptionSwap = (index) => {
        if (!generated) return;
        const newCaptions = [...generated.captions];
        const selected = newCaptions[index]; // The one we clicked (from the slice, so index needs adjustment if slicing)
        // Wait, the UI maps `generated.captions.slice(1)`. 
        // So index 0 in the UI list is actually index 1 in the main array.
        // Let's pass the ACTUAL content string or the real index.
        // Easier: Just swap the main (0) with the clicked one.

        // Let's restart:
        const main = newCaptions[0];
        // The list displayed is slice(1), so item at map index i is at newCaptions[i+1]
        const targetIndex = index + 1;

        newCaptions[0] = newCaptions[targetIndex];
        newCaptions[targetIndex] = main;

        setGenerated({
            ...generated,
            captions: newCaptions
        });
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
                        <div className="quick-prompts">
                            <span>Try:</span>
                            {["New Summer Floral Dress", "Vitamin C Face Serum", "Modern Oak Coffee Table", "Wireless Gaming Mouse"].map(text => (
                                <button key={text} className="prompt-chip" onClick={() => setContent(text)}>
                                    {text}
                                </button>
                            ))}
                        </div>
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
                                {!user?.instagram_connected ? (
                                    <button
                                        className="btn-action primary"
                                        onClick={handleConnect}
                                        disabled={isConnecting}
                                        style={{ background: '#0095f6', borderColor: '#0095f6' }}
                                    >
                                        {isConnecting ? (
                                            "Connecting..."
                                        ) : (
                                            <><Link size={16} /> Connect Instagram</>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className={`btn-action primary ${postSuccess ? 'success' : ''}`}
                                        onClick={handlePost}
                                        disabled={isPosting || postSuccess}
                                    >
                                        {isPosting ? (
                                            `Posting to @${user?.businessName?.replace(/\s+/g, '') || 'Business'}...`
                                        ) : postSuccess ? (
                                            <><Check size={16} /> Posted!</>
                                        ) : (
                                            <><Instagram size={16} /> Post to Instagram</>
                                        )}
                                    </button>
                                )}
                                <button className="btn-action">
                                    <Clock size={16} /> {generated.scheduleSuggestion}
                                </button>
                                <button className="btn-action outline">
                                    <UserPlus size={16} /> Hire Editor
                                </button>
                            </div>

                            <div className="caption-selector">
                                <h4>Alternative Captions (Click to Swap)</h4>
                                {generated.captions.slice(1).map((cap, i) => (
                                    <div
                                        key={i}
                                        className="caption-option"
                                        onClick={() => handleCaptionSwap(i)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {cap}
                                    </div>
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

            {/* Suggestions Section */}
            {generated && (
                <div className="suggestions-section animate-enter">
                    <div className="section-header">
                        <h3>Not satisfied with the result?</h3>
                        <p>Collaborate with top-tier technicians to get professional-grade assets.</p>
                    </div>
                    <div className="tech-suggestions-grid">
                        {suggestedTechnicians.map(tech => (
                            <div key={tech.id} className="glass-panel tech-mini-card" onClick={() => setSelectedTech(tech)}>
                                <div className="tech-info">
                                    <div className="avatar__small">{tech.name[0]}</div>
                                    <div className="tech-meta">
                                        <h4>{tech.name}</h4>
                                        <span className="tech-role">{tech.role}</span>
                                    </div>
                                </div>
                                <div className="tech-tags">
                                    {tech.tags.slice(0, 2).map(tag => <span key={tag} className="mini-tag">{tag}</span>)}
                                </div>
                                <button
                                    className={`btn-connect ${appliedIds.includes(tech.id) ? 'success' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleSendInterest(tech.id); }}
                                    disabled={isApplying && !appliedIds.includes(tech.id)}
                                >
                                    {appliedIds.includes(tech.id) ? "Interest Sent!" : <><Send size={14} /> Send Interest</>}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Technician Detail Modal */}
            {selectedTech && (
                <div className="modal-overlay" onClick={() => setSelectedTech(null)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedTech(null)}><X size={20} /></button>

                        <div className="modal-header">
                            <h2>{selectedTech.name}</h2>
                            <span className="highlight-text">{selectedTech.role}</span>
                        </div>

                        <div className="modal-body">
                            <p className="bio">{selectedTech.bio}</p>

                            <div className="meta-grid">
                                <div className="meta-item">
                                    <label>Rate</label>
                                    <span>{selectedTech.rate}</span>
                                </div>
                                <div className="meta-item">
                                    <label>Experience</label>
                                    <span>{selectedTech.exp}</span>
                                </div>
                                <div className="meta-item">
                                    <label>Contact</label>
                                    <span>{selectedTech.phone}</span>
                                </div>
                                <div className="meta-item">
                                    <label>Email</label>
                                    <span>{selectedTech.email}</span>
                                </div>
                            </div>

                            <button
                                className={`btn-primary full-width mt-4 ${appliedIds.includes(selectedTech.id) ? 'success' : ''}`}
                                onClick={() => handleSendInterest(selectedTech.id)}
                                disabled={isApplying || appliedIds.includes(selectedTech.id)}
                            >
                                {appliedIds.includes(selectedTech.id) ? "Interest Sent! Please wait" : (
                                    <>
                                        Send Official Interest <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simulated OAuth Modal */}
            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="oauth-modal bg-white text-black" onClick={e => e.stopPropagation()}>
                        <div className="oauth-header">
                            <Instagram size={32} />
                            <h3>Instagram Requests</h3>
                        </div>
                        <div className="oauth-body">
                            <div className="oauth-user">
                                <div className="avatar__small" style={{ background: '#ddd', color: '#333' }}>G</div>
                                <span>Growth Assistant App</span>
                            </div>
                            <p>is requesting access to:</p>
                            <ul className="oauth-permissions">
                                <li>• Manage your content</li>
                                <li>• Post on your behalf</li>
                                <li>• Read your profile info</li>
                            </ul>
                            <div className="oauth-alert">
                                ⚠️ This is a simulated permission screen. In a real app, this is where you grant access.
                            </div>
                        </div>
                        <div className="oauth-footer">
                            <button className="btn-text" onClick={() => setShowAuthModal(false)}>Cancel</button>
                            <button className="btn-oauth" onClick={confirmAuth}>Allow Access</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
