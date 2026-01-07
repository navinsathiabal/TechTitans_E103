import React, { useState } from 'react';
import { db } from '../lib/db';
import { generateImage, generateCaptions, generateHashtags, getStylePreset } from '../lib/stabilityAI';
import { Upload, Image as ImageIcon, Send, Wand2, UserPlus, Clock, Sparkles } from 'lucide-react';
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
        if (!content.trim()) {
            alert('Please describe what you\'re promoting first!');
            return;
        }

        setIsGenerating(true);

        try {
            // Determine the best style preset based on product description
            const stylePreset = getStylePreset(content);

            // Check if API key is configured
            const hasApiKey = import.meta.env.VITE_STABILITY_API_KEY && 
                             import.meta.env.VITE_STABILITY_API_KEY !== 'your_stability_ai_api_key_here';

            // Generate image using Stability AI (or fallback)
            const generatedImageUrl = await generateImage(content, {
                width: 1024,
                height: 1024,
                style: stylePreset,
                steps: 30,
                cfgScale: 7,
            });

            // Generate captions and hashtags
            const aiCaptions = generateCaptions(content);
            const aiHashtags = generateHashtags(content);

            // Get current time for scheduling suggestion
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const scheduleSuggestion = `Tomorrow at 9:00 AM (High Engagement)`;

            setGenerated({
                image: imageFile || generatedImageUrl,
                captions: aiCaptions,
                hashtags: aiHashtags,
                scheduleSuggestion: scheduleSuggestion,
                styleUsed: hasApiKey ? stylePreset : 'stock-photo',
                usingFallback: !hasApiKey && !imageFile,
            });
        } catch (error) {
            console.error('Error generating content:', error);
            alert(`Failed to generate content: ${error.message}`);
        } finally {
            setIsGenerating(false);
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


                            {generated.usingFallback ? (
                                <div className="ai-info-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                                    <Sparkles size={14} />
                                    <span>Using stock photo - Add Stability AI key in .env for AI generation</span>
                                </div>
                            ) : generated.styleUsed && (
                                <div className="ai-info-badge">
                                    <Sparkles size={14} />
                                    <span>Generated with {generated.styleUsed.replace(/-/g, ' ')} style</span>
                                </div>
                            )}


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