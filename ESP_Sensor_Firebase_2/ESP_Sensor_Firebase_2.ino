#include <WiFi.h>
#include <FirebaseESP32.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"
#include <BH1750.h>

// ====== ตั้งค่า ======
#define WIFI_SSID       "Nano"        // 👈 แก้ตรงนี้
#define WIFI_PASSWORD   "nano40890"    // 👈 แก้ตรงนี้
#define DATABASE_URL    "gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app"  // 👈 แก้ตรงนี้ (ไม่ต้องมี https:// และไม่ต้องมี / ปิดท้าย)
#define DATABASE_SECRET "bkzkR7SvF7HqAqXmzFfLhl6lxjCP61pCVLrahQI2"  // 👈 แก้ตรงนี้

// ====== Firebase objects ======
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ====== Sensor objects ======
Adafruit_SHT31 sht31 = Adafruit_SHT31();
BH1750 lightMeter(0x23);

// ====== Sensor state ======
float lastLux = 0.0;       // เก็บค่าล่าสุดของ BH1750
unsigned long lastSend = 0;
const unsigned long INTERVAL = 5000;  // ส่งทุก 5 วินาที

void setup() {
  Serial.begin(115200);

  // เชื่อม WiFi (ESP32-C3 Super Mini: ลด TX power แก้ปัญหา antenna)
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  WiFi.setTxPower(WIFI_POWER_8_5dBm);

  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
  Serial.printf("RSSI: %d dBm\n", WiFi.RSSI());

  // ตั้งค่า Firebase ด้วย legacy token (database secret)
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase ready!");

  // ====== Init sensors ======
  if (!sht31.begin(0x44)) {   // SHT3x default address 0x44 (alt 0x45)
    Serial.println("Could not find a valid SHT3X sensor, check wiring!");
    while (1);
  }

  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println(F("BH1750 Advanced begin"));
  } else {
    Serial.println(F("Error initialising BH1750"));
  }
}

void loop() {
  // อ่าน BH1750 ทุกครั้งที่ค่าพร้อม (ไม่ผูกกับ INTERVAL เพื่อให้ค่าสดเสมอ)
  if (lightMeter.measurementReady()) {
    lastLux = lightMeter.readLightLevel();
  }

  if (millis() - lastSend < INTERVAL) return;
  lastSend = millis();

  // อ่าน SHT3X
  float temperature = sht31.readTemperature();
  float humidity = sht31.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from SHT3X :(");
    return;
  }

  float lux = lastLux;

  // ใช้ timestamp จาก Firebase server (ลด clock skew)
  FirebaseJson json;
  json.set("temperature", temperature);
  json.set("humidity", humidity);
  json.set("lux", lux);
  json.set("timestamp/.sv", "timestamp");  // ให้ Firebase ใส่ epoch ms ให้
  json.set("device_id", "esp32-sensor-02");

  // push() = สร้าง key auto-id ใต้ /readings
  if (Firebase.pushJSON(fbdo, "/readings", json)) {
    Serial.printf("✅ Sent: %.2f°C, %.2f%%, %.2f lx  key=%s\n",
                  temperature, humidity, lux, fbdo.pushName().c_str());
  } else {
    Serial.println("❌ Failed: " + fbdo.errorReason());
  }
}
