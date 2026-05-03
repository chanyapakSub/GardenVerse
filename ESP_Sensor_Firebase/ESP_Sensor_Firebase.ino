#include <WiFi.h>
#include <FirebaseESP32.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

// ====== ตั้งค่า ======
#define WIFI_SSID       "NNTT24"        // 👈 แก้ตรงนี้
#define WIFI_PASSWORD   "TeraE-01"    // 👈 แก้ตรงนี้
#define DATABASE_URL    "gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app"  // 👈 แก้ตรงนี้ (ไม่ต้องมี https:// และไม่ต้องมี / ปิดท้าย)
#define DATABASE_SECRET "bkzkR7SvF7HqAqXmzFfLhl6lxjCP61pCVLrahQI2"  // 👈 แก้ตรงนี้

// ====== Firebase objects ======
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ====== Mock state ======
float mockTemp = 28.0;     // เริ่มที่ 28°C
float mockHumid = 60.0;    // เริ่มที่ 60%
unsigned long lastSend = 0;
const unsigned long INTERVAL = 5000;  // ส่งทุก 5 วินาที

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));  // seed สำหรับสุ่ม

  // เชื่อม WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());

  // ตั้งค่า Firebase ด้วย legacy token (database secret)
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase ready!");
}

// สุ่มค่าให้ขยับแบบ smooth (random walk)
void updateMockValues() {
  // ขยับทีละ -0.5 ถึง +0.5
  mockTemp  += (random(-50, 51) / 100.0);
  mockHumid += (random(-50, 51) / 100.0);

  // จำกัดช่วงให้สมจริง
  if (mockTemp < 20)  mockTemp = 20;
  if (mockTemp > 40)  mockTemp = 40;
  if (mockHumid < 30) mockHumid = 30;
  if (mockHumid > 90) mockHumid = 90;
}

void loop() {
  if (millis() - lastSend < INTERVAL) return;
  lastSend = millis();

  updateMockValues();

  // ใช้ timestamp จาก Firebase server (ลด clock skew)
  FirebaseJson json;
  json.set("temperature", mockTemp);
  json.set("humidity", mockHumid);
  json.set("timestamp/.sv", "timestamp");  // ให้ Firebase ใส่ epoch ms ให้
  json.set("device_id", "esp32-mock-01");

  // push() = สร้าง key auto-id ใต้ /readings
  if (Firebase.pushJSON(fbdo, "/readings", json)) {
    Serial.printf("✅ Sent: %.2f°C, %.2f%%  key=%s\n",
                  mockTemp, mockHumid, fbdo.pushName().c_str());
  } else {
    Serial.println("❌ Failed: " + fbdo.errorReason());
  }
}