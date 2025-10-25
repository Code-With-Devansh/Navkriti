import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib

# Load dataset
df = pd.read_excel("training data.xlsx")

# Select features and target
target = "alert_level"
X = df.drop(columns=[target, "name", "patient_id", "ph_number", "address", "doctor_name", "problem", "comorbidity_list"])
y = df[target]

# Identify categorical and numeric columns
cat_cols = X.select_dtypes(include=["object", "bool"]).columns
num_cols = X.select_dtypes(include=["int64", "float64"]).columns

# Preprocessing pipeline
preprocessor = ColumnTransformer([
    ("num", SimpleImputer(strategy="mean"), num_cols),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ]), cat_cols)
])

# Train model
model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=200, random_state=42))
])

model.fit(X, y)

# Save pipeline
joblib.dump(model, "ai_risk_model_pipeline.pkl")
print("✅ Model trained and saved successfully!")
