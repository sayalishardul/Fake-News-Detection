# 📰 Fake News Detection System

A full-stack **Fake News Detection System** that uses Machine Learning to classify news articles as **Real** or **Fake**.

The application provides a modern React dashboard, Django REST API backend, Machine Learning prediction model, JWT-based authentication, prediction history, analytics, and separate dashboards for normal users and administrators.

---

## 🚀 Features

### 👤 User Features

- User registration
- User login
- JWT authentication
- User profile
- Change password
- Fake news prediction
- Real/Fake prediction result
- Prediction confidence score
- Prediction history
- Search prediction history
- Filter predictions by Real/Fake
- Delete individual predictions
- Clear prediction history
- Export history as PDF
- Export history as CSV
- Prediction statistics
- Prediction distribution chart
- Prediction activity trend chart
- Dark mode support
- Responsive dashboard

---

### 🛡️ Admin Features

- Admin authentication
- Admin dashboard
- Total users statistics
- Total predictions statistics
- Real/Fake prediction statistics
- Prediction analytics
- User management
- Search users
- Delete users
- Recent prediction monitoring
- Separate admin interface
- Admin-only protected routes

---

## 🧠 Machine Learning

The project uses a Machine Learning text classification model to determine whether a news article is Real or Fake.

### Machine Learning Pipeline

```text
News Article
     │
     ▼
Text Cleaning
     │
     ▼
TF-IDF Vectorization
     │
     ▼
Machine Learning Model
     │
     ▼
Prediction
     │
     ├── Real
     │
     └── Fake