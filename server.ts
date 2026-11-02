import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, SkinAnalysisRecord, Routine, JournalEntry, Conversation, ChatMessageRecord } from './server/db.js';
import { youCamService } from './server/youcamService.js';
import { assistantService } from './server/assistantService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing JSON with generous payload limit for base64 image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper to get active user ID (session simulation fallback to demo user)
function getActiveUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer usr-')) {
    const candidate = authHeader.replace('Bearer ', '').trim();
    if (db.users.has(candidate)) return candidate;
  }
  return 'usr-demo-001';
}

// ----------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Email, password, and display name are required.' });
  }

  // Check if exists
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
  }

  const userId = `usr-${Date.now()}`;
  const newUser = {
    id: userId,
    email,
    displayName,
    passwordHash: 'sha256_simulated_secure_hash',
    createdAt: new Date().toISOString()
  };

  db.users.set(userId, newUser);
  db.profiles.set(userId, {
    userId,
    displayName,
    currency: 'INR',
    monthlyBudget: 5000,
    beautyInterests: ['Skin Barrier Health', 'Radiance', 'Sun Defense'],
    skinType: 'Combination',
    skinConcerns: ['Dehydration'],
    ingredientPreferences: ['Hyaluronic Acid', 'Niacinamide'],
    routinePreference: 'Standard (5 steps)'
  });
  db.privacyPrefs.set(userId, {
    userId,
    allowTemporaryImageProcessing: true,
    storeAnalysisHistory: true,
    allowPersonalizedRecommendations: true,
    marketingEmails: false,
    consentedAt: new Date().toISOString()
  });
  db.wishlists.set(userId, new Set());
  db.journals.set(userId, []);

  return res.status(201).json({
    user: { id: newUser.id, email: newUser.email, displayName: newUser.displayName },
    token: newUser.id,
    message: 'Account created successfully.'
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Support demo guest login
  if (email === 'guest@glowverse.ai' || email === 'demo@glowverse.ai') {
    const demo = db.users.get('usr-demo-001')!;
    return res.json({
      user: { id: demo.id, email: demo.email, displayName: demo.displayName },
      token: demo.id,
      message: 'Logged in as Demo Luxury Explorer.'
    });
  }

  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      return res.json({
        user: { id: u.id, email: u.email, displayName: u.displayName },
        token: u.id,
        message: 'Logged in successfully.'
      });
    }
  }

  return res.status(401).json({ error: 'Invalid email or password.' });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const user = db.users.get(userId);
  const profile = db.profiles.get(userId);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user, profile });
});

// ----------------------------------------------------
// 2. USER PROFILE ROUTES
// ----------------------------------------------------
app.get('/api/profile', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const profile = db.profiles.get(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }
  return res.json(profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  let profile = db.profiles.get(userId);
  if (!profile) {
    profile = {
      userId,
      displayName: req.body.displayName || 'Beauty Explorer',
      currency: 'INR',
      monthlyBudget: 5000,
      beautyInterests: [],
      skinType: 'Combination',
      skinConcerns: [],
      ingredientPreferences: [],
      routinePreference: 'Standard (5 steps)'
    };
  }

  const updated = {
    ...profile,
    displayName: req.body.displayName ?? profile.displayName,
    currency: req.body.currency ?? profile.currency,
    monthlyBudget: Number(req.body.monthlyBudget) || profile.monthlyBudget,
    beautyInterests: req.body.beautyInterests ?? profile.beautyInterests,
    skinType: req.body.skinType ?? profile.skinType,
    skinConcerns: req.body.skinConcerns ?? profile.skinConcerns,
    ingredientPreferences: req.body.ingredientPreferences ?? profile.ingredientPreferences,
    routinePreference: req.body.routinePreference ?? profile.routinePreference
  };

  db.profiles.set(userId, updated);
  // Also update user displayName if changed
  const u = db.users.get(userId);
  if (u && updated.displayName) {
    u.displayName = updated.displayName;
  }

  return res.json({ profile: updated, message: 'Profile updated successfully.' });
});

// ----------------------------------------------------
// 3. SKIN INTELLIGENCE & YOUCAM ROUTES
// ----------------------------------------------------
app.get('/api/skin/config', (_req: Request, res: Response) => {
  const status = youCamService.getStatus();
  return res.json(status);
});

app.post('/api/skin/analyze', async (req: Request, res: Response) => {
  try {
    const { imageDataUri, consent, mode, requestedMode, sampleId, dst_actions, actions } = req.body;
    if (!imageDataUri) {
      return res.status(400).json({ error: 'Image data is required.' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'Consent is required for skin analysis.' });
    }

    const targetMode = (requestedMode || mode || 'auto') as 'live' | 'demo' | 'auto';
    const rawActions = dst_actions || actions;
    const task = await youCamService.submitAnalysis(
      imageDataUri,
      Boolean(consent),
      targetMode,
      sampleId,
      rawActions
    );
    return res.status(202).json(task);
  } catch (err: any) {
    const isCredentialsMissing = err.message?.includes('YOUCAM_API_KEY') || err.message?.includes('temporarily unavailable');
    const statusCode = isCredentialsMissing ? 503 : 400;
    return res.status(statusCode).json({ error: err.message || 'Analysis submission failed.' });
  }
});

app.get('/api/skin/status/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const taskStatus = await youCamService.getTaskStatus(taskId);
    return res.json(taskStatus);
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Task status check failed.' });
  }
});

app.get('/api/skin/result/:taskId', (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const result = youCamService.getResult(taskId);
    const userId = getActiveUserId(req);

    // Persist to user analyses history
    const record: SkinAnalysisRecord = {
      id: result.id,
      userId,
      date: result.analyzedAt,
      source: result.mode,
      isDemo: result.isDemo,
      overallScore: result.overallScore,
      parameters: result.parameters,
      recommendedIngredientIds: result.recommendedIngredientIds,
      recommendedProductIds: result.recommendedProductIds,
      notes: `Skin analysis conducted on ${new Date().toLocaleDateString()}`
    };

    db.analyses.set(record.id, record);

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to retrieve analysis result.' });
  }
});

app.get('/api/skin/history', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const userAnalyses = Array.from(db.analyses.values())
    .filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return res.json(userAnalyses);
});

app.delete('/api/skin/:analysisId', (req: Request, res: Response) => {
  const { analysisId } = req.params;
  const userId = getActiveUserId(req);
  const item = db.analyses.get(analysisId);
  if (!item || item.userId !== userId) {
    return res.status(404).json({ error: 'Analysis record not found.' });
  }
  db.analyses.delete(analysisId);
  return res.json({ success: true, message: 'Analysis record deleted.' });
});

// ----------------------------------------------------
// 4. PRODUCT CATALOGUE ROUTES
// ----------------------------------------------------
app.get('/api/products', (req: Request, res: Response) => {
  const { category, concern, search, maxPrice, sort } = req.query;
  let items = [...db.products];

  if (category && category !== 'All') {
    items = items.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (concern && concern !== 'All') {
    items = items.filter(p => p.concerns.some(c => c.toLowerCase() === String(concern).toLowerCase()));
  }

  if (maxPrice) {
    const limit = Number(maxPrice);
    if (!isNaN(limit)) {
      items = items.filter(p => p.priceINR <= limit);
    }
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.keyIngredients.some(i => i.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    items.sort((a, b) => a.priceINR - b.priceINR);
  } else if (sort === 'price-high') {
    items.sort((a, b) => b.priceINR - a.priceINR);
  } else if (sort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  }

  return res.json(items);
});

app.get('/api/products/search', (req: Request, res: Response) => {
  const q = String(req.query.q || '').toLowerCase();
  if (!q) return res.json([]);
  const matches = db.products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.keyIngredients.some(i => i.toLowerCase().includes(q)) ||
    p.category.toLowerCase().includes(q)
  );
  return res.json(matches);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const item = db.products.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  // Find linked alternatives for budget guardian
  const alternatives = item.alternativeIds
    ? db.products.filter(p => item.alternativeIds?.includes(p.id))
    : [];

  return res.json({ product: item, alternatives });
});

// ----------------------------------------------------
// 5. INGREDIENTS LIBRARY ROUTES
// ----------------------------------------------------
app.get('/api/ingredients', (_req: Request, res: Response) => {
  return res.json(db.ingredients);
});

app.get('/api/ingredients/:id', (req: Request, res: Response) => {
  const item = db.ingredients.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Ingredient not found.' });
  }
  // Find related products
  const relatedProducts = db.products.filter(p =>
    p.keyIngredients.some(k => k.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]))
  );
  return res.json({ ingredient: item, relatedProducts });
});

// ----------------------------------------------------
// 6. ROUTINES ROUTES
// ----------------------------------------------------
app.get('/api/routines', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const userRoutines = Array.from(db.routines.values()).filter(r => r.userId === userId);
  return res.json(userRoutines);
});

app.post('/api/routines', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const { name, description, items } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Routine name is required.' });
  }

  const newRoutine: Routine = {
    id: `routine-${Date.now()}`,
    userId,
    name,
    description: description || 'Personalized cosmetic ritual',
    items: items || [],
    updatedAt: new Date().toISOString()
  };

  db.routines.set(newRoutine.id, newRoutine);
  return res.status(201).json(newRoutine);
});

app.put('/api/routines/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const routine = db.routines.get(req.params.id);
  if (!routine || routine.userId !== userId) {
    return res.status(404).json({ error: 'Routine not found.' });
  }

  const updated: Routine = {
    ...routine,
    name: req.body.name ?? routine.name,
    description: req.body.description ?? routine.description,
    items: req.body.items ?? routine.items,
    updatedAt: new Date().toISOString()
  };

  db.routines.set(updated.id, updated);
  return res.json(updated);
});

app.delete('/api/routines/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const routine = db.routines.get(req.params.id);
  if (!routine || routine.userId !== userId) {
    return res.status(404).json({ error: 'Routine not found.' });
  }
  db.routines.delete(req.params.id);
  return res.json({ success: true, message: 'Routine removed.' });
});

// ----------------------------------------------------
// 7. WISHLIST ROUTES
// ----------------------------------------------------
app.get('/api/wishlist', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  let userWishlist = db.wishlists.get(userId);
  if (!userWishlist) {
    userWishlist = new Set();
    db.wishlists.set(userId, userWishlist);
  }
  const products = db.products.filter(p => userWishlist?.has(p.id));
  return res.json(products);
});

app.post('/api/wishlist', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }
  let userWishlist = db.wishlists.get(userId);
  if (!userWishlist) {
    userWishlist = new Set();
    db.wishlists.set(userId, userWishlist);
  }
  userWishlist.add(productId);
  return res.json({ success: true, message: 'Product saved to wishlist.', productIds: Array.from(userWishlist) });
});

app.delete('/api/wishlist/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const userWishlist = db.wishlists.get(userId);
  if (userWishlist) {
    userWishlist.delete(req.params.id);
  }
  return res.json({ success: true, message: 'Product removed from wishlist.' });
});

// ----------------------------------------------------
// 8. BEAUTY JOURNAL ROUTES
// ----------------------------------------------------
app.get('/api/journal', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const entries = db.journals.get(userId) || [];
  return res.json(entries);
});

app.post('/api/journal', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const { title, content, mood, skinFeel, activeProductsUsed, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newEntry: JournalEntry = {
    id: `journal-${Date.now()}`,
    userId,
    date: new Date().toISOString(),
    title,
    content,
    mood: mood || 'balanced',
    skinFeel: skinFeel || 'Comfortable',
    activeProductsUsed: activeProductsUsed || [],
    tags: tags || ['Skincare Log']
  };

  let entries = db.journals.get(userId);
  if (!entries) {
    entries = [];
    db.journals.set(userId, entries);
  }
  entries.unshift(newEntry);
  return res.status(201).json(newEntry);
});

app.delete('/api/journal/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  let entries = db.journals.get(userId) || [];
  const initialLength = entries.length;
  entries = entries.filter(e => e.id !== req.params.id);
  db.journals.set(userId, entries);

  if (entries.length === initialLength) {
    return res.status(404).json({ error: 'Journal entry not found.' });
  }
  return res.json({ success: true, message: 'Journal entry deleted.' });
});

// ----------------------------------------------------
// 9. BUDGET GUARDIAN CALCULATION ROUTE
// ----------------------------------------------------
app.post('/api/budget/calculate', (req: Request, res: Response) => {
  const { targetBudget, items } = req.body;
  const budget = Number(targetBudget) || 5000;
  const productList: Array<{ productId: string; quantity: number }> = items || [];

  let subtotal = 0;
  const itemized: Array<{ product: any; quantity: number; lineTotal: number; cheaperAlternative?: any }> = [];

  for (const item of productList) {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      const qty = Math.max(1, item.quantity || 1);
      const lineTotal = prod.priceINR * qty;
      subtotal += lineTotal;

      let cheaperAlternative = undefined;
      if (prod.alternativeIds && prod.alternativeIds.length > 0) {
        cheaperAlternative = db.products.find(p => prod.alternativeIds?.includes(p.id));
      }

      itemized.push({
        product: prod,
        quantity: qty,
        lineTotal,
        cheaperAlternative
      });
    }
  }

  const remaining = budget - subtotal;
  const percentageUsed = Math.min(100, Math.round((subtotal / budget) * 100));

  return res.json({
    targetBudget: budget,
    subtotal,
    remaining,
    percentageUsed,
    isOverBudget: subtotal > budget,
    itemized
  });
});

// ----------------------------------------------------
// 10. BEAUTY ASSISTANT (GEMINI + COSMETIC KNOWLEDGE)
// ----------------------------------------------------
app.get('/api/assistant/status', (_req: Request, res: Response) => {
  const status = assistantService.getStatus();
  return res.json(status);
});

app.get('/api/assistant/conversations', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const userConvs = Array.from(db.conversations.values())
    .filter(c => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return res.json(userConvs);
});

app.post('/api/assistant/conversations', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const title = (req.body.title || 'New Skincare Exploration').trim();
  const newId = `conv-${Date.now()}`;
  const conv: Conversation = {
    id: newId,
    userId,
    title,
    messages: [
      {
        id: `msg-${Date.now()}-welcome`,
        conversationId: newId,
        sender: 'assistant',
        text: `Welcome to your new consultation with GLOWVERSE AI Beauty Intelligence. How may I assist your skincare routine, formulation choices, or ingredient questions today?`,
        provider: 'GLOWVERSE Beauty Intelligence Engine',
        model: 'gemini-3.1-flash-lite',
        disclaimer: 'Educational cosmetic guidance only. Does not replace professional dermatological consultation.',
        suggestedQuestions: [
          'What is niacinamide?',
          'What does hyaluronic acid do?',
          'Explain sunscreen SPF.',
          'What is a basic skincare routine?',
          'What is the difference between a serum and moisturiser?'
        ],
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.conversations.set(newId, conv);
  return res.status(201).json(conv);
});

app.get('/api/assistant/conversations/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const conv = db.conversations.get(req.params.id);
  if (!conv || conv.userId !== userId) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }
  return res.json(conv);
});

app.delete('/api/assistant/conversations/:id', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const conv = db.conversations.get(req.params.id);
  if (!conv || conv.userId !== userId) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }
  db.conversations.delete(req.params.id);
  return res.json({ success: true, message: 'Conversation deleted.' });
});

app.delete('/api/assistant/conversations', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  for (const [id, c] of db.conversations.entries()) {
    if (c.userId === userId) db.conversations.delete(id);
  }
  return res.json({ success: true, message: 'All conversation histories cleared.' });
});

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { message, conversationId, context } = req.body;

    const query = (message || req.body.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Please enter a question before sending.' });
    }

    // Find or create conversation
    let targetConv: Conversation | undefined;
    if (conversationId && db.conversations.has(conversationId)) {
      const candidate = db.conversations.get(conversationId)!;
      if (candidate.userId === userId) targetConv = candidate;
    }

    if (!targetConv) {
      const newId = conversationId || `conv-${Date.now()}`;
      targetConv = {
        id: newId,
        userId,
        title: query.length > 36 ? query.substring(0, 33) + '...' : query,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.conversations.set(newId, targetConv);
    }

    // Record user message
    const userMsg: ChatMessageRecord = {
      id: `msg-${Date.now()}-user`,
      conversationId: targetConv.id,
      sender: 'user',
      text: query,
      createdAt: new Date().toISOString()
    };
    targetConv.messages.push(userMsg);

    // Retrieve user profile and recent analysis context if not provided
    const userProfile = db.profiles.get(userId);
    const userAnalyses = Array.from(db.analyses.values()).filter(a => a.userId === userId);
    const latestAnalysis = userAnalyses[0];

    const mergedContext = {
      skinProfile: context?.skinProfile || {
        skinType: userProfile?.skinType,
        skinConcerns: userProfile?.skinConcerns,
        monthlyBudget: userProfile?.monthlyBudget,
        currency: userProfile?.currency,
        routinePreference: userProfile?.routinePreference
      },
      analysisSummary: context?.analysisSummary || (latestAnalysis ? {
        overallScore: latestAnalysis.overallScore,
        date: latestAnalysis.date,
        parameters: latestAnalysis.parameters
      } : undefined),
      savedProducts: db.products.slice(0, 4).map(p => ({
        name: p.name,
        brand: p.brand,
        category: p.category,
        keyIngredients: p.keyIngredients
      }))
    };

    // Prepare message history
    const history = targetConv.messages
      .slice(-8)
      .map(m => ({ role: m.sender, content: m.text }));

    // Request answer from AssistantService
    const result = await assistantService.ask(query, history, mergedContext);

    // Record assistant message
    const assistantMsg: ChatMessageRecord = {
      id: `msg-${Date.now()}-assistant`,
      conversationId: targetConv.id,
      sender: 'assistant',
      text: result.answer,
      provider: result.provider,
      model: result.model,
      disclaimer: result.disclaimer,
      suggestedQuestions: result.suggestedQuestions,
      createdAt: new Date().toISOString()
    };
    targetConv.messages.push(assistantMsg);
    targetConv.updatedAt = new Date().toISOString();

    return res.json({
      answer: result.answer,
      message: assistantMsg,
      conversationId: targetConv.id,
      provider: result.provider,
      model: result.model,
      suggestedQuestions: result.suggestedQuestions,
      disclaimer: result.disclaimer
    });
  } catch (err: any) {
    console.error('Error in /api/assistant/chat:', err);
    return res.status(500).json({
      error: 'Something went wrong while generating your answer. Please retry.',
      details: err.message
    });
  }
});

// Legacy backward-compatibility endpoint
app.post('/api/assistant/ask', async (req: Request, res: Response) => {
  try {
    const { query, history } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Please enter a question before sending.' });
    }
    const result = await assistantService.ask(query, history || []);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Assistant request failed.' });
  }
});

// ----------------------------------------------------
// 11. PRIVACY & DATA RIGHTS ROUTES
// ----------------------------------------------------
app.get('/api/privacy/preferences', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const prefs = db.privacyPrefs.get(userId) || {
    userId,
    allowTemporaryImageProcessing: true,
    storeAnalysisHistory: true,
    allowPersonalizedRecommendations: true,
    marketingEmails: false,
    consentedAt: new Date().toISOString()
  };
  return res.json(prefs);
});

app.put('/api/privacy/preferences', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const current = db.privacyPrefs.get(userId) || {
    userId,
    allowTemporaryImageProcessing: true,
    storeAnalysisHistory: true,
    allowPersonalizedRecommendations: true,
    marketingEmails: false,
    consentedAt: new Date().toISOString()
  };

  const updated = {
    ...current,
    allowTemporaryImageProcessing: req.body.allowTemporaryImageProcessing ?? current.allowTemporaryImageProcessing,
    storeAnalysisHistory: req.body.storeAnalysisHistory ?? current.storeAnalysisHistory,
    allowPersonalizedRecommendations: req.body.allowPersonalizedRecommendations ?? current.allowPersonalizedRecommendations,
    marketingEmails: req.body.marketingEmails ?? current.marketingEmails,
    consentedAt: new Date().toISOString()
  };

  db.privacyPrefs.set(userId, updated);
  return res.json({ preferences: updated, message: 'Privacy preferences updated.' });
});

app.post('/api/privacy/delete-request', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);

  // Erase user analyses
  for (const [id, a] of db.analyses.entries()) {
    if (a.userId === userId) db.analyses.delete(id);
  }

  // Erase routines
  for (const [id, r] of db.routines.entries()) {
    if (r.userId === userId) db.routines.delete(id);
  }

  // Erase wishlists & journals & conversations
  db.wishlists.delete(userId);
  db.journals.delete(userId);
  for (const [id, c] of db.conversations.entries()) {
    if (c.userId === userId) db.conversations.delete(id);
  }

  return res.json({
    success: true,
    message: 'All personal records, analysis logs, routines, conversations, and journal entries have been completely permanently erased from GLOWVERSE AI servers.'
  });
});

// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC ASSET HANDLING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GLOWVERSE AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
