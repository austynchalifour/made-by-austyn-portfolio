const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to serve logo from root if public/assets doesn't have it yet, or serve the root logo specifically
app.get('/logo.webp', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo.webp'));
});

// Static Database for Portfolio Data
const projects = [
  {
    id: 1,
    title: "OpenLevel Funnel Builder",
    category: "Web Apps",
    tags: ["HTML", "Vanilla JS", "Flexbox CSS", "Live Preview"],
    description: "A professional-grade, open-source page builder and funnel generator. Enforces consistent flexbox alignments, full-width media embeds, and flawless real-time layouts in Preview Mode.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    link: "#",
    badge: "Featured App"
  },
  {
    id: 2,
    title: "VSCode Custom Fork (Desktop IDE)",
    category: "Desktop Apps",
    tags: ["Electron", "Monaco Editor", "Node.js", "Integrated Shell"],
    description: "A custom, branded desktop IDE. Integrates a modular file explorer, dynamic tabbed workspaces, a fully functional terminal overlay, and advanced syntax highlighting configurations.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
    link: "#",
    badge: "System Tool"
  },
  {
    id: 3,
    title: "Desktop Pet Studio",
    category: "Desktop Apps",
    tags: ["Electron", "Overlay API", "Canvas Canvas", "Win32 IPC"],
    description: "An innovative desktop companion app allowing AI-driven pixel art pets to roam across system windows. Features highly transparent overlays, custom interactive AI behaviors, and strict secure IPC integrations.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    link: "#",
    badge: "Interactive"
  },
  {
    id: 4,
    title: "Office Suite Desktop Clone",
    category: "Desktop Apps",
    tags: ["Electron", "Rich Text API", "Formula Engine", "Custom Tabs"],
    description: "A massive Microsoft Word and Excel productivity clone running as a unified desktop application. Incorporates modular ribbon toolbars, full text editors, cell formula computations, and file system read/write controls.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    link: "#",
    badge: "Productivity"
  },
  {
    id: 5,
    title: "TomoCode (GitHub-Driven Tamagotchi)",
    category: "Web Apps",
    tags: ["Node.js", "GitHub API", "Canvas Animations", "State Machine"],
    description: "A gamified web portal linking virtual pet evolution to real-time GitHub activity. Fetches commit patterns and maps dev frequency to pet stages to incentivize consistent daily coding habits.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
    link: "#",
    badge: "Gamified Web"
  },
  {
    id: 6,
    title: "YouTube PiP: Floating Mini Player",
    category: "Web Apps",
    tags: ["Chrome API", "Picture-in-Picture API", "JavaScript", "Manifest V3"],
    description: "A popular Chrome extension that pops any YouTube video into a floating Picture-in-Picture mini-player. Allows seamless multitasking while browsing other tabs, featuring instant overlays and hotkeys.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    link: "https://chromewebstore.google.com/detail/jgaejjkeplicnhgacfilfkalpaoebblf?utm_source=item-share-cb",
    badge: "Chrome Extension"
  }
];

const skills = [
  { name: "JavaScript (ES6+)", category: "frontend", proficiency: 95, icon: "fab fa-js" },
  { name: "CSS Grid & Flexbox", category: "frontend", proficiency: 98, icon: "fab fa-css3-alt" },
  { name: "Vanilla HTML5 / SEO", category: "frontend", proficiency: 92, icon: "fab fa-html5" },
  { name: "Responsive UI/UX Layouts", category: "frontend", proficiency: 96, icon: "fas fa-laptop-code" },
  { name: "Node.js & Express", category: "backend", proficiency: 90, icon: "fab fa-node-js" },
  { name: "Electron Desktop Apps", category: "backend", proficiency: 94, icon: "fas fa-desktop" },
  { name: "PHP Development", category: "backend", proficiency: 82, icon: "fab fa-php" },
  { name: "MySQL / Database Design", category: "backend", proficiency: 85, icon: "fas fa-database" },
  { name: "Git / GitHub Workflow", category: "tools", proficiency: 94, icon: "fab fa-github" },
  { name: "NPM / Dependency Mgmt", category: "tools", proficiency: 88, icon: "fas fa-cubes" },
  { name: "PostCSS & Preprocessors", category: "tools", proficiency: 85, icon: "fas fa-palette" },
  { name: "Performance Optimization", category: "tools", proficiency: 90, icon: "fas fa-tachometer-alt" }
];

// --- REST API Endpoints ---

// 1. Get Projects
app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: projects });
});

// 2. Get Skills
app.get('/api/skills', (req, res) => {
  res.json({ success: true, data: skills });
});

// 3. Dynamic Hiring / Project Estimate Calculator API
app.post('/api/estimate', (req, res) => {
  try {
    const { duration = 1, complexity = 'standard', features = [] } = req.body;
    
    // Base weekly rate in USD
    const BASE_WEEKLY_RATE = 1500;
    
    // Complexity multiplier
    let complexityMultiplier = 1.0;
    if (complexity === 'premium') complexityMultiplier = 1.3;
    if (complexity === 'enterprise') complexityMultiplier = 1.6;
    
    // Feature costs
    const featureCostSheet = {
      'auth': 500,
      'payments': 600,
      'cms': 800,
      'chat': 700,
      'seo': 400
    };
    
    let featuresTotal = 0;
    const addedFeatures = [];
    
    features.forEach(feat => {
      if (featureCostSheet[feat]) {
        featuresTotal += featureCostSheet[feat];
        addedFeatures.push(feat);
      }
    });
    
    // Calculations
    const weeks = Math.max(1, parseInt(duration) || 1);
    const subtotal = (BASE_WEEKLY_RATE * weeks * complexityMultiplier) + featuresTotal;
    
    // Volume discount (longer timelines get overall percentage discount)
    let discountPercent = 0;
    if (weeks >= 8) discountPercent = 15;
    else if (weeks >= 4) discountPercent = 10;
    
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const total = subtotal - discountAmount;
    
    res.json({
      success: true,
      data: {
        weeklyRate: BASE_WEEKLY_RATE,
        weeks: weeks,
        complexityMultiplier: complexityMultiplier,
        featuresTotal: featuresTotal,
        subtotal: Math.round(subtotal),
        discountPercentage: discountPercent,
        discountAmount: discountAmount,
        total: Math.round(total),
        timeline: `${weeks} Week${weeks > 1 ? 's' : ''}`
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid estimation parameters." });
  }
});

// 4. Contact Form Submission Endpoint (Persisting to messages.json)
app.post('/api/contact', async (req, res) => {
  const { name, email, company, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing. Please complete Name, Email, and Message."
    });
  }
  
  // Basic Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }
  
  const newMessage = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: name.trim(),
    email: email.trim(),
    company: company ? company.trim() : "None",
    subject: subject ? subject.trim() : "General Inquiry",
    message: message.trim()
  };
  
  const filePath = path.join(__dirname, 'messages.json');
  
  try {
    let existingMessages = [];
    
    // Try to read existing messages
    try {
      const data = await fs.readFile(filePath, 'utf8');
      existingMessages = JSON.parse(data);
      if (!Array.isArray(existingMessages)) {
        existingMessages = [];
      }
    } catch (readError) {
      // File doesn't exist or is corrupted, start fresh
      existingMessages = [];
    }
    
    existingMessages.push(newMessage);
    
    // Save back to messages.json with pretty-printing
    await fs.writeFile(filePath, JSON.stringify(existingMessages, null, 2), 'utf8');
    
    res.status(200).json({
      success: true,
      message: `Thank you, ${name}! Your inquiry has been secured. Austyn will get in touch with you at ${email} within 24 hours.`
    });
  } catch (error) {
    console.error("Failed to write message:", error);
    res.status(500).json({
      success: false,
      message: "A server error occurred while processing your message. Please try again later."
    });
  }
});

// 4b. One-Time Offer ($100 OTO) Order Endpoint (Persisting to messages.json)
app.post('/api/oto-order', async (req, res) => {
  const { name, email, projectType, brief, paymentMethod = 'Simulated Card' } = req.body;
  
  // Validation
  if (!name || !email || !projectType || !brief) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing. Please complete Name, Email, Project Type, and Project Brief."
    });
  }
  
  // Basic Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }
  
  const fullMessageBody = `======================================
⭐ ONE-TIME OFFER ($100 ORDER) ⭐
======================================
Project Tier: $100 Custom Website/Mini-Software
Requested Category: ${projectType}
Simulated Checkout Method: ${paymentMethod}
Transaction Status: SUCCESSFUL ($100 Flat Rate Locked)

--- CLIENT PROJECT BRIEF ---
${brief.trim()}
======================================`;

  const newMessage = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: name.trim(),
    email: email.trim(),
    company: "⭐ $100 OTO Order",
    subject: `★ OTO Order: ${projectType}`,
    message: fullMessageBody
  };
  
  const filePath = path.join(__dirname, 'messages.json');
  
  try {
    let existingMessages = [];
    
    // Try to read existing messages
    try {
      const data = await fs.readFile(filePath, 'utf8');
      existingMessages = JSON.parse(data);
      if (!Array.isArray(existingMessages)) {
        existingMessages = [];
      }
    } catch (readError) {
      existingMessages = [];
    }
    
    existingMessages.push(newMessage);
    
    // Save back to messages.json with pretty-printing
    await fs.writeFile(filePath, JSON.stringify(existingMessages, null, 2), 'utf8');
    
    res.status(200).json({
      success: true,
      message: `Order processed successfully! Thank you, ${name}. Your $100 flat-rate slot has been secured. Austyn will email you at ${email} to kick off development within 12 hours!`
    });
  } catch (error) {
    console.error("Failed to write OTO order:", error);
    res.status(500).json({
      success: false,
      message: "A server error occurred while locking your offer. Please try again."
    });
  }
});

// --- ADMIN DASHBOARD APIs & ROUTES ---

// Admin password config (defaults to 'admin' but can be overridden via environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

// Authentication middleware helper
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${ADMIN_PASSWORD}`) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized. Invalid admin security key." });
  }
};

// 5. Get All Messages (Authenticated)
app.get('/api/messages', requireAuth, async (req, res) => {
  const filePath = path.join(__dirname, 'messages.json');
  try {
    let messages = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      messages = JSON.parse(data);
    } catch (readError) {
      messages = [];
    }
    // Return messages in reverse chronological order
    res.json({ success: true, data: [...messages].reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load messages." });
  }
});

// 6. Delete Message by ID (Authenticated)
app.delete('/api/messages/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'messages.json');
  try {
    let messages = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      messages = JSON.parse(data);
    } catch (readError) {
      return res.status(404).json({ success: false, message: "No messages database found." });
    }
    
    const initialLength = messages.length;
    messages = messages.filter(msg => msg.id !== parseInt(id));
    
    if (messages.length === initialLength) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
    res.json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
});

// Serve OTO offer page
app.get('/offer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'offer.html'));
});

// Serve OTO route redirect
app.get('/oto', (req, res) => {
  res.redirect('/offer');
});

// Serve dashboard.html directly
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Wildcard fallback: Serve index.html for spa/routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
  console.log(`👾 Mode: Development`);
  console.log(`====================================================`);
});
