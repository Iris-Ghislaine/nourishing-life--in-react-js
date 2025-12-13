export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  profileImage?: string;
  createdAt: Date;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  didYouKnow: string[];
}

export interface Meal {
  id: string;
  diseaseId: string;
  category: MealCategory;
  name: string;
  description: string;
  image: string;
  preparationSteps: string[];
  nutrients: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  benefits: string[];
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'drinks' | 'vitamins';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Rating {
  id: string;
  userId: string;
  rating: number;
  message: string;
  createdAt: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  medicineReminder: boolean;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'medicine' | 'meal' | 'general';
  isRead: boolean;
  createdAt: Date;
}

export interface UserSettings {
  darkMode: boolean;
  notifications: NotificationSettings;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  rating: number;
  status: 'pending' | 'replied';
  adminReply?: string;
  createdAt: Date;
  repliedAt?: Date;
}
