from fastapi import APIRouter
from app.nlp.evaluator import model_evaluator
from app.nlp.aspect_extractor import ASPECT_DICTIONARY

router = APIRouter(prefix="/model", tags=["Model"])

@router.get("/info")
def get_model_info():
    return {
        "model_name": "ReviewIQ ABSA Hybrid Pipeline (TF-IDF + Logistic Regression + Linguistic Rules)",
        "framework": "scikit-learn 1.9+, Python 3.11",
        "supported_aspects": list(ASPECT_DICTIONARY.keys()),
        "sentiment_classes": ["Positive", "Negative", "Neutral", "Mixed"],
        "feature_extraction": "TF-IDF (unigram + bigram, sublinear TF scaling)",
        "classifier": "LogisticRegression(C=2.0, class_weight='balanced', max_iter=500)",
        "aspect_extraction": "Dictionary and syntactic phrase matcher with contrast-boundary clause segmentation",
        "negation_handling": "Windowed negation tracking preserving sentiment polarity flips (e.g. 'not bad' -> Positive, 'not good' -> Negative)",
        "confidence_scoring": "Calibrated posterior probability distributions from logistic sigmoid",
        "hardware_requirements": "Runs CPU-only on any standard laptop or PC without GPU"
    }

@router.get("/evaluation")
def get_model_evaluation():
    return model_evaluator.get_evaluation()
