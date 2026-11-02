import { GoogleGenAI } from '@google/genai';

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantContext {
  skinProfile?: {
    skinType?: string;
    skinConcerns?: string[];
    monthlyBudget?: number;
    currency?: string;
    routinePreference?: string;
  };
  analysisSummary?: {
    overallScore?: number;
    isDemo?: boolean;
    date?: string;
    parameters?: Record<string, { score: number; label: string; explanation?: string }>;
  };
  savedProducts?: Array<{ name: string; brand: string; category: string; keyIngredients: string[] }>;
}

export interface AssistantResponse {
  answer: string;
  provider: 'gemini' | 'educational-knowledge-base';
  model?: string;
  suggestedQuestions?: string[];
  disclaimer: string;
  error?: string;
}

export class AssistantService {
  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  }

  public getStatus() {
    const key = this.getApiKey();
    return {
      configured: Boolean(key && key.trim().length > 0),
      provider: 'Google Gemini AI',
      model: process.env.AI_MODEL || 'gemini-3.1-flash-lite',
      hasFallback: true
    };
  }

  public async ask(
    query: string,
    history: AssistantMessage[] = [],
    context?: AssistantContext
  ): Promise<AssistantResponse> {
    const trimmed = query?.trim();
    if (!trimmed) {
      throw new Error('Please enter a question before sending.');
    }

    const apiKey = this.getApiKey();

    // Prepare system instructions with safety guardrails and user context
    let contextPrompt = '';
    if (context?.skinProfile) {
      const p = context.skinProfile;
      contextPrompt += `\n[User Skin Profile: Type=${p.skinType || 'Combination'}, Concerns=${p.skinConcerns?.join(', ') || 'General Hydration'}, Budget=${p.currency || 'INR'} ${p.monthlyBudget || 5000}, Routine=${p.routinePreference || 'Standard (5 steps)'}]`;
    }
    if (context?.analysisSummary?.parameters) {
      const a = context.analysisSummary;
      const paramsList = Object.entries(a.parameters || {})
        .map(([k, v]) => `${k}: ${v.score}% (${v.label})`)
        .join(', ');
      contextPrompt += `\n[User Real Saved Skin Analysis: Overall Score=${a.overallScore ?? 'N/A'}/100, Metrics: ${paramsList}]`;
    }
    if (context?.savedProducts && context.savedProducts.length > 0) {
      contextPrompt += `\n[User Saved Catalogue Products: ${context.savedProducts.map(p => `${p.name} by ${p.brand} (${p.category})`).join('; ')}]`;
    }

    const systemInstruction = `You are the GLOWVERSE BEAUTY ASSISTANT, an intelligent, friendly, educational beauty and skincare advisor for the luxury platform GLOWVERSE AI.

Your role:
- Explain skincare concepts, cosmetic ingredients, product labels, and cosmetic formulation chemistry in plain, structured English.
- Help users organize morning and evening routines (thinnest to thickest viscosity principle).
- Explain available skin analysis metrics objectively and transparently without pseudo-scientific jargon.
- Explain budget calculations and how to get maximum formulation value with GLOWVERSE Budget Guardian.
- Help users navigate GLOWVERSE AI features (Skin Intelligence, Routine Studio, Product Discovery, Ingredient Library, Virtual Studio, Budget Guardian, Beauty Journal).

Safety and Non-Medical Rules:
1. NEVER diagnose medical conditions (e.g. cystic acne, eczema, rosacea, melanoma, fungal infections) or prescribe treatments.
2. NEVER guarantee specific timeline outcomes or claim cosmetics cure diseases.
3. Emphasize that cosmetic skin analysis provides non-clinical optical guidance for routine selection, not a clinical dermatological diagnosis.
4. Recommend patch-testing before introducing high-potency actives (Retinoids, pure Vitamin C, chemical exfoliants).
5. For persistent or reactive skin conditions, kindly advise consulting a board-certified dermatologist.
6. Communication style: warm, concise, beautifully formatted with clean Markdown headings and bullet points. Keep answers typically under 220 words.
${contextPrompt}`;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        // Use fast, responsive model: gemini-3.1-flash-lite
        const modelName = process.env.AI_MODEL || 'gemini-3.1-flash-lite';

        // Set up timeout promise to guarantee the client never hangs indefinitely
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout after 10 seconds')), 10000)
        );

        // Map history to contents
        const contents: any[] = [];
        // Add recent history (up to last 6 messages)
        const recentHistory = history.slice(-6);
        for (const msg of recentHistory) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: trimmed }]
        });

        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction
          }
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        const text = response.text || '';

        if (text && text.trim().length > 0) {
          return {
            answer: text.trim(),
            provider: 'gemini',
            model: modelName,
            suggestedQuestions: this.generateFollowUps(trimmed),
            disclaimer: 'Educational cosmetic guidance powered by Gemini AI. Does not replace professional dermatological consultation.'
          };
        }
      } catch (err: any) {
        console.warn('Gemini API call failed or timed out, activating educational knowledge base:', err.message);
        // Fall through to comprehensive knowledge engine
      }
    }

    // Comprehensive Skincare Science Knowledge Engine Fallback
    return this.fallbackKnowledgeBase(trimmed, context);
  }

  private generateFollowUps(query: string): string[] {
    const q = query.toLowerCase();
    if (q.includes('niacinamide')) {
      return [
        'Can I use Niacinamide and Vitamin C in the same morning routine?',
        'What percentage of Niacinamide is optimal for sensitive skin?',
        'How does Niacinamide help with enlarged pores?'
      ];
    }
    if (q.includes('hyaluronic')) {
      return [
        'How does Hyaluronic Acid differ from Glycerin?',
        'Why should Hyaluronic Acid be applied to damp skin?',
        'Can Hyaluronic Acid cause breakouts or irritation?'
      ];
    }
    if (q.includes('sunscreen') || q.includes('spf')) {
      return [
        'What is the difference between SPF 30 and SPF 50?',
        'What does PA++++ mean on sunscreen labels?',
        'Do I need sunscreen if I stay indoors near windows?'
      ];
    }
    if (q.includes('retinol') || q.includes('retinoid')) {
      return [
        'How do I introduce Retinol without irritation (sandwich method)?',
        'Can I use Retinol and Exfoliating Acids on alternate nights?',
        'What is Bakuchiol and how does it compare to Retinol?'
      ];
    }
    if (q.includes('vitamin c')) {
      return [
        'What is the difference between pure L-Ascorbic Acid and Vitamin C derivatives?',
        'How do I prevent my Vitamin C serum from oxidizing?',
        'Why should Vitamin C always be paired with morning sunscreen?'
      ];
    }
    if (q.includes('ceramide')) {
      return [
        'What is the 3:1:1 physiological ceramide ratio?',
        'How do ceramides repair a damaged skin barrier?',
        'Can oily skin benefit from ceramide moisturizers?'
      ];
    }
    if (q.includes('salicylic') || q.includes('bha')) {
      return [
        'How often should I use 2% Salicylic Acid BHA?',
        'Can Salicylic Acid be paired with Niacinamide?',
        'How does BHA unclog blackheads inside pores?'
      ];
    }
    if (q.includes('analysis') || q.includes('skin score') || q.includes('result')) {
      return [
        'What does optical surface hydration measure?',
        'Why do camera reflections change radiance scores?',
        'How do I improve skin barrier comfort over 14 days?'
      ];
    }
    if (q.includes('routine') || q.includes('order') || q.includes('step')) {
      return [
        'What is the difference between a toner, essence, and serum?',
        'Should facial oil be applied before or after moisturizer?',
        'What is a simple 3-step minimalist routine?'
      ];
    }
    if (q.includes('budget') || q.includes('price') || q.includes('cost')) {
      return [
        'Which skincare steps are worth splurging on?',
        'How does Budget Guardian find affordable alternatives?',
        'How do I build a complete skincare routine under ₹3,000?'
      ];
    }
    return [
      'What is niacinamide and how does it help skin?',
      'What is a good basic morning and evening skincare routine?',
      'What does sunscreen SPF mean and how much should I apply?',
      'What is the difference between a serum and a moisturiser?'
    ];
  }

  private fallbackKnowledgeBase(query: string, context?: AssistantContext): AssistantResponse {
    const q = query.toLowerCase().trim();

    let answer = '';
    const followUps = this.generateFollowUps(query);

    // 1. Niacinamide
    if (q.includes('niacinamide')) {
      answer = `### What is Niacinamide?

**Niacinamide** (Vitamin B3) is a water-soluble vitamin essential for cellular energy and healthy epidermal function.

- **What it does**: Supports the skin's moisture barrier by boosting natural ceramide synthesis, visibly regulates excess surface sebum, calms transient redness, and refines the look of enlarged pores.
- **How to use**: Formulated in lightweight water-based serums at **2% to 5%** concentration. Apply after cleansing and essences, before heavier creams.
- **Precautions**: High concentrations (10%+) can cause temporary flushing or tingling in sensitive skin profiles. Always patch test first.
- **Compatibility**: Harmonizes beautifully with Hyaluronic Acid, Ceramides, Squalane, and Peptides.`;
    }
    // 2. Hyaluronic Acid
    else if (q.includes('hyaluronic')) {
      answer = `### What is Hyaluronic Acid?

**Hyaluronic Acid (HA)** is a powerful biological humectant naturally found in connective tissue that can bind up to 1,000 times its molecular weight in water.

- **What it does**: Draws moisture into the outer layer of the skin (the stratum corneum), delivering an instant plumping effect and softening surface dehydration lines.
- **How to use**: Formulated in concentrations from **0.5% to 2%**. Often formulated with multi-molecular weights for layered superficial and deeper epidermal hydration.
- **Golden Rule**: **Always apply to slightly damp skin** and immediately follow with an emollient moisturizer. In arid climates, applying HA to bone-dry skin can draw water outward.
- **Compatibility**: Universally tolerated and safe to combine with all cosmetic actives.`;
    }
    // 3. Sunscreen & SPF
    else if (q.includes('sunscreen') || q.includes('spf')) {
      answer = `### Understanding Sunscreen and SPF

**Sunscreen** is the foundational anti-aging and skin health product in cosmetic science.

- **What SPF Means**: **Sun Protection Factor** measures protection against UVB rays (which cause sunburn). SPF 30 blocks ~97% of UVB rays; SPF 50 blocks ~98%.
- **Broad-Spectrum & PA Rating**: Look for broad-spectrum protection. The **PA++++** rating indicates the highest protection against UVA rays (which penetrate deeper and drive photo-aging).
- **How Much to Apply**: The clinically recommended dosage is **2 milligrams per square centimeter**—roughly **two full finger lengths** for the face and neck.
- **When to Apply**: Every morning as the final non-negotiable skincare step, 15 minutes before sun exposure, regardless of weather or season.`;
    }
    // 4. Salicylic Acid (BHA)
    else if (q.includes('salicylic') || q.includes('bha')) {
      answer = `### What is Salicylic Acid (BHA)?

**Salicylic Acid** is an oil-soluble beta-hydroxy acid (BHA) with unique lipid-penetrating properties.

- **What it does**: Unlike water-soluble AHAs, BHA penetrates deep inside follicular openings (pores) to dissolve accumulated sebum, dead cells, and debris that form blackheads.
- **Optimal Formulation**: Most effective in liquid exfoliants at **0.5% to 2%** concentration at an acidic pH between 3.0 and 4.0.
- **Usage**: Introduce gradually—start with **2 nights per week**. Do not over-exfoliate.
- **Precautions**: Do not use if allergic to aspirin. Always wear daily SPF 50 because exfoliating acids reveal fresh, delicate cells.`;
    }
    // 5. Retinoids & Retinol
    else if (q.includes('retinol') || q.includes('retinoid') || q.includes('vitamin a') || q.includes('bakuchiol')) {
      answer = `### What are Retinoids?

**Retinoids** (Vitamin A derivatives and plant analogues like Bakuchiol) are the gold standard in cosmetic dermatology for cellular renewal.

- **What they do**: Signal surface cells to turnover more efficiently, smoothing rough texture, reducing the appearance of fine lines, and evening tone.
- **The "Low and Slow" Protocol**: Start with a gentle 0.1% to 0.3% concentration just 1–2 evenings per week. Gradually increase frequency over 6–8 weeks.
- **The Sandwich Technique**: For sensitive skin, apply moisturizer first, wait 2 minutes, apply your retinol, then seal with a second layer of moisturizer to minimize dryness.
- **Crucial Rule**: Use at night only and never skip morning sunscreen. Avoid during pregnancy.`;
    }
    // 6. Ceramides
    else if (q.includes('ceramide')) {
      answer = `### What are Ceramides?

**Ceramides** are essential lipid (fat) molecules that make up over **50% of your skin's natural barrier matrix**.

- **The Brick & Mortar Analogy**: Think of skin cells as bricks; ceramides, cholesterol, and fatty acids are the mortar holding them together to keep water in and irritants out.
- **What they do**: Restore compromised skin barriers, prevent trans-epidermal water loss (TEWL), and soothe tight, dry, or peeling skin.
- **Optimal Ratio**: Efficacy is highest in a physiological **3:1:1 ratio** of ceramides, cholesterol, and free fatty acids.
- **Compatibility**: Universally biocompatible with all skin types (including acne-prone skin) and all active ingredients.`;
    }
    // 7. Vitamin C
    else if (q.includes('vitamin c') || q.includes('ascorbic')) {
      answer = `### What is Vitamin C?

**Vitamin C** (L-Ascorbic Acid and its stable derivatives) is a potent antioxidant that protects against daily environmental stress.

- **What it does**: Neutralizes free radicals from UV light and urban pollution, inhibits melanin overproduction to brighten dullness, and supports collagen synthesis.
- **Formulation Science**: Pure L-Ascorbic Acid requires an acidic pH (<3.5) and is stabilized by Vitamin E (Tocopherol) and Ferulic Acid.
- **Usage**: Apply 4–5 drops in the **morning** onto clean, dry skin, followed by moisturizer and broad-spectrum SPF.
- **Storage**: Keep in dark amber or UV-opaque bottles away from direct heat. Discard if the serum turns dark amber or brown (oxidized).`;
    }
    // 8. Serum vs Moisturiser
    else if (q.includes('difference between a serum and moisturiser') || (q.includes('serum') && q.includes('moisturiser'))) {
      answer = `### The Difference Between Serums and Moisturisers

While both nourish your skin, they serve completely different biological purposes:

1. **Serum (The Treatment Actives)**:
   - **Texture**: Lightweight, fluid, water-based or micro-oil delivery systems.
   - **Purpose**: Formulated with high concentrations of smaller molecules (e.g. Hyaluronic Acid, Vitamin C, Niacinamide) designed to penetrate deep into epidermal layers.
   - **Role**: Targets specific concerns (dehydration, pigmentation, fine lines).

2. **Moisturiser (The Lipid Shield)**:
   - **Texture**: Richer creams, lotions, or balms containing emollients and occlusives (e.g. Ceramides, Squalane, Shea).
   - **Purpose**: Creates a physical barrier on the surface of the skin.
   - **Role**: Seals in water, prevents evaporation, and defends against environmental dryness.

**Application Rule**: Always apply your serum first, wait 60 seconds, and seal it with your moisturiser!`;
    }
    // 9. Basic Skincare Routine
    else if (q.includes('basic') && q.includes('routine')) {
      answer = `### A Good Basic Skincare Routine (The 3-Step Foundation)

Skincare does not need to be complicated. Consistency with three core steps delivers 80% of healthy skin results:

**Morning Ritual (Defense)**:
1. **Cleanse**: A gentle, non-stripping cleanser (or simply a lukewarm water rinse for dry skin).
2. **Moisturize**: A lightweight hydrating lotion or gel with Ceramides or Glycerin.
3. **Protect**: Broad-spectrum **SPF 50+ Sunscreen** (the most critical step for skin longevity).

**Evening Ritual (Recovery)**:
1. **Cleanse**: Wash away daily sunscreen, makeup, and urban grime.
2. **Treat (Optional)**: 1 targeted active serum (such as Hyaluronic Acid for hydration or Retinol for texture).
3. **Seal**: A nourishing night moisturizer to support overnight lipid barrier repair.`;
    }
    // 10. Explain my saved skin-analysis results
    else if (q.includes('analysis') || q.includes('my skin') || q.includes('explain my')) {
      if (context?.analysisSummary?.parameters) {
        const p = context.analysisSummary.parameters;
        answer = `### Your Saved Skin Intelligence Assessment Summary

Based on your saved non-clinical assessment (Overall Score: **${context.analysisSummary.overallScore ?? 84}/100**):

- **Texture (${p.texture?.score ?? 82}%)**: Measures optical micro-roughness via surface light scatter across cheek zones. Indicates healthy epidermal shedding.
- **Radiance (${p.radiance?.score ?? 86}%)**: High specular glow reflectance, reflecting balanced lipid levels and stratum corneum vitality.
- **Hydration (${p.hydration?.score ?? 79}%)**: Superficial epidermal water index. Suggests layering a multi-molecular humectant like Hyaluronic Acid.
- **Redness (${p.redness?.score ?? 91}%)**: Calm chroma balance with low localized erythema.

*Scientific Reminder: This is an optical cosmetic assessment for routine guidance. It does not evaluate deep subcutaneous layers or diagnose clinical dermatological conditions.*`;
      } else {
        answer = `### Explaining Skin Analysis Results

To interpret your personalized skin analysis, you can complete a non-clinical scan in our **Skin Intelligence** tab!

Our optical assessment evaluates 8 cosmetic parameters:
1. **Texture**: Micro-roughness and light reflection uniformity.
2. **Radiance**: Epidermal luminosity and specular reflectance.
3. **Hydration**: Superficial moisture and epidermal plumpness.
4. **Fine Lines**: Contrast gradients around periorbital contours.
5. **Pores**: Visual density of follicular apertures in the T-zone.
6. **Redness**: Vascular flushing and chromatic tone balance.
7. **Firmness**: Definition along cheekbone and jawline contours.
8. **Dark Circles**: Infraorbital chrominance contrast.

*All metrics are cosmetic and non-diagnostic.*`;
      }
    }
    // 11. Product Ingredients & Reading Labels
    else if (q.includes('ingredient') || q.includes('label') || q.includes('product ingredients')) {
      answer = `### How to Read a Cosmetic Ingredient (INCI) List

- **The 1% Rule**: Ingredients present in concentrations greater than 1% must be listed in descending order of weight. The first 5–6 ingredients typically comprise 80–90% of the product.
- **Ingredients Under 1%**: Actives, preservatives, and colorants under 1% can be listed in any order at the end of the list.
- **Active vs Inactive**: Actives (like 2% Salicylic Acid) are supported by solvents, emulsifiers, and stabilizers that make the formulation stable and elegant.
- **Fragrance & Essential Oils**: Listed near the bottom (e.g. Linalool, Limonene, Parfum). If your skin is reactive or sensitized, fragrance-free formulations are best.`;
    }
    // 12. Budget Guardian & Shopping
    else if (q.includes('budget') || q.includes('glowverse')) {
      answer = `### Navigating GLOWVERSE AI & Budget Guardian

**GLOWVERSE AI** connects 5 core beauty experiences:
1. **Skin Intelligence**: 8-parameter optical scan with Explain My Skin scientific breakdowns.
2. **Routine Studio**: Step-by-step morning and evening checklist with formulation linking.
3. **Discover Products**: 16 curated clean beauty formulations with complete INCI disclosures.
4. **Virtual Beauty Studio**: Interactive Before/After split comparison for lipstick and cheek finishes.
5. **Beauty Budget Guardian**: Set a monthly budget (e.g. ₹5,000), calculate exact subtotals, and discover affordable alternatives with identical active ingredients!`;
    }
    // Default helpful general response
    else {
      answer = `### GLOWVERSE AI Beauty Intelligence

Here is what you need to know regarding **"${query}"**:

In cosmetic formulation science, skincare works best when keeping products simple, gentle, and aligned with your skin's natural barrier biology.

- **Key Principles**: Cleanse gently at pH 5.5, hydrate with humectants (Glycerin, Hyaluronic Acid), seal with barrier lipids (Ceramides, Squalane), and protect daily with broad-spectrum SPF 50+.
- **Explore More**: You can ask me to explain any ingredient (Niacinamide, Vitamin C, Retinol, Salicylic Acid), help organize your morning/evening ritual, or explain your saved skin analysis results!

*Remember: This information is educational and non-medical.*`;
    }

    return {
      answer,
      provider: 'educational-knowledge-base',
      suggestedQuestions: followUps,
      disclaimer: 'Curated Skincare Science Knowledge Engine. Educational guidance only; does not replace professional dermatological consultation.'
    };
  }
}

export const assistantService = new AssistantService();
