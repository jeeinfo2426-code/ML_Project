from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

print("Loading model...")
with open('best_model.pkl', 'rb') as f:
    model_pipeline = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Convert dictionary to DataFrame (expects a single record)
        df = pd.DataFrame([data])

        # Calculate engineered features
        df['bmi'] = df['weight'] / ((df['height'] / 100) ** 2)
        df['pulse_pressure'] = df['ap_hi'] - df['ap_lo']

        # Make sure columns match what the model expects
        expected_cols = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo',
                         'cholesterol', 'gluc', 'smoke', 'alco', 'active',
                         'bmi', 'pulse_pressure']
        df = df[expected_cols]

        # Predict
        prediction = model_pipeline.predict(df)[0]

        # Get risk probability as a percentage
        probability = None
        if hasattr(model_pipeline, 'predict_proba'):
            proba = model_pipeline.predict_proba(df)[0]
            probability = round(float(proba[1]) * 100, 1)

        # Return risk boolean and probability percentage
        return jsonify({"risk": bool(prediction == 1), "probability": probability})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
