from flask import Flask, request, jsonify
import joblib
import pandas as pd
import json

app = Flask(__name__)

# Load the model
model = joblib.load('ai_risk_model_pipeline.pkl')

# Define expected columns based on training data
EXPECTED_COLUMNS = [
    'age', 'total_doses_prescribed', 'doses_missed', 'doses_taken',
    'consecutive_missed', 'days_since_last_taken', 'adherence_rate',
    'previous_hospitalizations', 'comorbidity_count', 'sex',
    'medication_criticality', 'has_comorbidities', 'follow_up_missed',
    'side_effects_reported', 'medication_name', 'dept',
    'medication_color', 'alert_type'
]

def explain_and_predict_api(payload):
    try:
        # Convert payload to DataFrame
        Xrow = pd.DataFrame([payload])
        
        # Log the input for debugging
        print("Input payload:", payload)
        print("DataFrame columns:", list(Xrow.columns))
        
        # Add missing columns with default values
        for col in EXPECTED_COLUMNS:
            if col not in Xrow.columns:
                if col in ['medication_name', 'dept', 'medication_color', 'alert_type']:
                    Xrow[col] = 'Unknown'  # Default for categorical columns
                else:
                    Xrow[col] = 0  # Default for numerical columns
        
        # Ensure columns are in the correct order
        Xrow = Xrow[EXPECTED_COLUMNS]
        
        # Log the final DataFrame
        print("Final DataFrame:", Xrow)
        
        # Make prediction
        proba = model.predict_proba(Xrow)[0]
        prediction = model.predict(Xrow)[0]
        
        # Sample risk factors (customize based on your model)
        risk_factors = [
            {"factor": "Consecutive missed doses >= 3", "weight": 0.09},
            {"factor": "Existing comorbidities", "weight": 0.08},
            {"factor": "Low adherence rate (<80%)", "weight": 0.07}
        ]
        
        return {
            "alert_level": str(prediction),
            "confidence": round(proba.max(), 2),
            "risk_factors": risk_factors
        }
    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")

@app.route('/api/ai', methods=['POST'])
def api_ai():
    try:
        payload = request.get_json(force=True)  # force=True to handle minor content-type issues
        if not payload:
            return jsonify({"error": "No JSON data provided"}), 400
        res = explain_and_predict_api(payload)
        return jsonify(res)
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Invalid JSON: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)