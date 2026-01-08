
const DB_KEYS = {
    USER: 'growth_assist_user',
    PLANS: 'growth_assist_plans',
    CAMPAIGNS: 'growth_assist_campaigns',
    COLLABORATIONS: 'growth_assist_collabs'
};

// Initial Logic / Simulation Helpers
export const SIMULATED_DELAY = 800; // ms to simulate network

const initialUser = {
    name: "Alex Johnson",
    businessName: "Artisan Woodworks",
    niche: "Handcrafted Furniture",
    location: "Portland, OR",
    logo: null, // URL if we had one
    instagram_connected: false // Simulation state
};

// --- DATA ACCESS LAYER ---

export const db = {
    // User Profile
    getUser: async () => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        const data = localStorage.getItem(DB_KEYS.USER);
        if (!data) {
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(initialUser));
            return initialUser;
        }
        return JSON.parse(data);
    },

    updateUser: async (updates) => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        const current = JSON.parse(localStorage.getItem(DB_KEYS.USER) || JSON.stringify(initialUser));
        const updated = { ...current, ...updates };
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(updated));
        return updated;
    },

    // Plans (Marketing Schedules)
    getPlans: async () => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        return JSON.parse(localStorage.getItem(DB_KEYS.PLANS) || '[]');
    },

    createPlan: async (planData) => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        const plans = JSON.parse(localStorage.getItem(DB_KEYS.PLANS) || '[]');
        const newPlan = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...planData };
        plans.unshift(newPlan);
        localStorage.setItem(DB_KEYS.PLANS, JSON.stringify(plans));
        return newPlan;
    },

    // Create Module (Posts/Content)
    savePost: async (postData) => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        // In a real app we'd save to a 'posts' collection. 
        // For now we just return success to simulate the "Saved to Calendar" action.
        return { success: true, id: Date.now().toString() };
    },

    // Social Media Integration
    postToInstagram: async (postData) => {
        await new Promise(r => setTimeout(r, 2000)); // Longer delay for "upload"
        // Simulate API call to Instagram Graph API
        console.log("Posting to Instagram:", postData);

        // Return success always for demo purposes
        return { success: true, platformId: "ig_" + Date.now(), url: "https://instagram.com/p/mock_post_id" };
    },

    // Campaigns (Fundraising)
    getCampaigns: async () => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        return JSON.parse(localStorage.getItem(DB_KEYS.CAMPAIGNS) || '[]');
    },

    createCampaign: async (campaignData) => {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        const campaigns = JSON.parse(localStorage.getItem(DB_KEYS.CAMPAIGNS) || '[]');
        const newCamp = {
            id: Date.now().toString(),
            raised: 0,
            backers: 0,
            createdAt: new Date().toISOString(),
            ...campaignData
        };
        campaigns.unshift(newCamp);
        localStorage.setItem(DB_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
        return newCamp;
    },

    // Collaborations
    getCollaborators: async () => {
        // Simulated "Database" of technicians
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        return [
            { id: 'c1', name: "Sarah Jenkins", role: "Photographer", rate: "₹2,500/hr", tags: ["Product", "Lifestyle"], bio: "award-winning photographer with 5 years exp.", exp: "5 Yrs", phone: "+91 98765 43210", email: "sarah.j@example.com" },
            { id: 'c2', name: "Mike Chen", role: "Video Editor", rate: "₹5,000/project", tags: ["Reels", "TikTok"], bio: "Specialist in viral short-form content.", exp: "3 Yrs", phone: "+91 87654 32109", email: "mike.c@example.com" },
            { id: 'c3', name: "Design Studio A", role: "Graphic Design", rate: "₹1,500/hr", tags: ["Branding", "Logos"], bio: "Full service branding agency.", exp: "Agency", phone: "+91 76543 21098", email: "contact@studioa.com" },
            { id: 'c4', name: "Arjun Reddy", role: "Web Developer", rate: "₹10,000/site", tags: ["Shopify", "React"], bio: "E-commerce expert helping brands scale.", exp: "4 Yrs", phone: "+91 65432 10987", email: "arjun.dev@example.com" },
            { id: 'c5', name: "Priya Patel", role: "Social Manager", rate: "₹15,000/mo", tags: ["Strategy", "Posting"], bio: "I handle your community while you sleep.", exp: "2 Yrs", phone: "+91 54321 09876", email: "priya.p@example.com" },
        ];
    },

    async getGigs() {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY));
        return [
            { id: 'g1', title: "Product Shoot for Coffee Brand", budget: "₹15,000", type: "Photography", desc: "Need high-res shots for our new packaging.", posterName: "David Miller", phone: "+91 99988 77766", email: "david.m@coffeeroasters.com" },
            { id: 'g2', title: "Reel Editor Needed", budget: "₹2,000/video", type: "Video Editing", desc: "Ongoing work for a fast-paced fashion brand.", posterName: "Jessica Wong", phone: "+91 88877 66655", email: "jess.w@fashionlab.in" },
            { id: 'g3', title: "Logo Redesign", budget: "₹5,000", type: "Design", desc: "Minimalist redesign for a tech startup.", posterName: "Karthik Iyer", phone: "+91 77766 55544", email: "karthik@techpulse.io" },
            { id: 'g4', title: "Shopify Store Setup", budget: "₹20,000", type: "Web Dev", desc: "Full setup from scratch for a clothing line.", posterName: "Aman Gupta", phone: "+91 66655 44433", email: "aman@urbanfit.co" }
        ];
    }
};
