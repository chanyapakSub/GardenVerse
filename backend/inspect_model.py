import tensorflow as tf
import os

model_path = "plant_disease_model.h5"
if os.path.exists(model_path):
    try:
        model = tf.keras.models.load_model(model_path)
        print(f"Model loaded successfully.")
        print(f"Input shape: {model.input_shape}")
        print(f"Output shape: {model.output_shape}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print(f"Model file not found at {model_path}")
