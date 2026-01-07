const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
const API_HOST = 'https://api.stability.ai';

/**
 * Generate an image using Stability AI
 * @param {string} prompt - The text description for image generation
 * @param {Object} options - Additional options for image generation
 * @returns {Promise<string>} - Base64 encoded image data URL
 */
export async function generateImage(prompt, options = {}) {
  if (!STABILITY_API_KEY || STABILITY_API_KEY === 'your_stability_ai_api_key_here') {
    console.warn('Stability AI API key not configured. Using fallback image.');
    return getFallbackImage(prompt);
  }

  const {
    width = 1024,
    height = 1024,
    steps = 30,
    cfgScale = 7,
    samples = 1,
    style = 'photographic', // photographic, digital-art, comic-book, fantasy-art, analog-film, neon-punk, isometric, low-poly, origami, line-art, cinematic, 3d-model, pixel-art
  } = options;

  try {
    const response = await fetch(
      `${API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: enhancePrompt(prompt),
              weight: 1,
            },
            {
              text: 'blurry, bad quality, distorted, ugly, low resolution, watermark, text',
              weight: -1,
            },
          ],
          cfg_scale: cfgScale,
          height: height,
          width: width,
          steps: steps,
          samples: samples,
          style_preset: style,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability AI API Error:', errorData);

      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Stability AI API key.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your Stability AI account.');
      } else {
        throw new Error(errorData.message || 'Failed to generate image');
      }
    }

    const responseJSON = await response.json();
    const image = responseJSON.artifacts[0];

    // Return as data URL for easy display
    return `data:image/png;base64,${image.base64}`;
  } catch (error) {
    console.error('Error generating image:', error);
    // Fallback to placeholder image on error
    return getFallbackImage(prompt);
  }
}

/**
 * Enhance the user's prompt for better image generation
 * @param {string} prompt - Original user prompt
 * @returns {string} - Enhanced prompt
 */
function enhancePrompt(prompt) {
  // Add quality modifiers to improve output
  const qualityModifiers = 'professional product photography, studio lighting, high quality, detailed, 4k, clean background';
  return `${prompt}, ${qualityModifiers}`;
}

/**
 * Get a fallback image when API is not available
 * @param {string} prompt - The original prompt
 * @returns {string} - Fallback image URL
 */
function getFallbackImage(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  // Category-based fallback images
  if (lowerPrompt.match(/(shirt|dress|jeans|hoodie|wear|fashion|outfit|style|cloth|bag|wallet)/)) {
    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(cream|skin|oil|face|beauty|glow|serum|makeup|soap|cosmetic)/)) {
    return 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(chair|table|lamp|decor|home|sofa|bed|room|wood|ceramic|furniture)/)) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(tech|app|digital|software|mouse|keyboard|laptop|phone|gadget|device|monitor)/)) {
    return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(gum|chewing|mint|candy|sweet|chocolate|lollipop|gummy)/)) {
    return 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(food|coffee|tea|drink|beverage|snack|meal|juice|soda)/)) {
    return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1024&q=80';
  } else if (lowerPrompt.match(/(candle|fragrance|scent|aromatherapy)/)) {
    return 'https://images.unsplash.com/photo-1602874801006-95ad5242f2ff?auto=format&fit=crop&w=1024&q=80';
  } else {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1024&q=80';
  }
}

/**
 * Generate captions using AI-like logic
 * @param {string} productDescription - Description of the product
 * @returns {Array<string>} - Array of caption suggestions
 */
export function generateCaptions(productDescription) {
  const prompt = productDescription.toLowerCase();
  let captions = [];

  // Category-specific captions
  if (prompt.match(/(shirt|dress|jeans|hoodie|wear|fashion|outfit|style|cloth|bag|wallet)/)) {
    captions = [
      `Elevate your style with ${productDescription}. ✨`,
      `Fit check! ✅ Showing off our new ${productDescription}.`,
      `Comfort meets style. The look you've been waiting for.`,
      `Your wardrobe just got an upgrade. 💫`,
    ];
  } else if (prompt.match(/(cream|skin|oil|face|beauty|glow|serum|makeup|soap|cosmetic)/)) {
    captions = [
      `Get that natural glow with ${productDescription}. 🌿`,
      `Self-care Sunday featuring ${productDescription}. ✨`,
      `Pure ingredients, powerful results. Discover beauty redefined.`,
      `Because you deserve to feel radiant every day. 💆‍♀️`,
    ];
  } else if (prompt.match(/(chair|table|lamp|decor|home|sofa|bed|room|wood|ceramic|furniture)/)) {
    captions = [
      `Transform your space with ${productDescription}. 🏠`,
      `Interior goals. Featuring our latest collection.`,
      `Crafted for comfort and design. Meet your new favorite piece.`,
      `Where style meets functionality. ✨`,
    ];
  } else if (prompt.match(/(tech|app|digital|software|mouse|keyboard|laptop|phone|gadget|device|monitor)/)) {
    captions = [
      `Innovation meets simplicity. 💡 ${productDescription}`,
      `Level up your workflow with ${productDescription}. 🚀`,
      `Future-proof your setup today. #TechLife`,
      `Designed for creators, built for performance. ⚡`,
    ];
  } else if (prompt.match(/(gum|chewing|mint|candy|sweet|chocolate|lollipop|gummy)/)) {
    captions = [
      `Fresh breath, fresh vibes. ${productDescription} 🌿`,
      `Your new go-to for that instant refresh. Try ${productDescription}! ✨`,
      `Flavor that lasts. Freshness you can count on. 😋`,
      `Pop one in and feel the difference. #FreshLife 🍃`,
    ];
  } else if (prompt.match(/(food|coffee|tea|drink|beverage|snack|meal|juice|soda)/)) {
    captions = [
      `Treat yourself to ${productDescription}. You deserve it! 😋`,
      `The perfect pick-me-up for any time of day. ☕`,
      `Flavor meets quality in every sip/bite. ✨`,
      `Your new favorite indulgence awaits. 🌟`,
    ];
  } else if (prompt.match(/(candle|fragrance|scent|aromatherapy)/)) {
    captions = [
      `Create the perfect ambiance with ${productDescription}. 🕯️`,
      `Handcrafted scents for your sanctuary. ✨`,
      `Light it up and let the stress melt away.`,
      `Because every moment deserves the perfect mood. 🌙`,
    ];
  } else {
    captions = [
      `Introducing: ${productDescription}. Experience quality like never before.`,
      `Detailed look at ${productDescription}. Designed for those who appreciate craftsmanship.`,
      `Why we love this: It stands out in every way. ✨`,
      `Elevate your everyday with ${productDescription}. 💫`,
    ];
  }

  return captions;
}

/**
 * Generate hashtags based on product description
 * @param {string} productDescription - Description of the product
 * @returns {string} - Hashtag string
 */
export function generateHashtags(productDescription) {
  const prompt = productDescription.toLowerCase();

  if (prompt.match(/(shirt|dress|jeans|hoodie|wear|fashion|outfit|style|cloth|bag|wallet)/)) {
    return '#Fashion #StyleInspo #OOTD #NewSeason #FashionDaily';
  } else if (prompt.match(/(cream|skin|oil|face|beauty|glow|serum|makeup|soap|cosmetic)/)) {
    return '#Skincare #BeautyRoutine #GlowUp #SelfCare #CleanBeauty';
  } else if (prompt.match(/(chair|table|lamp|decor|home|sofa|bed|room|wood|ceramic|furniture)/)) {
    return '#InteriorDesign #HomeDecor #DreamHome #Artisan #HomeStyle';
  } else if (prompt.match(/(tech|app|digital|software|mouse|keyboard|laptop|phone|gadget|device|monitor)/)) {
    return '#Tech #Startup #Innovation #DigitalGrowth #TechLife';
  } else if (prompt.match(/(gum|chewing|mint|candy|sweet|chocolate|lollipop|gummy)/)) {
    return '#FreshBreath #ChewingGum #Candy #SweetTooth #SnackTime';
  } else if (prompt.match(/(food|coffee|tea|drink|beverage|snack|meal|juice|soda)/)) {
    return '#Foodie #Delicious #FoodLover #Yummy #TreatYourself';
  } else if (prompt.match(/(candle|fragrance|scent|aromatherapy)/)) {
    return '#Candles #HomeFragrance #SelfCare #Aromatherapy #Cozy';
  } else {
    return '#ProductDesign #Quality #SmallBiz #Handmade #ShopSmall';
  }
}

/**
 * Get style preset based on product category
 * @param {string} productDescription - Description of the product
 * @returns {string} - Stability AI style preset
 */
export function getStylePreset(productDescription) {
  const prompt = productDescription.toLowerCase();

  if (prompt.match(/(tech|digital|software|app|futuristic)/)) {
    return 'digital-art';
  } else if (prompt.match(/(vintage|retro|classic|old)/)) {
    return 'analog-film';
  } else if (prompt.match(/(modern|minimal|clean|simple)/)) {
    return 'photographic';
  } else if (prompt.match(/(artistic|creative|unique|abstract)/)) {
    return 'fantasy-art';
  } else if (prompt.match(/(neon|vibrant|bright|colorful)/)) {
    return 'neon-punk';
  } else {
    return 'photographic'; // Default to photographic style
  }
}