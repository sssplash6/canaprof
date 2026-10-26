// factor: rough mid-career professional pay relative to the US, at market exchange rates.
// intake: accepted as a student's home country (the form no longer asks; the server assumes Uzbekistan); salary: shown in the income simulator.
export const COUNTRIES = {
  uz: { ru: 'Узбекистан', en: 'Uzbekistan', factor: 0.14, intake: true, salary: true },
  kz: { ru: 'Казахстан', en: 'Kazakhstan', factor: 0.22, intake: true, salary: true },
  ru: { ru: 'Россия', en: 'Russia', factor: 0.3, intake: true, salary: true },
  kg: { ru: 'Кыргызстан', en: 'Kyrgyzstan', factor: 0.11, intake: true },
  tj: { ru: 'Таджикистан', en: 'Tajikistan', factor: 0.09, intake: true },
  tm: { ru: 'Туркменистан', en: 'Turkmenistan', factor: 0.1, intake: true },
  us: { ru: 'США', en: 'USA', factor: 1, salary: true },
  ca: { ru: 'Канада', en: 'Canada', factor: 0.72, salary: true },
  gb: { ru: 'Великобритания', en: 'United Kingdom', factor: 0.66, salary: true },
  de: { ru: 'Германия', en: 'Germany', factor: 0.65, salary: true },
  sg: { ru: 'Сингапур', en: 'Singapore', factor: 0.7, salary: true },
  ae: { ru: 'ОАЭ', en: 'UAE', factor: 0.6, salary: true },
  tr: { ru: 'Турция', en: 'Turkey', factor: 0.24, salary: true },
  other: { ru: 'Другая страна', en: 'Another country', factor: null, intake: true },
};

export const GRADES = ['7', '8', '9', '10', '11'];
// Every grade is split into the same four classes, written "10 Медицинский".
export const TRACKS = ['eng', 'econ', 'intl', 'med'];
