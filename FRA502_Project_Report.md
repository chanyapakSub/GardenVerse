# รายงานโครงงาน FRA502 Web Programming
## ชื่อโครงการ: GardenVerse

**จัดทำโดย กลุ่ม GardenGardon**

| ลำดับ | ชื่อ – นามสกุล | เลขประจำตัว |
|:-:|:--|:--|
| 1 | ณัชณศา เลิศมหากูล | 65340500021 |
| 2 | นันท์นภัส นันทพรนิรชา | 65340500034 |
| 3 | อนวัช อนุสุเรนทร์ | 65340500056 |
| 4 | ชัญญาภัค ทรัพย์สวัสดิ์กุล | 65340500067 |

**FRA502 Web Programming**
สถาบันวิทยาการหุ่นยนต์ภาคสนาม
มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
ภาคการเรียนปลายปีการศึกษา 2569

---

## 1. ข้อมูลทั่วไป (บทนำ)

### ชื่อโปรเจค (Project Title)
**GardenVerse** – ระบบจำลองโรงเรือนเสมือนจริงพร้อมการตรวจวัดสภาพแวดล้อมและตรวจสุขภาพพืชด้วย AI

### บทคัดย่อ (Abstract)

ในปัจจุบัน การปลูกพืชทั้งเพื่อการบริโภคและการตกแต่งได้รับความนิยมเพิ่มขึ้นอย่างต่อเนื่อง อย่างไรก็ตาม ผู้ปลูกพืชจำนวนมากยังประสบปัญหาในการทำความเข้าใจสภาวะแวดล้อมที่เหมาะสมต่อการเจริญเติบโตของพืช เนื่องจากขาดข้อมูลเกี่ยวกับปัจจัยสำคัญ เช่น ความชื้นในดิน ปริมาณแสงแดด อุณหภูมิ และสภาพสุขภาพของใบพืช ส่งผลให้เกิดการดูแลที่ไม่เหมาะสมและการใช้ทรัพยากรอย่างไม่มีประสิทธิภาพ

โครงงาน **GardenVerse** มีวัตถุประสงค์เพื่อพัฒนา Web Application เชิงโต้ตอบสำหรับแสดงผลและวิเคราะห์ข้อมูลสภาพแวดล้อมของพืช โดยมุ่งเน้นการออกแบบระบบที่สามารถรับข้อมูลจากเซ็นเซอร์ภายนอก (ESP32) ผ่าน Firebase Realtime Database จัดเก็บลง PostgreSQL ผ่าน Bridge Service ประมวลผล และนำเสนอผ่านอินเทอร์เฟซบนเว็บในรูปแบบ Dashboard และ Data Visualization ที่เข้าใจง่าย พร้อมทั้งใช้เทคโนโลยีการแสดงผลแบบสามมิติ (3D Visualization) ด้วย Three.js เพื่อจำลองโรงเรือนและสถานะของพืชในรูปแบบเสมือนจริงมากยิ่งขึ้น

นอกจากนี้ ระบบยังได้บูรณาการ AI Engine ที่พัฒนาด้วย Python (FastAPI) และโมเดล Deep Learning (MobileNet) เพื่อช่วยวินิจฉัยโรคของพืชจากภาพถ่ายใบ พร้อมให้คำแนะนำในการดูแลรักษา ระบบประกอบด้วยส่วน Frontend ที่พัฒนาด้วย Next.js 16 (App Router) สำหรับการแสดงผลและโต้ตอบกับผู้ใช้ และ Backend สำหรับการจัดการข้อมูลและเชื่อมต่อกับแหล่งข้อมูล โดยสามารถแสดงข้อมูลย้อนหลัง วิเคราะห์แนวโน้ม และแจ้งเตือนเมื่อค่าต่าง ๆ อยู่ในช่วงที่ไม่เหมาะสม

ผลลัพธ์ของโครงงานนี้คือการพัฒนา Web Application ที่ช่วยให้ผู้ใช้งานสามารถเข้าใจและติดตามสภาพแวดล้อมของพืชได้อย่างมีประสิทธิภาพ และเป็นตัวอย่างของการประยุกต์ใช้เทคโนโลยี Web Development ร่วมกับ 3D Visualization, IoT และ AI ได้อย่างเหมาะสม

### วัตถุประสงค์และขอบเขต (Objectives & Scope)

1. เพื่อพัฒนา Web Application ที่สามารถแสดงผลข้อมูลสภาพแวดล้อมของพืชในรูปแบบ Dashboard ที่เข้าใจง่ายและเป็นมิตรกับผู้ใช้
2. เพื่อออกแบบและพัฒนา Frontend Interface ที่มีความสามารถในการโต้ตอบกับผู้ใช้ (Interactive UI) เช่น การแสดงผลข้อมูลแบบเรียลไทม์ กราฟ และสถานะของพืช พร้อมทั้งการแสดงผลโรงเรือนแบบสามมิติ (3D)
3. เพื่อพัฒนา Backend System สำหรับจัดการข้อมูล (Data Management) รวมถึงการรับ ส่ง และประมวลผลข้อมูลจากแหล่งข้อมูลภายนอก เช่น Firebase Realtime Database (ข้อมูลเซ็นเซอร์จาก ESP32) และ Supabase (PostgreSQL)
4. เพื่อบูรณาการ AI Engine ในการวิเคราะห์ภาพใบพืชเพื่อวินิจฉัยโรคได้อย่างแม่นยำ พร้อมระบบให้คำแนะนำการรักษา
5. เพื่อออกแบบระบบแจ้งเตือน (Notification System) และการแสดงผลคำแนะนำในรูปแบบ Web-based Interaction
6. เพื่อศึกษาการพัฒนา Web Application แบบ Full-stack ที่เชื่อมต่อระหว่าง Frontend, Backend, AI Engine และ Data Source

### ขอบเขตของระบบ

- รองรับการแสดงผลข้อมูลเซ็นเซอร์: อุณหภูมิ, ความชื้น
- รองรับโมเดลพืช 6 ชนิด: ทิวลิป, กุหลาบ, มะเขือเทศ, ทานตะวัน, มอนสเตอร่า, ลิลลี่ม่วง
- รองรับการตรวจสุขภาพพืช 38 คลาส (ตามมาตรฐาน PlantVillage)
- รองรับโซนพืช 3 โซน: ไม้ดอกเมืองหนาว, สมุนไพร, ผักสวนครัว
- รองรับร้านค้าที่มีหมวดหมู่สินค้า 6 หมวด (เมล็ดพันธุ์, ไม้ดอก, ผักสวนครัว, อุปกรณ์ปลูก, ดินและปุ๋ย, ทั้งหมด), ระบบสินค้าโปรด (Favorites), ระบบโค้ดส่วนลด, แพ็กเกจเริ่มต้นมือใหม่ และระบบจำลองการชำระเงิน

---

## 2. สถาปัตยกรรมระบบ (System Architecture)

### 2.1 ภาพรวมระบบ (System Overview)

ระบบ GardenVerse ถูกออกแบบมาให้เป็น **End-to-End IoT Solution** ตั้งแต่การรับค่าจากเซ็นเซอร์ในสวน ส่งผ่าน Firebase Realtime Database จากนั้น Bridge Service จะนำข้อมูลไปจัดเก็บลง PostgreSQL (Supabase) เพื่อใช้เป็น Time-series History พร้อมทั้งมีการประมวลผลด้วย AI สำหรับวินิจฉัยโรค และแสดงผลแบบ 3D Dashboard บน Frontend โดยมีลำดับการทำงาน (Data Flow) ดังนี้

1. **Hardware Layer**: บอร์ด ESP32 อ่านค่าจากเซ็นเซอร์ (อุณหภูมิ, ความชื้น) และส่งข้อมูลผ่านโปรโตคอล HTTPS ขึ้น Firebase Realtime Database ทุก 5 วินาที โดยใช้ Firebase Server Timestamp เพื่อลด Clock Skew
2. **Bridge Layer (Python)**: Bridge Service (`bridge.py`) ใช้ `firebase-admin` SDK ทำการ `listen()` ไปยังโหนด `/readings` ใน Firebase RTDB เมื่อมีข้อมูลใหม่เข้ามาจะใช้ `psycopg2` insert ลง PostgreSQL ผ่าน Supabase พร้อมตรวจสอบ Duplicate ด้วย `ON CONFLICT (firebase_key) DO NOTHING`
3. **AI/Processing Layer**: ใช้ Python (FastAPI) จัดการภาพจากกล้องผู้ใช้เพื่อวิเคราะห์สุขภาพพืช ด้วยโมเดล MobileNet (`mobilenet_best_model.h5`) ที่เทรนกับชุดข้อมูล PlantVillage (38 คลาส)
4. **Frontend (Next.js)**: ทำหน้าที่เป็นทั้ง Presentation Layer และ Lightweight API Gateway โดยใช้ App Router ใน Next.js 16 ดึงข้อมูลจาก Firebase REST API (Direct fetch) และส่งภาพไปยัง FastAPI สำหรับ AI Prediction พร้อมแสดงผล Dashboard 3D ด้วย React Three Fiber
5. **Database**: เก็บข้อมูล Time-series ของเซ็นเซอร์ใน PostgreSQL (ตาราง `sensor_readings`) และข้อมูลพืชผู้ใช้ในตาราง `plants` ผ่าน Supabase

### 2.1.1 ตารางเทคโนโลยีที่เลือกใช้

| ส่วนของงาน | เทคโนโลยีที่เลือกใช้ | เหตุผลในการเลือกใช้ |
|:--|:--|:--|
| Frontend | Next.js 16 (App Router) + React 19 | รองรับ Server-Side Rendering (SSR), Client Component แบบ `"use client"` ทำให้โหลดข้อมูล real-time ได้เร็ว และ SEO ดี |
| Styling | Tailwind CSS v4 | เขียนสไตล์ได้ไว ควบคุม Design System ได้ง่ายผ่าน Utility-first classes |
| Design Pattern | Atomic Design | แยก Component เป็น Atoms / Molecules / Organisms ทำให้ Reusable สูง และจัดการ Dashboard ที่ซับซ้อนได้เป็นระเบียบ |
| 3D Visualization | Three.js + @react-three/fiber + @react-three/drei | รองรับการเรนเดอร์โมเดล 3D (`.glb`) ของพืชและโรงเรือน ในเบราว์เซอร์ได้อย่างมีประสิทธิภาพ |
| State Management | Zustand | API เรียบง่าย น้ำหนักเบา (light-weight) เหมาะกับการจัดการ Selection / Edit Mode / Animation State ในระบบ 3D |
| Bridge / IoT | Python (firebase-admin + psycopg2) | ใช้ Firebase listener เพื่อ subscribe สู่ event แบบ real-time แล้ว Insert ลง PostgreSQL ได้ทันที |
| AI Engine | Python (FastAPI + TensorFlow / Keras) | มี Library ด้าน Data Science และ Image Processing (PIL/NumPy) ครบ พร้อมรองรับ MobileNet สำหรับ Image Classification |
| Real-time DB | Firebase Realtime Database | รับค่าจาก ESP32 ได้ทันทีผ่าน HTTPS เหมาะกับ Streaming Data ปริมาณน้อยแต่บ่อย |
| Persistent DB | PostgreSQL (Supabase) | เป็น Relational Database ที่เสถียร เก็บ Time-series ของเซ็นเซอร์และข้อมูลผู้ใช้ |
| Hardware | ESP32 + FirebaseESP32 Library | บอร์ด IoT ที่มี Wi-Fi ในตัว ราคาประหยัด และมี Library พร้อมสำหรับ Firebase |
| Icons | lucide-react | ชุดไอคอน open-source ที่สวยงาม รองรับการปรับขนาด/สี ผ่าน Tailwind |

### 2.1.2 การประยุกต์ Atomic Design

สำหรับการทำ Monitoring เราใช้แนวคิด Atomic Design ในการสร้าง Dashboard ดังนี้:

1. **Atoms** (`src/components/atoms/`): องค์ประกอบที่เล็กที่สุด ใช้ซ้ำได้สูง
   - `GridFloor.tsx` – พื้น Grid 10×10 สำหรับวางกระถาง
   - `MiniSparkline.tsx` – กราฟเส้นเล็กแสดงแนวโน้มของเซ็นเซอร์
2. **Molecules** (`src/components/molecules/`): การรวม Atoms เข้าด้วยกัน
   - `WeatherWidget.tsx` – การ์ดแสดงอุณหภูมิ/ความชื้น/ลม
   - `StatCard.tsx` – การ์ดแสดงค่าเซ็นเซอร์
   - `Plant3DModel.tsx`, `PlantPotModel.tsx`, `GreenhouseModel.tsx` – โมเดล 3D
   - `WateringAnimation.tsx`, `FertilizingAnimation.tsx` – เอฟเฟกต์ Animation
3. **Organisms** (`src/components/organisms/`): การรวม Molecules เป็นบล็อกใหญ่
   - `Navbar.tsx`, `Sidebar.tsx` – Navigation
   - `Garden3D.tsx` – แผงควบคุมโรงเรือน 3D หลัก
   - `SensorChart.tsx` – กราฟเซ็นเซอร์ย้อนหลัง
   - `PlantDetailPanel.tsx` – แผงแสดงรายละเอียดพืช
   - `BottomPanel.tsx` – แผงด้านล่างรวม Weather + รายการพืช + ภารกิจ
   - `AlertPanel.tsx`, `SettingsModal.tsx`, `CartSidebar.tsx`
4. **Templates / Pages** (`src/app/`): หน้าที่นำ Organisms มาจัดวางแบบ Responsive
   - `home/page.tsx` – หน้า Dashboard หลัก (3D + Sidebar + Panel)
   - `plants/page.tsx` – หน้าจัดการพืช
   - `history/page.tsx` – หน้าประวัติการดูแล
   - `disease-detect/page.tsx` – หน้า AI ตรวจโรคพืช
   - `shop/page.tsx` – หน้าร้านค้า
   - `login/page.tsx` – หน้าเข้าสู่ระบบ/สมัครสมาชิก

### 2.2 การออกแบบเส้น API (API Endpoints Design)

เพื่อให้ระบบทำงานได้สมบูรณ์ โครงสร้าง API ของ GardenVerse จะแบ่งออกเป็น 3 กลุ่มหลัก โดยอิงตามแหล่งข้อมูลและความรับผิดชอบ ดังนี้

#### 2.2.1 ส่วน Hardware → Firebase Layer

ESP32 จะส่งข้อมูลผ่าน Firebase Realtime Database โดยตรงผ่าน HTTPS ตามรูปแบบ JSON ที่ออกแบบไว้

| Endpoint | Method | Description | Request Body (Example) |
|:--|:--|:--|:--|
| `https://gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json` | POST (push) | ESP32 ส่งข้อมูลเซ็นเซอร์ขึ้น Firebase | `{ "device_id": "esp32-mock-01", "temperature": 28.22, "humidity": 60.34, "timestamp": { ".sv": "timestamp" } }` |

> **หมายเหตุ**: ใช้ `timestamp/.sv: "timestamp"` เพื่อให้ Firebase Server ใส่ epoch ms ให้ ลดปัญหา clock skew

#### 2.2.2 ส่วน Bridge → PostgreSQL Layer

Bridge Service (Python) จะรับ event จาก Firebase แล้ว insert ลง PostgreSQL ผ่าน Supabase

| Operation | Source | Destination | Description |
|:--|:--|:--|:--|
| `INSERT INTO sensor_readings (device_id, temperature, humidity, recorded_at, firebase_key)` | Firebase `/readings` | Supabase PostgreSQL | บันทึกข้อมูลเซ็นเซอร์พร้อม Deduplicate ด้วย `firebase_key` |

#### 2.2.3 ส่วน AI Service Layer (FastAPI)

FastAPI ที่ port 8000 ทำหน้าที่รับภาพและตอบกลับผลการวิเคราะห์โรคพืช

| Endpoint Path | Method | Description | Request / Response Body (Example) |
|:--|:--|:--|:--|
| `/predict` | POST (multipart/form-data) | ส่งภาพใบพืชและรับผลการวินิจฉัย | **Request**: `file: <image binary>`<br>**Response**: `{ "status": "success", "prediction": "Tomato Late Blight (โรคใบไหม้สายมะเขือเทศ)", "class_id": 30, "confidence": 92.45, "advice": "หลีกเลี่ยงการรดน้ำตอนเย็น..." }` |

#### 2.2.4 ส่วน Frontend Monitoring (Next.js → External Sources)

API ที่ Next.js (Frontend) เรียกใช้เพื่อนำข้อมูลมาแสดงใน Dashboard

| Endpoint Path | Method | Description | Response Body (Example) |
|:--|:--|:--|:--|
| `/readings.json?orderBy="$key"&limitToLast=1` (Firebase) | GET | ดึงค่าล่าสุดของเซ็นเซอร์ (real-time polling ทุก 5 วินาที) | `{ "-Or95U98JvHA8fYjj5L5": { "device_id": "esp32-mock-01", "temperature": 28.22, "humidity": 60.34, "timestamp": 1715600000000 } }` |
| Supabase `from('plants').select('*').eq('username', username)` | GET | ดึงรายการพืชของผู้ใช้ | `[{ "id": 1, "name": "ทิวลิป", "sciName": "Tulipa spp.", "status": "สุขภาพดี", "age": "45 วัน", "image": "..." }]` |
| Supabase `from('plants').insert([newPlantData])` | POST | เพิ่มพืชใหม่ในระบบ | `{ "id": 2, "name": "กุหลาบ", ... }` |
| FastAPI `/predict` | POST | ส่งภาพให้ AI ตรวจโรคพืช | (ดู 2.2.3) |

#### 2.2.5 Dashboard Control (Local State + LocalStorage)

ในเวอร์ชันปัจจุบัน การควบคุมยังจัดการที่ฝั่ง Frontend ผ่าน Zustand Store (`src/store/useStore.ts`) และ `localStorage` สำหรับการคงสภาพข้อมูล ตัวอย่าง action สำคัญ:

| Action | Method | Description | Payload (Example) |
|:--|:--|:--|:--|
| `setActiveCareTool('water')` | Local State | สั่งเปิดเครื่องมือรดน้ำ (Interactive 3D) | `{ "action": "water", "itemId": "item-123" }` |
| `setActiveCareTool('fertilize')` | Local State | สั่งใส่ปุ๋ย (Interactive 3D) | `{ "action": "fertilize", "itemId": "item-123" }` |
| `addItem({ type, gridX, gridZ, plotId })` | Local State | วางกระถาง/แปลง/ของตกแต่งบน Grid | `{ "type": "pot", "gridX": 3, "gridZ": 5, "plotId": "p1" }` |
| `addDetectionHistory({ prediction, confidence, advice, imageUrl })` | Local State | บันทึกผลการตรวจโรคลงประวัติ | `{ "prediction": "Tomato Late Blight", "confidence": 92.45, ... }` |

---

## 3. การพัฒนาและแก้ปัญหา (Implementation)

### 3.1 การพัฒนาฝั่ง Frontend & Backend

#### 3.1.1 โครงสร้างโฟลเดอร์ (Project Structure)

```
GardenVerse/
├── src/                          # Frontend (Next.js 16 App Router)
│   ├── app/                      # Pages
│   │   ├── home/page.tsx         # หน้า Dashboard 3D
│   │   ├── plants/page.tsx       # จัดการพืชของผู้ใช้
│   │   ├── history/page.tsx      # ประวัติการดูแล
│   │   ├── disease-detect/       # AI ตรวจโรคพืช
│   │   ├── shop/page.tsx         # ร้านค้า
│   │   ├── login/page.tsx        # Login / Sign-up
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/               # Atomic Design Components
│   │   ├── atoms/                # GridFloor, MiniSparkline
│   │   ├── molecules/            # WeatherWidget, Plant3DModel, ...
│   │   └── organisms/            # Navbar, Sidebar, Garden3D, ...
│   ├── lib/                      # Utility & API client
│   │   ├── supabase.ts           # Supabase client
│   │   └── mockData.ts           # ข้อมูล zone / myPlants
│   ├── store/
│   │   └── useStore.ts           # Zustand global state
│   └── proxy.ts                  # Next.js Middleware (auth guard)
├── backend/                      # Python AI Service (FastAPI)
│   ├── main.py                   # /predict endpoint
│   ├── mobilenet_best_model.h5   # โมเดล MobileNet
│   ├── inspect_model.py
│   └── requirements.txt
├── bridge/                       # Python Firebase → PostgreSQL Bridge
│   ├── bridge.py
│   └── gardenverse-...json       # Firebase Admin SDK key
├── ESP_Sensor_Firebase/          # Arduino sketch สำหรับ ESP32
│   └── ESP_Sensor_Firebase.ino
├── public/                       # รูปและโมเดล 3D (.glb)
├── next.config.ts
├── package.json
└── tsconfig.json
```

#### 3.1.2 การจัดการ State (State Management)

ใช้ **Zustand** เป็น Global State Store หลัก (`src/store/useStore.ts`) เพื่อจัดการ:

- **Items**: รายการกระถาง / แปลง / ของตกแต่ง ที่ผู้ใช้วางใน Grid
- **Selection / Edit Mode**: สถานะการเลือก item (คลิกซ้าย) และโหมดแก้ไข (คลิกขวา)
- **Placement Mode**: โหมดวาง (`'pot' | 'bed' | 'deco' | null`)
- **AddModal State**: สถานะเปิด/ปิด Modal เลือกพืช
- **Interactive Care Tools**: เครื่องมือรดน้ำ/ใส่ปุ๋ย และ Animation State
- **Plot Selection**: โซน / แปลงที่กำลังเลือก
- **Detection History**: ประวัติการตรวจโรคพืชด้วย AI

#### 3.1.3 การจัดการข้อมูล Real-time (Real-time Update)

ใช้ **Polling Pattern** ผ่าน `setInterval` ทุก 5 วินาที (`src/components/organisms/BottomPanel.tsx`) เนื่องจากต้องการความเรียบง่าย ลดความซับซ้อนของ WebSocket และยังคงให้ผู้ใช้รู้สึกถึงความ real-time:

```typescript
useEffect(() => {
  const fetchSensorData = async () => {
    const response = await fetch(
      'https://gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json?orderBy="$key"&limitToLast=1'
    );
    const data = await response.json();
    if (data) {
      const key = Object.keys(data)[0];
      const latest = data[key];
      setTemperature(latest.temperature);
      setHumidity(latest.humidity);
    }
  };
  fetchSensorData();
  const interval = setInterval(fetchSensorData, 5000);
  return () => clearInterval(interval);
}, []);
```

#### 3.1.4 การพัฒนา 3D Garden (React Three Fiber)

ใช้ React Three Fiber + Drei เพื่อเรนเดอร์โรงเรือนเสมือนจริง (`src/components/organisms/Garden3D.tsx`):

- ใช้ `<Canvas>` พร้อม `<Sky>`, `<Environment preset="city" />`, `<ContactShadows>` สำหรับแสงเงาที่สมจริง
- ใช้ `<OrbitControls>` พร้อมล็อกการหมุนด้วยคลิกขวา (เพราะคลิกขวาใช้เปิดเมนูแก้ไข)
- ใช้ระบบ **Grid-based Placement** (10×10 blocks, แต่ละ block 2 หน่วย 3D) ผ่าน `gridToPosition()` และ `positionToGrid()` เพื่อ snap to grid
- โหลดโมเดล `.glb` ของพืช 6 ชนิดผ่าน `useGLTF` ใน `Plant3DModel.tsx`

#### 3.1.5 การ Authentication

ใช้ Next.js Middleware (`src/proxy.ts`) ตรวจสอบ cookie `is_authenticated` หากผู้ใช้ยังไม่ได้ login จะ redirect ไปที่ `/login` ทันที ข้อมูลผู้ใช้และ Theme เก็บใน `localStorage` (`gardenverse_users`, `current_user`, `gardenverse_theme`)

#### 3.1.6 การพัฒนาส่วน E-commerce (Shop)

ใช้ React `useState` จัดการ State ของร้านค้าภายใน `src/app/shop/page.tsx` แบ่งเป็น 4 ส่วนหลัก:

```typescript
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [activeCategory, setActiveCategory] = useState("all");
const [recommended, setRecommended] = useState(RECOMMENDED_PRODUCTS);
const [bestSellers, setBestSellers] = useState(BEST_SELLERS);
const [showFavorites, setShowFavorites] = useState(false);
```

จุดเด่นในการออกแบบฝั่ง Shop:

- **Category Filter**: ใช้ฟิลด์ `categoryId` ฝังในข้อมูลสินค้าและ filter แบบ derived state (`ALL_PRODUCTS.filter(p => p.categoryId === activeCategory)`) ทำให้ไม่ต้อง state ซ้อน
- **Favorites Toggle**: ใช้ `Array.from(new Map(...))` deduplicate รายการที่ปรากฏซ้ำในทั้ง `recommended` และ `bestSellers` ก่อนแสดงผล
- **Discount Code**: ใช้ Pattern Whitelist (เฉพาะโค้ด `GARDEN10`) ใน `CartSidebar.tsx` คำนวณส่วนลดเป็น `(totalPrice * appliedDiscount) / 100` แสดงสรุปราคาแบบสามบรรทัด (ราคาสินค้า / ส่วนลด / ยอดสุทธิ)
- **Add to Cart Logic**: ใช้ Functional Update + Map/Find เพื่อให้กดเพิ่มสินค้าเดิมแล้ว `quantity + 1` แทนที่จะสร้างรายการใหม่ทุกครั้ง
- **Starter Pack**: ใช้ callback prop `onAddStarterPack` ส่งจาก `shop/page.tsx` ลงไปยัง `ShopBanners` เพื่อ inject `handleAddToCart()` แบบ inversion-of-control ทำให้ banner สามารถเพิ่มสินค้าได้โดยไม่ผูกกับ state ภายใน

### 3.2 การบูรณาการ Hardware/AI (Integration)

#### 3.2.1 ESP32 → Firebase Realtime Database

โค้ด Arduino (`ESP_Sensor_Firebase/ESP_Sensor_Firebase.ino`) ใช้ Library `FirebaseESP32` เพื่อ push JSON ขึ้น Firebase ทุก 5 วินาที พร้อมใช้ Random Walk จำลองค่าเซ็นเซอร์อย่างสมจริง

```cpp
FirebaseJson json;
json.set("temperature", mockTemp);     // 20-40 °C
json.set("humidity", mockHumid);       // 30-90 %
json.set("timestamp/.sv", "timestamp"); // Server timestamp
json.set("device_id", "esp32-mock-01");

if (Firebase.pushJSON(fbdo, "/readings", json)) {
  Serial.printf("✅ Sent: %.2f°C, %.2f%%\n", mockTemp, mockHumid);
}
```

**Payload JSON ที่ส่งขึ้น Firebase**:
```json
{
  "device_id": "esp32-mock-01",
  "temperature": 28.22,
  "humidity": 60.34,
  "timestamp": 1715600000000
}
```

#### 3.2.2 Firebase → PostgreSQL Bridge (Python)

`bridge/bridge.py` ทำหน้าที่เป็นตัวกลาง: ฟัง event จาก Firebase ผ่าน `firebase_admin.db.reference("/readings").listen(on_event)` แล้ว Insert ลง PostgreSQL ด้วย `psycopg2`:

```python
def insert_reading(firebase_key: str, data: dict) -> bool:
    ts_ms = data.get("timestamp")
    recorded_at = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc)
    with get_pg_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO sensor_readings
                  (device_id, temperature, humidity, recorded_at, firebase_key)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (firebase_key) DO NOTHING
                RETURNING id;
            """, (data.get("device_id"), data.get("temperature"),
                  data.get("humidity"), recorded_at, firebase_key))
```

จุดเด่นของการออกแบบนี้:
- **Idempotent**: ใช้ `firebase_key` เป็น Unique Key ป้องกัน Duplicate
- **Connection per insert**: เปิด connection ใหม่ทุกครั้งเพื่อให้ทนต่อ Connection Pooler ที่ตัด idle
- **Initial Snapshot Handling**: เมื่อ listener เริ่มทำงาน Firebase จะส่ง snapshot ทั้งก้อนมา → loop insert ทีเดียว

#### 3.2.3 Frontend → FastAPI (AI Disease Detection)

หน้า `/disease-detect` (`src/app/disease-detect/page.tsx`) ส่งภาพไปยัง FastAPI ผ่าน `multipart/form-data`:

```typescript
const formData = new FormData();
formData.append("file", selectedImage);

const response = await fetch(`${apiUrl}/predict`, {
  method: "POST",
  body: formData,
});
const data = await response.json();
// data: { status, prediction, class_id, confidence, advice }
```

ฝั่ง FastAPI (`backend/main.py`) ใช้ **MobileNet** จาก TensorFlow/Keras พร้อม Preprocessing ที่สำคัญ:

1. ใช้ `ImageOps.pad` ปรับขนาดเป็น 224×224 แทน `resize` แบบครอบตัด เพื่อรักษาบริบทของใบพืชทั้งใบ
2. Normalize ค่าพิกเซลให้อยู่ในช่วง −1 ถึง 1 ตามมาตรฐาน MobileNet
3. Predict แล้วคืนค่า class id, ชื่อโรคภาษาไทย, ความมั่นใจ และคำแนะนำการรักษา

โมเดลรองรับการจำแนกโรคพืช **38 คลาส** ครอบคลุม 14 ชนิดพืช (Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato)

### 3.3 ความปลอดภัย (Security)

#### 3.3.1 CORS Policy
ตั้งค่า CORS ที่ FastAPI (`backend/main.py`) เพื่ออนุญาตให้ Frontend ติดต่อได้:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # อนุญาตทุก origin (development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

ในการใช้งานจริง (Production) ควรจำกัด `allow_origins` ให้เฉพาะ domain ของ Frontend เท่านั้น

#### 3.3.2 การจัดการ Secret / API Key
- ใช้ `.env` กับ `python-dotenv` ใน Bridge Service (ไฟล์ `bridge/.env` ไม่ commit ลง Git) เพื่อเก็บ `FIREBASE_DB_URL`, `FIREBASE_KEY_PATH`, `DATABASE_URL`
- ใช้ `process.env.NEXT_PUBLIC_*` ใน Next.js สำหรับค่าที่ปลอดภัยต่อการ expose (เช่น Supabase ANON Key, URL ของ AI API)
- Firebase Admin SDK Key เก็บใน `bridge/gardenverse-a21d0-firebase-adminsdk-*.json` และ ignore ใน `.gitignore`

#### 3.3.3 Authentication Layer
ใช้ Next.js Middleware (`src/proxy.ts`) ป้องกันการเข้าถึงหน้า `/home` และเส้นทางที่ต้อง login:

```typescript
export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get('is_authenticated')?.value === 'true';
  const pathname = request.nextUrl.pathname;

  if ((pathname === '/' || pathname === '/home') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  return NextResponse.next();
}
```

#### 3.3.4 Input Validation
- FastAPI ใช้ Pydantic ภายใน `UploadFile` ตรวจสอบประเภทไฟล์อัตโนมัติ
- ฝั่ง Frontend จำกัด `accept="image/*"` ที่ `<input type="file">`
- Bridge ใช้ `ON CONFLICT DO NOTHING` ป้องกันข้อมูลซ้ำ

---

## 4. ผลการทดสอบ (Results & Testing)

### 4.1 ภาพรวมหน้าจอ (UI/UX Showcase)

#### หน้า Dashboard หลัก (`/home`)
- แสดงโรงเรือน 3D พร้อม Grid 10×10 ตรงกลาง
- Sidebar ซ้าย: รายชื่อโซน (ไม้ดอกเมืองหนาว / สมุนไพร / ผักสวนครัว) คลิกเปิด/ปิดได้
- Panel ขวา: รายละเอียดพืชที่เลือก (Empty state → Empty pot → Filled plant)
- BottomPanel: WeatherWidget (real-time จาก Firebase), รายการพืชแบบ scroll, ภารกิจประจำวัน
- Toolbar ลอย: ปุ่ม "วางแปลง", "วางกระถาง", "ตกแต่งสวน"

#### หน้า AI ตรวจโรคพืช (`/disease-detect`)
- โซนอัปโหลด: รองรับการลาก-วาง รูป JPG/PNG
- ปุ่ม "เริ่มการวิเคราะห์สุขภาพพืช" → spinner + ข้อความ "Deep Scanning..."
- แสดงผล: ชื่อโรคภาษาไทย + ค่า Confidence (Progress bar) + คำแนะนำการรักษา
- ประวัติการตรวจสอบ: Grid card 3 คอลัมน์ แสดงรูป + timestamp + confidence

#### หน้าจัดการพืช (`/plants`)
- การ์ดพืชแสดงรูป, ชื่อ, ชื่อวิทยาศาสตร์, สถานะ (สุขภาพดี / เฝ้าระวัง)
- Modal "เพิ่มพืชใหม่" พร้อมเลือกรูป 5 แบบ
- Right Sidebar: สรุปจำนวนพืชทั้งหมด / สุขภาพดี / เฝ้าระวัง

#### หน้าประวัติการดูแล (`/history`)
- ใช้ `CareHistoryContent` แสดงตารางและสรุปการรดน้ำ ใส่ปุ๋ย รวมถึงสุขภาพย้อนหลัง

#### หน้าร้านค้า (`/shop`)
- **ShopHeader**: หัวร้านค้าพร้อมปุ่ม "จัดการสินค้าโปรด" สลับโหมดแสดงเฉพาะสินค้าที่ผู้ใช้กดหัวใจ
- **ShopSearchCategories**: ช่องค้นหาและแถบหมวดหมู่ 6 หมวด (ทั้งหมด / เมล็ดพันธุ์ / ไม้ดอก / ผักสวนครัว / อุปกรณ์ปลูก / ดินและปุ๋ย) กดเปลี่ยนหมวดเพื่อกรองสินค้าได้ทันที
- **ShopBanners**: แบนเนอร์ 3 ช่อง — ส่งฟรีเมื่อซื้อครบ 500 บาท, ลด 10% ด้วยโค้ด `GARDEN10` (กดเพื่อ copy clipboard อัตโนมัติ), แพ็กเกจเริ่มต้นมือใหม่ราคา 399 บาท (กดเพื่อเพิ่มลงตะกร้าได้ทันที)
- **ProductGrid**: สินค้าแนะนำและสินค้าขายดีรวม 14 รายการ ครอบคลุมหลายหมวด ได้แก่ ทิวลิป, ลาเวนเดอร์, โหระพา, มะเขือเทศเชอร์รี่, ดินปลูกอเนกประสงค์, กระถางต้นไม้มินิมอล, ทานตะวัน, ไฮเดรนเยีย, ขุยมะพร้าว, บัวรดน้ำมินิมอล, ชุดเครื่องมือปลูก 3 ชิ้น, ดอกเดซี่, ฟอร์เก็ตมีน็อต, เมล็ดผักสลัดรวม
- **ProductCard**: แต่ละการ์ดแสดงรูป, ชื่อ, ชื่อวิทยาศาสตร์, ราคา, คะแนนรีวิว (Star + จำนวนรีวิว), ปุ่มเพิ่มลงตะกร้า และปุ่มหัวใจ (Favorite) ที่กดสลับสถานะได้
- **CartSidebar**: ตะกร้าสินค้าพร้อมปรับจำนวน (+/−), ลบรายการ, ช่องกรอกโค้ดส่วนลด (รองรับโค้ด `GARDEN10` ลด 10%), แสดงสรุปราคาสินค้า–ส่วนลด–ยอดสุทธิ, ปุ่ม "ไปยังหน้าชำระเงิน" (จำลองการชำระเงินผ่าน alert)
- **ShopFeatures / SuggestedProducts**: ส่วนเสริมแสดงจุดเด่นของร้านและสินค้าแนะนำเพิ่มเติม
- ตัวอย่าง Empty State: เมื่อยังไม่มีสินค้าโปรด แสดงข้อความ "ยังไม่มีสินค้าโปรด" พร้อมปุ่ม "เลือกดูสินค้าเลย" และเมื่อหมวดหมู่ที่เลือกไม่มีสินค้าแสดงข้อความแนะนำให้เปลี่ยนหมวด

#### หน้า Login (`/login`)
- รองรับทั้ง Sign-in (Username/Email + Password) และ Sign-up (Username + Email + Password)
- ใช้ `localStorage` เก็บข้อมูลผู้ใช้และ cookie `is_authenticated` สำหรับ Middleware

### 4.2 ผลการทดสอบระบบ (Performance & Latency)

| รายการทดสอบ | ผลลัพธ์ | หมายเหตุ |
|:--|:--|:--|
| Latency: ESP32 → Firebase RTDB | ~250–400 ms | ขึ้นกับสัญญาณ Wi-Fi และระยะห่างจาก Server (asia-southeast1) |
| Latency: Firebase → Bridge → PostgreSQL | ~150–300 ms | เปิด connection ใหม่ทุกครั้ง เพื่อทนต่อ pooler |
| Latency: Frontend Polling (ทุก 5 วินาที) | ~120–200 ms ต่อ request | ใช้ REST API ดึงข้อมูลล่าสุด 1 record |
| Latency: AI Predict (`/predict`) | ~1.2–2.5 วินาที | ใช้ MobileNet (CPU-only) ที่ 224×224 input |
| Accuracy ของโมเดล (MobileNet) | ~90–95% (จาก validation set ของ PlantVillage) | ทดสอบจริงกับรูปนอกชุดข้อมูล confidence อยู่ในช่วง 70–98% |
| FPS ของ Garden 3D | ~55–60 FPS (เครื่อง mid-range) | ใช้ Suspense + Environment preset และจำกัดจำนวน item ใน Grid |
| Bundle Size (Production build) | ประมาณ 1.4 MB (gzip) | Code-splitting อัตโนมัติของ Next.js App Router |

### 4.3 ปัญหาที่พบและวิธีแก้ไข (Challenges & Solutions)

| ปัญหา | สาเหตุ | วิธีแก้ไข |
|:--|:--|:--|
| **CORS Blocked** เมื่อ Frontend เรียก FastAPI | FastAPI ยังไม่ได้ตั้งค่า CORS Middleware | เพิ่ม `CORSMiddleware` ใน `main.py` พร้อม `allow_origins=["*"]` (ในขั้นพัฒนา) |
| **AI Predict ครอปรูปเสียบริบท** | ใช้ `image.resize()` แบบเดิม → ตัดขอบใบทิ้ง | เปลี่ยนเป็น `ImageOps.pad((224,224), color=(0,0,0))` ทำให้คงสัดส่วนเดิมและเติมขอบดำแทน |
| **Firebase listener ส่ง snapshot ก้อนใหญ่ครั้งแรก** | event แรก `path == "/"` มี data ทั้งหมด | ตรวจสอบ `path == "/"` แล้ว loop insert ทีละ record พร้อมนับสถิติเพื่อ debug |
| **PostgreSQL connection ถูกตัด (idle timeout)** | Supabase pooler ตัด connection ที่ idle นาน | เปลี่ยนเป็นเปิด connection ใหม่ทุกครั้งที่ insert (`get_pg_conn()`) |
| **Type Mismatch ใน PostgreSQL** | คอลัมน์ `temperature/humidity` เป็น `INTEGER` แต่ ESP32 ส่ง float | แก้คอลัมน์ใน DB เป็น `FLOAT` / `NUMERIC` |
| **Browser Context Menu บัง 3D View** | คลิกขวาเปิดเมนูเบราว์เซอร์ทับ Garden3D | เพิ่ม `onContextMenu={(e) => e.preventDefault()}` ที่ `<Canvas>` และล็อก `OrbitControls` ไม่ให้ใช้คลิกขวา |
| **รูปจาก Unsplash โหลดช้าและไม่เสถียร** | URL ภายนอกขึ้นกับ network และ Next.js ต้อง allow domain | ในตอนแรกแก้ `next.config.ts` เพิ่ม `remotePatterns` ของ `images.unsplash.com` ต่อมาเปลี่ยนเป็นใช้รูปสินค้าใน `public/images/products/` ทั้งหมด (เช่น `tulip.png`, `lavender.png`, `sunflower.png`) เพื่อให้โหลดเร็วและทำงาน Offline ได้ |
| **ข้อมูลสินค้าซ้ำในหน้า Favorites** | สินค้าตัวเดียวกันถูก toggle ใน 2 array (`recommended` + `bestSellers`) | ใช้ `Array.from(new Map(items.map(it => [it.id, it])).values())` deduplicate ตาม `id` ก่อนเรนเดอร์ |
| **Category Filter ไม่ครอบคลุมทั้ง 2 ProductGrid** | เดิม filter แยกใน 2 grid ทำให้ผลลัพธ์ไม่ถูก | รวมทั้ง 2 ลิสต์เป็น `ALL_PRODUCTS = [...recommended, ...bestSellers]` แล้ว filter รวมก่อนส่งให้ `ProductGrid` เดียว |
| **Supabase ดึงข้อมูลล้มเหลวกรณีไม่มี table** | ตาราง `plants` ยังไม่ได้สร้าง | ใช้ try/catch fallback ไปดึงข้อมูลจาก `localStorage` แทน เพื่อให้ระบบยังทำงานต่อได้ |
| **State ของ 3D item ใหญ่/สับสน** | useState ในหลาย component ทำ prop drilling | ย้ายไปใช้ Zustand เป็น Global Store เดียว ทำให้ component แต่ละตัวเข้าถึง state ได้โดยตรง |

---

## 5. บทสรุปและข้อเสนอแนะ (Conclusion & Future Work)

### 5.1 บทสรุป

โครงงาน **GardenVerse** ประสบความสำเร็จในการพัฒนา Full-stack Web Application ที่ผสานเทคโนโลยีหลายส่วนเข้าด้วยกัน ทั้ง **IoT (ESP32 + Firebase)**, **Real-time Database**, **PostgreSQL Bridge**, **AI/ML (MobileNet)** และ **3D Visualization (Three.js)** บน Next.js 16 (App Router)

สรุปความสำเร็จเทียบกับวัตถุประสงค์ที่ตั้งไว้:

| วัตถุประสงค์ | ผลการดำเนินงาน |
|:--|:--|
| 1. Web Application แสดง Dashboard เข้าใจง่าย | ✅ พัฒนาแล้ว มีหน้า `/home` พร้อม Dashboard 3D, BottomPanel แสดงสภาพอากาศและภารกิจ |
| 2. Interactive UI แบบ real-time | ✅ ใช้ Polling 5 วินาทีดึงค่าจาก Firebase + Animation รดน้ำ/ใส่ปุ๋ย |
| 3. Backend จัดการข้อมูลจากภายนอก | ✅ Bridge Service เชื่อม Firebase → PostgreSQL + Supabase Client ใน Frontend |
| 4. ระบบแจ้งเตือนและให้คำแนะนำ | ✅ AI ตรวจโรคพร้อม `ADVICE_MAP` 38 คำแนะนำ + Notification badge ใน Navbar |
| 5. ศึกษา Full-stack Web Development | ✅ ใช้เทคโนโลยีครบทั้ง Frontend (Next.js + R3F), Backend (FastAPI), Database (PostgreSQL/Firebase), IoT (ESP32) |
| 6. บูรณาการ AI ตรวจโรคพืช (เพิ่มเติม) | ✅ MobileNet จำแนกได้ 38 คลาส, Confidence 70–98% |
| 7. ระบบ E-commerce ครบวงจร (เพิ่มเติม) | ✅ ร้านค้าที่มี 6 หมวดหมู่, Favorites Toggle, โค้ดส่วนลด `GARDEN10`, Starter Pack 399 บาท, Cart พร้อม Checkout Simulation |

ผลลัพธ์ที่ได้แสดงให้เห็นว่า การใช้สถาปัตยกรรมแบบ **Layered Architecture** (Hardware → Bridge → Database → AI → Frontend) ช่วยลด coupling ระหว่างระบบ และทำให้แต่ละส่วนสามารถพัฒนาและทดสอบแยกได้ ในขณะที่ **Atomic Design** ช่วยให้ Frontend ขยายต่อได้ง่ายและ Reusable สูง

### 5.2 ข้อเสนอแนะ (Future Work)

#### 5.2.1 แนวทางการนำไปใช้งานจริง
- **โรงเรือนเชิงพาณิชย์**: สามารถต่อยอดเป็นระบบ Smart Greenhouse สำหรับเกษตรกรหรือฟาร์มทดลอง โดยเพิ่มเซ็นเซอร์จริง (Soil Moisture, NPK, LDR, pH) แทน Mock Data
- **การศึกษา**: ใช้เป็นเครื่องมือสาธิตในห้องเรียนชีววิทยา/เกษตรศาสตร์ ให้นักเรียนเห็นความสัมพันธ์ระหว่างปัจจัยแวดล้อมและการเจริญเติบโตของพืช
- **บริการเชิง SaaS**: เสนอเป็นแพลตฟอร์มสำหรับร้านขายต้นไม้/ผู้ปลูกในเมือง โดยเก็บค่าบริการตามจำนวน device ที่เชื่อมต่อ

#### 5.2.2 แนวทางการอัปเกรดระบบในอนาคต

1. **เปลี่ยนจาก Polling เป็น WebSocket / SSE**
   ใช้ Supabase Realtime หรือ Firebase Listener ฝั่ง Browser เพื่อลด overhead ของ HTTP polling
2. **เพิ่ม Time-series Database**
   ติดตั้ง `TimescaleDB` extension บน PostgreSQL เพื่อเก็บข้อมูลเซ็นเซอร์ระยะยาวอย่างมีประสิทธิภาพ พร้อมทำ Aggregation (daily/weekly mean)
3. **ขยาย AI Model**
   - เทรนโมเดลใหม่ด้วยภาพพืชไทย (กล้วยไม้, มะม่วง, ทุเรียน)
   - เพิ่ม Object Detection (YOLO) เพื่อระบุตำแหน่งของจุดที่เป็นโรคบนใบ
   - ทำ Quantization (TFLite) เพื่อ deploy บน Edge (ESP32-CAM / Raspberry Pi)
4. **ระบบแจ้งเตือนข้ามแพลตฟอร์ม**
   เพิ่ม Push Notification ผ่าน Firebase Cloud Messaging (FCM) และ LINE Notify เมื่อค่าเซ็นเซอร์อยู่นอกช่วงที่ตั้งไว้
5. **เพิ่ม Hardware Control**
   เปิด/ปิดปั๊มน้ำ, พัดลม, ไฟปลูกพืช จาก Web (สั่งผ่าน Firebase → ESP32 subscribe) ทำให้ระบบเป็น Two-way IoT จริง ๆ
6. **Multi-tenant & Authentication**
   เปลี่ยนจาก `localStorage` เป็น Supabase Auth พร้อม Row Level Security (RLS) เพื่อรองรับผู้ใช้หลายคนปลอดภัยขึ้น
7. **PWA / Mobile-first**
   ทำเป็น Progressive Web App ให้ติดตั้งบนมือถือได้ พร้อม Offline-first caching
8. **3D Realism**
   เพิ่มโมเดลพืชที่เปลี่ยน Texture ตามค่า health, ใช้ Shader Animation จำลองการเหี่ยวเฉาเมื่อความชื้นต่ำ

---

## 6. ลิงค์ Project และ Source Code

- **GitHub Repository**: https://github.com/chanyapakSub/GardenVerse
- **โครงสร้างหลัก**:
  - Frontend: `src/` (Next.js 16 App Router)
  - AI Service: `backend/` (FastAPI + MobileNet)
  - IoT Bridge: `bridge/` (Python firebase-admin + psycopg2)
  - Hardware: `ESP_Sensor_Firebase/` (Arduino sketch สำหรับ ESP32)

วิธีรันโครงการ:
```bash
# Frontend
npm install
npm run dev

# AI Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Bridge
cd bridge && python bridge.py
```

---

## 7. รายชื่อสมาชิกและหน้าที่ที่รับผิดชอบ

| ชื่อ – นามสกุล | ความรับผิดชอบในทีม |
|:--|:--|
| ณัชณศา เลิศมหากูล | UX/UI Design, Backend (FastAPI AI Service, การออกแบบ API) |
| นันท์นภัส นันทพรนิรชา | UX/UI Design, Backend (Bridge Service Firebase → PostgreSQL, Database Schema) |
| อนวัช อนุสุเรนทร์ | Frontend (Next.js Dashboard, 3D Garden ด้วย Three.js), Backend (Firebase RTDB Integration) |
| ชัญญาภัค ทรัพย์สวัสดิ์กุล | Frontend (Disease Detection Page, Shop, Plants Management), Backend (Supabase Integration, Authentication Flow) |

---

## 8. การใช้งานเครื่องมือปัญญาประดิษฐ์ (AI Usage Declaration)

> "รายวิชานี้อนุญาตและส่งเสริมให้ใช้เครื่องมือ AI เป็นผู้ช่วยในการเขียนโค้ดและแก้ไขบั๊ก (Debugging) แต่นักศึกษาจะต้องเป็นผู้รับผิดชอบต่อโค้ดทุกบรรทัดที่อยู่ในโปรเจกต์ หากมีการตรวจพบว่าโค้ดส่วนใดเกิดข้อผิดพลาด หรือนักศึกษาไม่สามารถอธิบายการทำงานของโค้ดที่ AI สร้างขึ้นมาระหว่างการสอบนำเสนอ (Project Pitching) ได้ จะมีผลต่อคะแนนในหมวดความเข้าใจสถาปัตยกรรมระบบโดยตรง"

กลุ่มของข้าพเจ้าขอรับรองว่า ในการจัดทำโครงงานนี้มีการใช้งานเครื่องมือ AI เพื่อช่วยในการพัฒนา โดยมีรายละเอียดความโปร่งใสดังต่อไปนี้:

### 8.1 เครื่องมือ AI ที่ใช้งาน (AI Tools Used)
- **ChatGPT (GPT-4 / GPT-4o)** – สำหรับช่วยอธิบายแนวคิดและวิเคราะห์ Error
- **Gemini Advanced** – สำหรับช่วยหาวิธีแก้ Error และเสนอแนวทาง Architecture
- **GitHub Copilot** – สำหรับ Auto-complete โค้ดในระหว่างพัฒนา VS Code
- **Claude (Sonnet / Opus)** – สำหรับช่วยตรวจสอบโครงสร้างโค้ดและเขียนเอกสาร

### 8.2 วัตถุประสงค์และขอบเขตการใช้งาน (Purpose & Extent of Use)

- **☑ สร้างโครงร่างโปรเจค / โค้ดพื้นฐาน (Boilerplate)**
  ใช้ ChatGPT ช่วยขึ้นโครงสร้างโฟลเดอร์ Next.js App Router และโครง FastAPI เบื้องต้น รวมถึงโครงสร้าง Zustand Store

- **☑ เขียนลอจิก / อัลกอริทึม (Logic Generation)**
  - ใช้ ChatGPT ช่วยเขียน SQL Schema ของตาราง `sensor_readings` พร้อม Index และ Constraint
  - ใช้ Gemini ช่วยออกแบบฟังก์ชัน `gridToPosition()` / `positionToGrid()` สำหรับ Snap-to-Grid ใน Three.js
  - ใช้ Claude ช่วยตรวจ logic การ deduplicate ด้วย `ON CONFLICT DO NOTHING` ใน Bridge Service

- **☑ ค้นหาและแก้ไขข้อผิดพลาด (Debugging)**
  - ใช้ Gemini ช่วยวิเคราะห์ Error CORS Policy ตอน Frontend เรียก FastAPI
  - ใช้ ChatGPT วิเคราะห์ปัญหา Connection ของ Supabase pooler ที่ตัด idle connection
  - ใช้ Copilot ช่วย refactor ส่วน `useEffect` ที่มี memory leak ใน BottomPanel

- **☑ การออกแบบและ CSS (UI/UX Design)**
  - ใช้ Copilot ช่วยเขียนคลาส Tailwind CSS สำหรับ Responsive Card ของ ProductGrid และ Modal
  - ใช้ ChatGPT แนะนำ Color Palette (เขียว/ครีม/พาสเทล) ให้เข้ากับธีมสวน
  - ใช้ Claude แนะนำ Layout ของหน้า Disease Detect ให้สมดุลระหว่างโซนอัปโหลดและโซนผลลัพธ์

- **☑ การเขียนรายงาน (Documentation)**
  ใช้ Claude / ChatGPT ช่วยเรียบเรียงไวยากรณ์ในบทคัดย่อและสรุปผล รวมถึงจัดรูปแบบ Markdown ของรายงานฉบับนี้

### 8.3 การตรวจสอบและรับรองความถูกต้อง (Human Validation & Accountability)

ทางกลุ่มได้ทำการตรวจสอบโค้ดและเนื้อหาที่ AI สร้างขึ้นทุกครั้งก่อนนำไปใช้ในระบบจริง โดยมีตัวอย่างกรณีดังนี้:

1. **กรณี Bridge Service**
   โค้ด API สำหรับรับค่าจากเซ็นเซอร์ที่ AI เจนเนอเรตมาในตอนแรกใช้รูปแบบ Polling ทุก 1 วินาที ซึ่งทำให้เกิด overhead สูง ทางกลุ่มจึงได้ทำการศึกษาเพิ่มเติมและแก้ไขโค้ดด้วยตนเอง โดยเปลี่ยนเป็นการใช้ `firebase_admin.db.reference().listen()` (Event-driven) แทน นอกจากนี้ได้ทดสอบยิงข้อมูลจริงจากบอร์ด ESP32 เพื่อยืนยันว่าข้อมูลลง PostgreSQL ได้อย่างถูกต้อง

2. **กรณี AI Preprocessing**
   ChatGPT แนะนำเริ่มต้นให้ใช้ `image.resize((224,224))` ในการเตรียมภาพก่อน Predict ซึ่งจะตัดขอบของรูปออก ทำให้บางครั้งโมเดลทำนายผิด ทางกลุ่มได้ทดสอบกับรูปจริงและพบปัญหา จึงได้ค้นคว้าและปรับเปลี่ยนเป็น `ImageOps.pad((224,224), color=(0,0,0))` ที่เติมขอบสีดำแทน ทำให้ความแม่นยำเพิ่มขึ้นอย่างเห็นได้ชัด

3. **กรณี Type Mismatch ใน PostgreSQL**
   ทางกลุ่มใช้ GitHub Copilot ช่วย Auto-complete โค้ด HTML/CSS ของหน้า Dashboard และใช้ Gemini ในการช่วยหาวิธีแก้ Error 500 ตอนที่เชื่อมต่อ PostgreSQL โดย Gemini แนะนำให้เช็ค Type Mismatch ของตัวแปรทศนิยม ซึ่งทางกลุ่มได้นำมาวิเคราะห์และปรับแก้คอลัมน์ใน Database จาก `INTEGER` เป็น `FLOAT` ด้วยตนเอง จนระบบทำงานได้ตามต้องการ

4. **กรณี 3D Garden**
   Claude แนะนำให้ใช้ `useGLTF.preload()` เพื่อโหลดโมเดล `.glb` ล่วงหน้า แต่เมื่อนำมาใช้จริงเกิดปัญหาเรื่อง memory บนเครื่องสเปคต่ำ ทางกลุ่มจึงเลือกให้โหลดแบบ Lazy ผ่าน `<Suspense fallback={null}>` แทน ซึ่งให้ประสบการณ์ใช้งานที่ดีกว่าในเครื่องส่วนใหญ่

5. **กรณีเอกสารและคำแนะนำการรักษาโรคพืช**
   ChatGPT ช่วยร่างคำแนะนำเบื้องต้นใน `ADVICE_MAP` แต่ทางกลุ่มได้ตรวจสอบข้อมูลกับแหล่งอ้างอิงด้านเกษตรไทย (กรมวิชาการเกษตร) และปรับเนื้อหาให้สอดคล้องกับบริบทประเทศไทยก่อนใช้งานจริง

ทุกบรรทัดที่ AI สร้างขึ้นได้ผ่านการอ่าน ทำความเข้าใจ และทดสอบโดยสมาชิกในทีมก่อนถูก commit ลงใน repository ของโครงงาน

---

*เอกสารฉบับนี้จัดทำขึ้นเพื่อประกอบรายวิชา FRA502 Web Programming ภาคการเรียนปลาย ปีการศึกษา 2569*
