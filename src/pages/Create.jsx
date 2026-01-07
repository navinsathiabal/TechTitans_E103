
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
                        Authorization: "Bearer ",
                    },
                    body: JSON.stringify({
                        text_prompts: [
                            {
                                text: content,
                                weight: 1,
                            },
                        ],
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
        setIsGenerating(false);
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
        </div>
    );
}
