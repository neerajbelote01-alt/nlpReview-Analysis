export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AspectResult {
  id?: number;
  aspect_name: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  confidence?: number;
  evidence_text?: string;
}

export interface AnalysisResult {
  id?: number;
  review_id?: string;
  product_id?: string;
  product_name?: string;
  review_text: string;
  overall_sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' | 'Uncertain';
  confidence?: number;
  model_name: string;
  analysis_timestamp?: string;
  aspect_results: AspectResult[];
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price?: string;
  image_url?: string;
  amazon_url?: string;
  flipkart_url?: string;
  official_url?: string;
  description?: string;
  created_at: string;
  review_count: number;
  average_rating?: number;
  sentiment_summary: {
    Positive?: number;
    Negative?: number;
    Neutral?: number;
    Mixed?: number;
  };
  top_aspects: string[];
}

export interface ProductDetail extends Product {
  aspect_breakdown: Record<string, Record<string, number>>;
}

export interface Review {
  id: string;
  product_id: string;
  product_name?: string;
  review_text: string;
  rating?: number;
  source_type: string;
  created_at: string;
  overall_sentiment?: string;
  aspect_count: number;
}

export interface AspectSummaryItem {
  aspect_name: string;
  total_mentions: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  mixed_count: number;
  net_sentiment_score: number;
}

export interface ProductSentimentItem {
  product_id: string;
  product_name: string;
  total_reviews: number;
  average_rating?: number;
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

export interface DashboardStats {
  total_products: number;
  total_reviews: number;
  total_analyses: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  most_frequent_aspects: AspectSummaryItem[];
  top_positive_aspects: AspectSummaryItem[];
  top_negative_aspects: AspectSummaryItem[];
  product_sentiment_comparison: ProductSentimentItem[];
  recent_activity: {
    id: number;
    product_name: string;
    review_text: string;
    overall_sentiment: string;
    confidence?: number;
    timestamp?: string;
  }[];
}

export interface ComplaintItem {
  aspect_name: string;
  problem_count: number;
  percentage: number;
  affected_products: string[];
  representative_excerpts: {
    text: string;
    evidence: string;
    product: string;
  }[];
}

export interface ModelComparisonItem {
  model_name: string;
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
  f1_weighted: number;
}

export interface ModelEvaluation {
  dataset_info: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    test_size: number;
    random_state: number;
  };
  primary_model: {
    name: string;
    accuracy: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    f1_weighted: number;
    labels: string[];
    confusion_matrix: {
      true_label: string;
      Positive?: number;
      Negative?: number;
      Neutral?: number;
      Mixed?: number;
    }[];
    classification_report: {
      class: string;
      precision: number;
      recall: number;
      f1_score: number;
      support: number;
    }[];
  };
  model_comparison: ModelComparisonItem[];
  methodology: string;
}
