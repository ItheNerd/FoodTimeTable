export interface Main {
  statusCode: number;
  headers: Headers;
  body: Body;
}

export interface Body {
  columns: Column[];
  meals: Meal[];
  timings: Timing[];
  fest: Fest;
}

export interface Column {
  column: string;
  uid: string;
}

export interface Fest {
  date: Date;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface Meal {
  date: Date;
  day: string;
  Breakfast: MealContents;
  Lunch: MealContents;
  Snacks: MealContents;
  Dinner: MealContents;
}

export interface MealContents {
  "Main Dishes": string;
  "SideDishes & Curry": string;
  "Drinks & Dessert": string;
}

export interface Timing {
  day: string;
  "breakfast timings": string;
  "lunch timings": string;
  "snacks timings": string;
  "dinner timings": string;
}

export interface Headers {
  "Content-Type": string;
}
