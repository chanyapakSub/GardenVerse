from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image, ImageOps
import numpy as np
import io
import os
import uvicorn

app = FastAPI(title="GardenVerse AI Disease Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "mobilenet_best_model.h5"
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

# มาตรฐาน PlantVillage 38 Classes สำหรับ MobileNet
CLASS_NAMES = [
    'Apple Scab (โรคราดำแอปเปิ้ล)', 'Apple Black Rot (โรคผลเน่าดำแอปเปิ้ล)', 
    'Apple Cedar Rust (โรคราสนิมแอปเปิ้ล)', 'Apple Healthy (แอปเปิ้ลสุขภาพดี)',
    'Blueberry Healthy (บลูเบอร์รี่สุขภาพดี)', 
    'Cherry Powdery Mildew (โรคราแป้งเชอร์รี่)', 'Cherry Healthy (เชอร์รี่สุขภาพดี)', 
    'Corn Gray Leaf Spot (โรคใบจุดสีเทาข้าวโพด)', 'Corn Common Rust (โรคราสนิมข้าวโพด)', 
    'Corn Northern Leaf Blight (โรคใบไหม้แผลใหญ่ข้าวโพด)', 'Corn Healthy (ข้าวโพดสุขภาพดี)', 
    'Grape Black Rot (โรคผลเน่าดำองุ่น)', 'Grape Black Measles (โรคเอสคาองุ่น)', 
    'Grape Leaf Blight (โรคใบไหม้องุ่น)', 'Grape Healthy (องุ่นสุขภาพดี)', 
    'Orange Citrus Greening (โรคกรีนนิ่งส้ม)', 
    'Peach Bacterial Spot (โรคจุดแบคทีเรียพีช)', 'Peach Healthy (พีชสุขภาพดี)', 
    'Pepper Bell Bacterial Spot (โรคจุดแบคทีเรียพริกหยวก)', 'Pepper Bell Healthy (พริกหยวกสุขภาพดี)', 
    'Potato Early Blight (โรคใบไหม้เช้ามันฝรั่ง)', 'Potato Late Blight (โรคใบไหม้สายมันฝรั่ง)', 'Potato Healthy (มันฝรั่งสุขภาพดี)', 
    'Raspberry Healthy (ราสเบอร์รี่สุขภาพดี)', 
    'Soybean Healthy (ถั่วเหลืองสุขภาพดี)', 
    'Squash Powdery Mildew (โรคราแป้งฟักทอง)', 
    'Strawberry Leaf Scorch (โรคใบไหม้สตรอว์เบอร์รี่)', 'Strawberry Healthy (สตรอว์เบอร์รี่สุขภาพดี)', 
    'Tomato Bacterial Spot (โรคจุดแบคทีเรียมะเขือเทศ)', 'Tomato Early Blight (โรคใบไหม้เช้ามะเขือเทศ)', 
    'Tomato Late Blight (โรคใบไหม้สายมะเขือเทศ)', 'Tomato Leaf Mold (โรคราใบช้ำมะเขือเทศ)', 
    'Tomato Septoria Leaf Spot (โรคใบจุดเซพทอเรียมะเขือเทศ)', 'Tomato Spider Mites (ไรแดงมะเขือเทศ)', 
    'Tomato Target Spot (โรคใบจุดเป้าหมายมะเขือเทศ)', 'Tomato Yellow Leaf Curl Virus (ไวรัสใบหงิกเหลืองมะเขือเทศ)', 
    'Tomato Mosaic Virus (ไวรัสใบด่างมะเขือเทศ)', 'Tomato Healthy (มะเขือเทศสุขภาพดี)'
]

ADVICE_MAP = {
    "Apple Scab (โรคราดำแอปเปิ้ล)": "เก็บใบและผลที่ร่วงใต้ต้นไปทำลาย ลดความชื้นสะสม และพ่นสารป้องกันเชื้อราในช่วงอากาศชื้น",
    
    "Apple Black Rot (โรคผลเน่าดำแอปเปิ้ล)": "ตัดแต่งกิ่งและผลที่ติดโรคออกทันที พร้อมรักษาความสะอาดบริเวณสวนเพื่อลดการสะสมของเชื้อรา",
    
    "Apple Cedar Rust (โรคราสนิมแอปเปิ้ล)": "หลีกเลี่ยงการปลูกใกล้ต้นสนซีดาร์ และพ่นสารป้องกันเชื้อราเมื่อเริ่มพบอาการ",
    
    "Apple Healthy (แอปเปิ้ลสุขภาพดี)": "ดูแลให้น้ำและปุ๋ยอย่างเหมาะสม หมั่นตรวจสอบโรคและแมลงเพื่อรักษาความแข็งแรงของต้น",
    
    "Blueberry Healthy (บลูเบอร์รี่สุขภาพดี)": "ควรรักษาความชื้นในดินให้เหมาะสม ตัดแต่งกิ่งสม่ำเสมอ และให้แสงแดดเพียงพอ",
    
    "Cherry Powdery Mildew (โรคราแป้งเชอร์รี่)": "ตัดแต่งกิ่งให้โปร่ง ลดความชื้นสะสม และใช้สารป้องกันกำจัดเชื้อราเมื่อพบการระบาด",
    
    "Cherry Healthy (เชอร์รี่สุขภาพดี)": "ให้น้ำอย่างสม่ำเสมอ พร้อมเสริมปุ๋ยอินทรีย์เพื่อส่งเสริมการเจริญเติบโต",
    
    "Corn Gray Leaf Spot (โรคใบจุดสีเทาข้าวโพด)": "ปลูกพืชหมุนเวียนและเก็บเศษซากพืชหลังเก็บเกี่ยวเพื่อลดการสะสมของเชื้อ",
    
    "Corn Common Rust (โรคราสนิมข้าวโพด)": "เลือกใช้พันธุ์ต้านทานโรค และหลีกเลี่ยงการปลูกในพื้นที่ชื้นจัด",
    
    "Corn Northern Leaf Blight (โรคใบไหม้แผลใหญ่ข้าวโพด)": "กำจัดเศษพืชที่เป็นโรคและพ่นสารป้องกันเชื้อราเมื่อเริ่มพบอาการ",
    
    "Corn Healthy (ข้าวโพดสุขภาพดี)": "ควรให้น้ำอย่างเพียงพอและใส่ปุ๋ยตามระยะการเจริญเติบโต",
    
    "Grape Black Rot (โรคผลเน่าดำองุ่น)": "ตัดแต่งกิ่งเพื่อให้อากาศถ่ายเทสะดวก และเก็บผลที่ติดโรคไปทำลาย",
    
    "Grape Black Measles (โรคเอสคาองุ่น)": "หลีกเลี่ยงการตัดแต่งกิ่งในช่วงฝนตก และฆ่าเชื้ออุปกรณ์ตัดแต่งทุกครั้ง",
    
    "Grape Leaf Blight (โรคใบไหม้องุ่น)": "ลดความชื้นในทรงพุ่มและใช้สารป้องกันเชื้อราเมื่อพบใบเริ่มไหม้",
    
    "Grape Healthy (องุ่นสุขภาพดี)": "ควรตัดแต่งทรงพุ่มให้โปร่ง และตรวจสอบแมลงศัตรูพืชเป็นประจำ",
    
    "Orange Citrus Greening (โรคกรีนนิ่งส้ม)": "ควบคุมเพลี้ยไก่แจ้ซึ่งเป็นพาหะของโรค และถอนต้นที่ติดโรครุนแรงออกจากสวน",
    
    "Peach Bacterial Spot (โรคจุดแบคทีเรียพีช)": "หลีกเลี่ยงการให้น้ำโดนใบและใช้สารกลุ่มทองแดงช่วยควบคุมโรค",
    
    "Peach Healthy (พีชสุขภาพดี)": "ตัดแต่งกิ่งเพื่อให้แสงส่องทั่วถึง และใส่ปุ๋ยอย่างเหมาะสม",
    
    "Pepper Bell Bacterial Spot (โรคจุดแบคทีเรียพริกหยวก)": "หลีกเลี่ยงการรดน้ำแบบพ่นฝอยและกำจัดใบที่เป็นโรคทันที",
    
    "Pepper Bell Healthy (พริกหยวกสุขภาพดี)": "ควรปลูกในดินระบายน้ำดีและหมั่นตรวจสอบแมลงศัตรูพืช",
    
    "Potato Early Blight (โรคใบไหม้เช้ามันฝรั่ง)": "ตัดใบที่เริ่มเป็นโรคออกและใช้สารป้องกันเชื้อรากลุ่มแมนโคเซบ",
    
    "Potato Late Blight (โรคใบไหม้สายมันฝรั่ง)": "หลีกเลี่ยงความชื้นสะสมสูง และใช้ชีวภัณฑ์หรือสารป้องกันเชื้อราอย่างสม่ำเสมอ",
    
    "Potato Healthy (มันฝรั่งสุขภาพดี)": "ควรพูนดินรอบโคนต้นและให้น้ำอย่างเหมาะสมเพื่อป้องกันหัวเน่า",
    
    "Raspberry Healthy (ราสเบอร์รี่สุขภาพดี)": "ตัดแต่งกิ่งแก่หลังเก็บเกี่ยวและรักษาความชื้นในดินให้คงที่",
    
    "Soybean Healthy (ถั่วเหลืองสุขภาพดี)": "ควรปลูกในดินที่ระบายน้ำดีและเสริมธาตุอาหารตามความต้องการของพืช",
    
    "Squash Powdery Mildew (โรคราแป้งฟักทอง)": "ลดความหนาแน่นของใบและใช้สารชีวภัณฑ์หรือกำมะถันป้องกันเชื้อรา",
    
    "Strawberry Leaf Scorch (โรคใบไหม้สตรอว์เบอร์รี่)": "ตัดใบที่เป็นโรคออก ลดความชื้นสะสม และหลีกเลี่ยงน้ำขัง",
    
    "Strawberry Healthy (สตรอว์เบอร์รี่สุขภาพดี)": "ให้น้ำช่วงเช้าและใช้ฟางคลุมดินเพื่อลดการกระเด็นของเชื้อโรค",
    
    "Tomato Bacterial Spot (โรคจุดแบคทีเรียมะเขือเทศ)": "หลีกเลี่ยงการให้น้ำโดนใบ และพ่นสารกลุ่มทองแดงเพื่อควบคุมโรค",
    
    "Tomato Early Blight (โรคใบไหม้เช้ามะเขือเทศ)": "ตัดแต่งใบล่างที่เริ่มเป็นโรคและพ่นสารป้องกันเชื้อราอย่างต่อเนื่อง",
    
    "Tomato Late Blight (โรคใบไหม้สายมะเขือเทศ)": "หลีกเลี่ยงการรดน้ำตอนเย็นและกำจัดต้นที่ติดโรครุนแรงทันที",
    
    "Tomato Leaf Mold (โรคราใบช้ำมะเขือเทศ)": "เพิ่มการระบายอากาศในแปลงปลูกและลดความชื้นภายในโรงเรือน",
    
    "Tomato Septoria Leaf Spot (โรคใบจุดเซพทอเรียมะเขือเทศ)": "ตัดใบที่เป็นโรคออกและหลีกเลี่ยงการกระเด็นของน้ำจากดินขึ้นสู่ใบ",
    
    "Tomato Spider Mites (ไรแดงมะเขือเทศ)": "ฉีดพ่นน้ำใต้ใบเพื่อลดไรแดง และใช้สารชีวภัณฑ์ควบคุมเมื่อระบาดหนัก",
    
    "Tomato Target Spot (โรคใบจุดเป้าหมายมะเขือเทศ)": "ลดความชื้นในแปลงปลูกและพ่นสารป้องกันเชื้อราตามคำแนะนำ",
    
    "Tomato Yellow Leaf Curl Virus (ไวรัสใบหงิกเหลืองมะเขือเทศ)": "กำจัดแมลงหวี่ขาวที่เป็นพาหะ และถอนต้นที่ติดโรคทิ้งเพื่อป้องกันการแพร่ระบาด",
    
    "Tomato Mosaic Virus (ไวรัสใบด่างมะเขือเทศ)": "ฆ่าเชื้ออุปกรณ์การเกษตรและหลีกเลี่ยงการสัมผัสต้นปกติหลังจับต้นที่ติดโรค",
    
    "Tomato Healthy (มะเขือเทศสุขภาพดี)": "ควรให้ปุ๋ยสมดุล ตัดแต่งกิ่ง และตรวจสอบโรคแมลงอย่างสม่ำเสมอ"
}

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # ปรับปรุงการ Resize: ใช้ ImageOps.pad เพื่อให้เห็น "ทั้งรูป" โดยไม่โดน Crop ส่วนขอบออก
        # โดยจะเติมขอบสีดำ (Padding) ให้กลายเป็นสี่เหลี่ยมจัตุรัส 224x224 แทน
        image = ImageOps.pad(image, (224, 224), color=(0, 0, 0))
        
        # Preprocessing สำหรับ MobileNet (มาตรฐาน -1 to 1)
        img_array = np.array(image).astype('float32')
        img_array = (img_array / 127.5) - 1.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])

        disease_name = CLASS_NAMES[predicted_idx] if predicted_idx < len(CLASS_NAMES) else f"Unknown (Class {predicted_idx})"
        advice = ADVICE_MAP.get(disease_name, "แนะนำให้ปรึกษาผู้เชี่ยวชาญด้านเกษตรเพื่อการวินิจฉัยที่แม่นยำยิ่งขึ้น")

        return {
            "status": "success",
            "prediction": disease_name,
            "class_id": int(predicted_idx),
            "confidence": round(confidence * 100, 2),
            "advice": advice
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
