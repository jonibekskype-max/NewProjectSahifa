import type { Category, Resource, User } from "./types";

export const CATEGORIES: Category[] = [
  { id: "badiiy", label: "Badiiy kitoblar" },
  { id: "darslik", label: "Darsliklar" },
  { id: "maqola", label: "Ilmiy maqolalar" },
  { id: "test", label: "Testlar va qo'llanmalar" },
];

export const SUBJECTS = [
  "Fizika",
  "Matematika",
  "Adabiyot",
  "Ingliz tili",
  "Kimyo",
  "Biologiya",
  "Tarix",
  "Informatika",
];

export const MOCK_USERS: User[] = [
  { id: "sohibjon", name: "Sohibjon" },
  { id: "jonibek", name: "Jonibek" },
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: "seed-1",
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    category: "badiiy",
    description:
      "O'zbek adabiyotining durdona asari. XX asr boshidagi milliy ozodlik harakati fonida yozilgan tarixiy roman.",
    link: "https://example.com/utkan-kunlar.pdf",
    createdAt: Date.now() - 100000,
    addedBy: "sohibjon",
    downloads: 12,
  },
  {
    id: "seed-2",
    title: "Fizika darsligi — 9-sinf",
    author: "O'zbekiston Respublikasi Ta'lim vazirligi",
    category: "darslik",
    description:
      "Maktab o'quvchilari uchun mo'ljallangan to'liq fizika darsligi. Mexanika, elektr va optika bo'limlari.",
    link: "https://example.com/fizika-9.pdf",
    createdAt: Date.now() - 90000,
    addedBy: "jonibek",
    downloads: 8,
  },
  {
    id: "seed-3",
    title: "Algebra va matematik analiz asoslari",
    author: "M. A. Mirzaahmedov",
    category: "darslik",
    description:
      "Yuqori sinflar va abituriyentlar uchun algebra bo'yicha qo'llanma. Misollar va yechimlar bilan.",
    link: "https://example.com/algebra.pdf",
    createdAt: Date.now() - 80000,
    addedBy: "sohibjon",
    downloads: 15,
  },
  {
    id: "seed-4",
    title: "Ingliz tili grammatikasi — B1 daraja",
    author: "British Council",
    category: "test",
    description:
      "O'rta darajadagi ingliz tili grammatikasi bo'yicha testlar to'plami. Javoblari bilan birga.",
    link: "https://example.com/english-b1.pdf",
    createdAt: Date.now() - 70000,
    addedBy: "jonibek",
    downloads: 19,
  },
  {
    id: "seed-5",
    title: "O'zbek adabiyoti tarixi",
    author: "Professor N. Mallayev",
    category: "maqola",
    description:
      "O'zbek adabiyotining shakllanishi va rivojlanishi haqida ilmiy maqola. Manba va iqtiboslar bilan.",
    link: "https://example.com/adabiyot-tarixi.pdf",
    createdAt: Date.now() - 60000,
    addedBy: "sohibjon",
    downloads: 6,
  },
  {
    id: "seed-6",
    title: "Kimyodan tayyorgarlik testlari",
    author: "A. Usmonov",
    category: "test",
    description:
      "Abituriyentlar uchun kimyo fanidan DT tayyorgarlik testlari. 500 dan ortiq savollar.",
    link: "https://example.com/kimyo-test.pdf",
    createdAt: Date.now() - 50000,
    addedBy: "jonibek",
    downloads: 11,
  },
  {
    id: "seed-7",
    title: "Mehrobxon",
    author: "Oybek",
    category: "badiiy",
    description:
      "Ikkinchi jahon urushi yillaridagi o'zbek xalqining hayoti haqida roman. Psixologik va tarixiy asar.",
    link: "https://example.com/mehrobxon.pdf",
    createdAt: Date.now() - 40000,
    addedBy: "sohibjon",
    downloads: 9,
  },
  {
    id: "seed-8",
    title: "Biologiya — Umumiy va molekulyar",
    author: "T. Q. To'raxo'jayev",
    category: "darslik",
    description:
      "Hujayra biologiyasi, genetika va molekulyar biologiya asoslari bo'yicha to'liq darslik.",
    link: "https://example.com/biologiya.pdf",
    createdAt: Date.now() - 30000,
    addedBy: "jonibek",
    downloads: 7,
  },
  {
    id: "seed-9",
    title: "Iqtisodiyot asoslari — maqolalar to'plami",
    author: "Toshkent Davlat Iqtisodiyot Universiteti",
    category: "maqola",
    description:
      "Bozor iqtisodiyoti, makro va mikro iqtisodiyot bo'yicha ilmiy maqolalar to'plami.",
    link: "https://example.com/iqtisod.pdf",
    createdAt: Date.now() - 20000,
    addedBy: "sohibjon",
    downloads: 5,
  },
  {
    id: "seed-10",
    title: "Informatika dasturlash asoslari — Python",
    author: "B. R. Yusupov",
    category: "darslik",
    description:
      "Python dasturlash tilidan boshlang'ich kurs. Amaliy misollar va loyihalar bilan.",
    link: "https://example.com/python.pdf",
    createdAt: Date.now() - 10000,
    addedBy: "jonibek",
    downloads: 21,
  },
  {
    id: "seed-11",
    title: "Tarix — O'zbekiston mustaqilligi yo'lida",
    author: "Akademik M. S. Yo'ldoshev",
    category: "maqola",
    description:
      "Mustaqillik davri tarixi va siyosiy jarayonlar haqida ilmiy maqola.",
    link: "https://example.com/tarix.pdf",
    createdAt: Date.now() - 5000,
    addedBy: "sohibjon",
    downloads: 4,
  },
  {
    id: "seed-12",
    title: "Matematika DT tayyorgarlik qo'llanmasi",
    author: "A. T. Yo'ldoshev",
    category: "test",
    description:
      "Matematika fanidan DT ga tayyorgarlik ko'rish uchun to'liq qo'llanma. Variantlar va javoblar.",
    link: "https://example.com/mat-dt.pdf",
    createdAt: Date.now(),
    addedBy: "jonibek",
    downloads: 14,
  },
];
