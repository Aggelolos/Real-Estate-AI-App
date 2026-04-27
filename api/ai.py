import pandas as pd
from sklearn.linear_model import LinearRegression
import os
from django.conf import settings

def predict_price(house_age, rooms):
    # 1. Find and load the fake data file
    csv_path = os.path.join(settings.BASE_DIR, 'House_price.csv')
    df = pd.read_csv(csv_path).dropna()

    # 2. Select the inputs (features) and output (target)
    # matching the columns from my Kaggle dataset
    X = df[['House Age', 'Number of Rooms']]
    y = df['Price']

    # 3. Train the AI Model
    model = LinearRegression()
    model.fit(X, y)

    # 4. Make a prediction for a specific property
    # It takes the age and rooms from the database to guess the price
    prediction = model.predict([[house_age, rooms]])
    
    return round(prediction[0], 2)