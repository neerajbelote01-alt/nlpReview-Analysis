import dashboardData from '../data/dashboard.json';
import productsData from '../data/products.json';
import complaintsData from '../data/complaints.json';
import modelEvalData from '../data/model_evaluation.json';
import {
  AnalysisResult,
  AspectResult,
  Product,
  ProductDetail,
  Review,
  DashboardStats,
  ComplaintItem,
  ModelEvaluation,
  User,
  AuthResponse
} from '../types';

// Aspect lexicon dictionary
const ASPECT_KEYWORDS: Record<string, string[]> = {
  'Camera': [
    'camera', 'cameras', 'photo', 'photos', 'picture', 'pictures', 'shot', 'shots',
    'video', 'videos', 'recording', 'sensor', 'sensors', 'lens', 'lenses',
    'selfie', 'selfies', 'portrait', 'night mode', 'zoom', 'telephoto', 'ultrawide',
    'bokeh', 'megapixels', '200mp', '50mp', 'optics'
  ],
  'Battery': [
    'battery', 'batteries', 'backup', 'screen on time', 'sot', 'drain', 'draining',
    'endurance', 'mah', '6500mah', '5000mah', 'battery life', 'standby', 'power consumption'
  ],
  'Display': [
    'display', 'screen', 'amoled', 'oled', '120hz', '144hz', 'refresh rate',
    'brightness', 'nits', 'colors', 'resolution', '4k', '2k', 'hdr', 'touch response',
    'viewing angle', 'bezel', 'bezels', 'notch', 'dynamic island'
  ],
  'Performance': [
    'performance', 'processor', 'chip', 'chipset', 'cpu', 'gpu', 'speed', 'fast',
    'lag', 'lagging', 'lags', 'stutter', 'snappy', 'multitasking', 'gaming', 'games',
    'fps', 'frame rate', 'throttle', 'throttling', 'heating', 'thermal', 'overheating',
    'bionic', 'tensor', 'snapdragon', 'ram'
  ],
  'Price': [
    'price', 'pricing', 'cost', 'costs', 'expensive', 'overpriced', 'cheap',
    'budget', 'value', 'value for money', 'worth', 'dollars', 'msrp', 'affordable'
  ],
  'Build quality': [
    'build quality', 'build', 'construction', 'materials', 'titanium', 'aluminum',
    'glass back', 'frame', 'chassis', 'flimsy', 'creaky', 'premium feel', 'solid in hand'
  ],
  'Audio and speakers': [
    'audio', 'sound', 'speaker', 'speakers', 'volume', 'loudness', 'bass',
    'acoustics', 'treble', 'stereo', 'dolby', 'atmos', 'microphone', 'mic'
  ],
  'Software and user interface': [
    'software', 'ui', 'user interface', 'os', 'operating system', 'android',
    'ios', 'bloatware', 'ads', 'launcher', 'updates', 'patches', 'animations',
    'gesture', 'bugs', 'glitch'
  ],
  'Connectivity': [
    'connectivity', '5g', '4g', 'wi-fi', 'wifi', 'bluetooth', 'network',
    'signal', 'reception', 'cellular', 'gps', 'nfc', 'dual sim'
  ],
  'Charging': [
    'charging', 'charger', 'fast charging', 'watts', '65w', '120w', 'wireless charging',
    'magsafe', 'brick', 'adapter'
  ],
  'Ergonomics and weight': [
    'ergonomic', 'ergonomics', 'weight', 'heavy', 'lightweight', 'compact', 'one hand',
    'form factor', 'hand feel', 'grip', 'slippery', 'pocketable'
  ]
};

const POSITIVE_WORDS = [
  'amazing', 'great', 'excellent', 'fantastic', 'best', 'fast', 'crisp', 'loved',
  'superb', 'good', 'incredible', 'smooth', 'awesome', 'stellar', 'solid', 'impressive',
  'reliable', 'brilliant', 'wonderful', 'flawless', 'premium', 'sharp', 'vibrant', 'love',
  'long-lasting', 'beast', 'quick', 'top-notch', 'stunner', 'satisfied', 'perfect'
];

const NEGATIVE_WORDS = [
  'bad', 'worst', 'terrible', 'awful', 'horrible', 'poor', 'slow', 'lag', 'drain',
  'overheating', 'blurry', 'hot', 'cheap', 'broken', 'disappointing', 'issue', 'issues',
  'glitch', 'noisy', 'overpriced', 'fragile', 'useless', 'garbage', 'mediocre', 'hate',
  'regret', 'unusable', 'disaster', 'drain', 'fails', 'failed', 'subpar', 'buggy'
];

export function extractClientAspects(text: string): AspectResult[] {
  const lower = text.toLowerCase();
  const sentences = lower.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const detected: AspectResult[] = [];

  for (const [aspectName, keywords] of Object.entries(ASPECT_KEYWORDS)) {
    // Find matching sentence or mention
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // Find matching sentence for evidence
        const evidenceSentence = sentences.find(s => s.includes(kw)) || text;

        // Score sentiment in the evidence sentence
        let posScore = 0;
        let negScore = 0;

        for (const pw of POSITIVE_WORDS) {
          if (evidenceSentence.includes(pw)) posScore++;
        }
        for (const nw of NEGATIVE_WORDS) {
          if (evidenceSentence.includes(nw)) negScore++;
        }

        let sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' = 'Neutral';
        let confidence = 0.85;

        if (posScore > 0 && negScore > 0) {
          sentiment = 'Mixed';
          confidence = 0.78;
        } else if (posScore > negScore) {
          sentiment = 'Positive';
          confidence = Math.min(0.96, 0.82 + posScore * 0.05);
        } else if (negScore > posScore) {
          sentiment = 'Negative';
          confidence = Math.min(0.96, 0.82 + negScore * 0.05);
        }

        detected.push({
          aspect_name: aspectName,
          sentiment,
          confidence: Number(confidence.toFixed(2)),
          evidence_text: evidenceSentence
        });
        break; // Only detect each aspect category once
      }
    }
  }

  // If no specific aspect is mentioned, add General Product aspect
  if (detected.length === 0) {
    let posScore = 0;
    let negScore = 0;
    for (const pw of POSITIVE_WORDS) if (lower.includes(pw)) posScore++;
    for (const nw of NEGATIVE_WORDS) if (lower.includes(nw)) negScore++;

    let sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' = 'Neutral';
    if (posScore > 0 && negScore > 0) sentiment = 'Mixed';
    else if (posScore > negScore) sentiment = 'Positive';
    else if (negScore > posScore) sentiment = 'Negative';

    detected.push({
      aspect_name: 'General Product',
      sentiment,
      confidence: 0.88,
      evidence_text: text
    });
  }

  return detected;
}

export function analyzeReviewClient(
  reviewText: string,
  productId?: string
): AnalysisResult {
  const aspects = extractClientAspects(reviewText);
  const posCount = aspects.filter(a => a.sentiment === 'Positive').length;
  const negCount = aspects.filter(a => a.sentiment === 'Negative').length;
  const mixCount = aspects.filter(a => a.sentiment === 'Mixed').length;

  let overall: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' = 'Neutral';
  if (mixCount > 0 || (posCount > 0 && negCount > 0)) {
    overall = 'Mixed';
  } else if (posCount > negCount) {
    overall = 'Positive';
  } else if (negCount > posCount) {
    overall = 'Negative';
  }

  // Find product name if productId provided
  let productName = 'General Smartphone';
  if (productId) {
    const p = (productsData as unknown as Product[]).find(item => item.id === productId);
    if (p) productName = p.name;
  }

  const result: AnalysisResult = {
    id: Date.now(),
    product_id: productId,
    product_name: productName,
    review_text: reviewText,
    overall_sentiment: overall,
    confidence: 0.91,
    model_name: 'ReviewIQ-ABSA-Engine (Client Fallback)',
    analysis_timestamp: new Date().toISOString(),
    aspect_results: aspects
  };

  // Save to local storage history
  try {
    const existing = JSON.parse(localStorage.getItem('reviewiq_local_history') || '[]');
    existing.unshift(result);
    localStorage.setItem('reviewiq_local_history', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    // ignore
  }

  return result;
}

export const mockFallback = {
  getDashboard: (): DashboardStats => {
    return dashboardData as unknown as DashboardStats;
  },

  getProducts: (params?: { search?: string; category?: string; brand?: string }): Product[] => {
    let prods = productsData as unknown as Product[];
    if (params?.search) {
      const q = params.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (params?.brand && params.brand !== 'All') {
      prods = prods.filter(p => p.brand === params.brand);
    }
    if (params?.category && params.category !== 'All') {
      prods = prods.filter(p => p.category === params.category);
    }
    return prods;
  },

  getProductById: (id: string): ProductDetail => {
    const p = (productsData as unknown as Product[]).find(item => item.id === id);
    if (!p) {
      throw new Error('Product not found');
    }
    return {
      ...p,
      aspect_breakdown: {
        'Camera': { 'Positive': 34, 'Negative': 6, 'Neutral': 4, 'Mixed': 2 },
        'Battery': { 'Positive': 28, 'Negative': 12, 'Neutral': 3, 'Mixed': 4 },
        'Performance': { 'Positive': 42, 'Negative': 3, 'Neutral': 2, 'Mixed': 1 },
        'Display': { 'Positive': 39, 'Negative': 4, 'Neutral': 3, 'Mixed': 2 },
        'Price': { 'Positive': 18, 'Negative': 19, 'Neutral': 5, 'Mixed': 6 },
        'Build quality': { 'Positive': 36, 'Negative': 5, 'Neutral': 2, 'Mixed': 1 },
        'Audio and speakers': { 'Positive': 25, 'Negative': 7, 'Neutral': 5, 'Mixed': 2 }
      }
    };
  },

  getProductReviews: (productId: string): Review[] => {
    return [
      {
        id: `rev_${productId}_1`,
        product_id: productId,
        review_text: 'The 120Hz display is absolutely breathtaking and the camera takes stunning portrait shots in low light. Battery lasts all day easily.',
        rating: 5,
        source_type: 'Verified Purchase',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        overall_sentiment: 'Positive',
        aspect_count: 3
      },
      {
        id: `rev_${productId}_2`,
        product_id: productId,
        review_text: 'Performance is super fast with zero lag in heavy gaming, but the price tag is quite steep and it gets slightly warm after 2 hours.',
        rating: 4,
        source_type: 'Amazon',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        overall_sentiment: 'Mixed',
        aspect_count: 3
      },
      {
        id: `rev_${productId}_3`,
        product_id: productId,
        review_text: 'Battery drain is noticeable when recording 4K video. Speaker sound quality could also be improved at high volume.',
        rating: 2,
        source_type: 'Flipkart',
        created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
        overall_sentiment: 'Negative',
        aspect_count: 2
      }
    ];
  },

  getComplaints: (productId?: string): ComplaintItem[] => {
    let items = complaintsData as unknown as ComplaintItem[];
    if (productId) {
      items = items.filter(c => c.affected_products.some(p => p.toLowerCase().includes(productId.toLowerCase())));
    }
    return items;
  },

  getModelEvaluation: (): ModelEvaluation => {
    return modelEvalData as unknown as ModelEvaluation;
  },

  getHistory: (): AnalysisResult[] => {
    try {
      const stored = localStorage.getItem('reviewiq_local_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 1,
        product_name: 'Apple iPhone 16 Pro Max',
        review_text: 'The titanium build is ultra premium and camera zoom is unbeatable. Battery lasts 2 days straight.',
        overall_sentiment: 'Positive',
        confidence: 0.94,
        model_name: 'ReviewIQ ABSA Engine',
        analysis_timestamp: new Date().toISOString(),
        aspect_results: [
          { aspect_name: 'Build quality', sentiment: 'Positive', confidence: 0.95 },
          { aspect_name: 'Camera', sentiment: 'Positive', confidence: 0.96 },
          { aspect_name: 'Battery', sentiment: 'Positive', confidence: 0.92 }
        ]
      },
      {
        id: 2,
        product_name: 'Samsung Galaxy S24 Ultra',
        review_text: 'The display is super bright outdoors and performance is snappy, but charging speed is slow compared to competitors.',
        overall_sentiment: 'Mixed',
        confidence: 0.88,
        model_name: 'ReviewIQ ABSA Engine',
        analysis_timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        aspect_results: [
          { aspect_name: 'Display', sentiment: 'Positive', confidence: 0.96 },
          { aspect_name: 'Performance', sentiment: 'Positive', confidence: 0.91 },
          { aspect_name: 'Charging', sentiment: 'Negative', confidence: 0.86 }
        ]
      }
    ];
  },

  loginDemo: (email: string): AuthResponse => {
    const user: User = {
      id: 1,
      full_name: email.split('@')[0] || 'Demo User',
      email: email,
      created_at: new Date().toISOString()
    };
    return {
      access_token: 'mock_demo_jwt_token_reviewiq_2026',
      token_type: 'bearer',
      user
    };
  }
};
