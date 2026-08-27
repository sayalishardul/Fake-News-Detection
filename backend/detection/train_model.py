import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score

from utils.preprocess import clean_text


# -----------------------
# Paths
# -----------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

dataset_dir = os.path.join(BASE_DIR, "dataset")
model_dir = os.path.join(BASE_DIR, "model")

os.makedirs(model_dir, exist_ok=True)

# -----------------------
# Load Dataset
# -----------------------

fake = pd.read_csv(os.path.join(dataset_dir, "Fake.csv"))
true = pd.read_csv(os.path.join(dataset_dir, "True.csv"))

fake["label"] = 0
true["label"] = 1

news = pd.concat([fake, true], ignore_index=True)

news = news.sample(frac=1, random_state=42).reset_index(drop=True)

# Combine title and text

news["content"] = news["title"] + " " + news["text"]

# Clean text

print("Cleaning text...")

news["content"] = news["content"].apply(clean_text)

print("Cleaning completed.")

# Features and labels

X = news["content"]

y = news["label"]

# Train/Test Split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# TF-IDF

vectorizer = TfidfVectorizer(max_df=0.7)

X_train = vectorizer.fit_transform(X_train)

X_test = vectorizer.transform(X_test)

# Train Model

model = PassiveAggressiveClassifier(max_iter=100)

model.fit(X_train, y_train)

# Prediction

prediction = model.predict(X_test)

accuracy = accuracy_score(y_test, prediction)

print(f"\nModel Accuracy: {accuracy*100:.2f}%")

# Save Model

joblib.dump(model, os.path.join(model_dir, "fake_news_model.pkl"))

joblib.dump(vectorizer, os.path.join(model_dir, "tfidf_vectorizer.pkl"))

print("\nModel saved successfully.")