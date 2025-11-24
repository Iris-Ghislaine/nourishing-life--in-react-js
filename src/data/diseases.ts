import type { Disease } from '../types';

export const diseases: Disease[] = [
  {
    id: 'cancer',
    name: 'Cancer',
    description: 'Nutritional support for cancer patients',
    icon: '🎗️',
    color: 'from-pink-500 to-rose-600',
    didYouKnow: [
      'A diet rich in fruits and vegetables can help reduce cancer risk by up to 20%',
      'Green leafy vegetables contain compounds that may help fight cancer cells',
      'Cruciferous vegetables like broccoli have powerful anti-cancer properties',
      'Antioxidants in colorful fruits help protect cells from damage',
    ],
  },
  {
    id: 'diabetes',
    name: 'Diabetes',
    description: 'Blood sugar-friendly meal plans',
    icon: '🩸',
    color: 'from-blue-500 to-cyan-600',
    didYouKnow: [
      'Fiber-rich foods help regulate blood sugar levels',
      'Small, frequent meals can maintain stable glucose levels',
      'Whole grains are better than refined grains for diabetes management',
    ],
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    description: 'Heart-healthy, low-sodium meals',
    icon: '❤️',
    color: 'from-red-500 to-pink-600',
    didYouKnow: [
      'Reducing sodium intake can lower blood pressure significantly',
      'Potassium-rich foods help balance sodium levels',
      'The DASH diet is scientifically proven to reduce hypertension',
    ],
  },
];
