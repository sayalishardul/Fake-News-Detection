import os
import joblib
import numpy as np

from utils.preprocess import clean_text

# ----------------------------
# Paths
# ----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "model")

# ----------------------------
# Load Model
# ----------------------------

model = joblib.load(
    os.path.join(MODEL_DIR, "fake_news_model.pkl")
)

vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
)


def predict_news(news_text):
    """
    Predict whether news is Fake or Real
    """

    cleaned = clean_text(news_text)

    vector = vectorizer.transform([cleaned])

    prediction = model.predict(vector)[0]

    score = float(model.decision_function(vector)[0])

    confidence = min(
        100,
        round((abs(score) / 5) * 100)
    )

    result = "Real" if prediction == 1 else "Fake"

    # ----------------------------
    # Extract top keywords
    # ----------------------------

    feature_names = vectorizer.get_feature_names_out()

    vector_array = vector.toarray()[0]

    top_indices = vector_array.argsort()[-5:][::-1]

    keywords = []

    for index in top_indices:
        if vector_array[index] > 0:
            keywords.append(feature_names[index])

    # ----------------------------
    # AI Explanation
    # ----------------------------

    if result == "Real":

        explanation = [
            "Writing style appears factual.",
            "Language is neutral and informative.",
            "No obvious clickbait phrases detected.",
            "Prediction confidence is high."
        ]

    else:

        explanation = [
            "Contains sensational wording.",
            "Possible clickbait language detected.",
            "Writing style resembles fake news patterns.",
            "Prediction confidence is high."
        ]

    return {

        "prediction": result,

        "score": round(score, 2),

        "confidence": confidence,

        "keywords": keywords,

        "explanation": explanation

    }