# Models Directory

This directory is for storing trained machine learning models (optional).

For now, we're using rule-based intent classification and entity recognition.
If you have Kaggle-trained models, place them here:

- `intent_classifier.pkl` - Intent classification model
- `entity_recognizer.pkl` - Entity recognition model
- `vectorizer.pkl` - Text vectorizer

These models will be automatically loaded if they exist.
Otherwise, the system will use the rule-based fallback.

