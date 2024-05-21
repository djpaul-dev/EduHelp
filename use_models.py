from flair.data import Sentence
from flair.models import TextClassifier
from joblib import load
import sys

# flair_classifier = TextClassifier.load('./final-model.pt')
log_model = load('./log_model.joblib')
count_vec = load('./count_vec.joblib')


types = {0: 'enfj',
 1: 'enfp',
 2: 'entj',
 3: 'entp',
 4: 'esfj',
 5: 'esfp',
 6: 'estj',
 7: 'estp',
 8: 'infj',
 9: 'infp',
 10: 'intj',
 11: 'intp',
 12: 'isfj',
 13: 'isfp',
 14: 'istj',
 15: 'istp'}

def log_predict(text):
  text = count_vec.transform([text])
  category_int = log_model.predict(text).flatten()[0]
  confidence = log_model.predict_proba(text).flatten()[category_int]
  category = types[category_int].upper()
  return category, confidence

def predict_personality(text):
    # Flair Model
    # sentence = Sentence(text)
    # flair_classifier.predict(sentence)
    # flair_label, flair_conf = sentence.labels[0].value, sentence.labels[0].score

    # Logistic Regression
    log_label, log_confidence = log_predict(text)

    # print("Flair Model Prediction: {} with confidence: {} \nLogistic Regression Prediction: {} with confidence: {}".format(flair_label, flair_conf, log_label, log_confidence))

    # Return label with highest confidence
    # if flair_conf > log_confidence:
    #     return flair_label
    # else:
    return log_label
    
if __name__ == '__main__':
    assert len(sys.argv) == 2, "Usage: python use_models.py <text>"
    text = sys.argv[1] 
    print(predict_personality(text))
    sys.stdout.flush()