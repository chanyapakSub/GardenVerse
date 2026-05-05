export const zones = [
  {
    id: "zone-a",
    name: "โซน A : ไม้ดอกเมืองหนาว",
    icon: "leaf",
    isOpen: true,
    plants: [
      { id: "p1", name: "แปลงทิวลิป", color: "text-red-500", icon: "flower", active: true },
      { id: "p2", name: "แปลงกุหลาบ", color: "text-pink-500", icon: "flower" },
      { id: "p3", name: "แปลงลาเวนเดอร์", color: "text-purple-500", icon: "flower" },
      { id: "p4", name: "แปลงเบญจมาศ", color: "text-yellow-500", icon: "flower" },
    ],
  },
  {
    id: "zone-b",
    name: "โซน B : สมุนไพร",
    icon: "leaf",
    isOpen: true,
    plants: [
      { id: "p5", name: "แปลงโหระพา", color: "text-green-500", icon: "leaf" },
      { id: "p6", name: "แปลงโรสแมรี่", color: "text-yellow-400", icon: "sun" },
      { id: "p7", name: "แปลงมิ้นท์", color: "text-green-400", icon: "leaf" },
    ],
  },
  {
    id: "zone-c",
    name: "โซน C : ผักสวนครัว",
    icon: "leaf",
    isOpen: true,
    plants: [
      { id: "p8", name: "แปลงมะเขือเทศ", color: "text-red-600", icon: "circle" },
      { id: "p9", name: "แปลงพริกหวาน", color: "text-green-600", icon: "circle" },
      { id: "p10", name: "แปลงผักสลัด", color: "text-green-300", icon: "circle" },
    ],
  },
];

export const myPlants = [
  { id: "p1", name: "ทิวลิป", active: true, img: "/images/flower/Tilip.png" },
  { id: "p2", name: "กุหลาบ", img: "/images/flower/Rose.png" },
  { id: "p3", name: "ลาเวนเดอร์", img: "/images/flower/Lavender.png" },
  { id: "p4", name: "มะเขือเทศ", img: "/images/vegetable/Tomato.png" },
  { id: "p5", name: "ทานตะวัน", img: "/images/flower/Tantawan.png" },
  { id: "p6", name: "ไฮเดรนเยีย", img: "/images/flower/Haidenyia.png" },
];
