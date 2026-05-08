export enum Sex {
  Male = "m",
  Female = "f",
}


export enum Constants{
  CALORIES_PER_KG_FAT_GAIN = 9000
}

const HARRIS_BENEDICT_MALE_BASE = 66.47;
const HARRIS_BENEDICT_MALE_WEIGHT_FACTOR = 13.7;
const HARRIS_BENEDICT_MALE_HEIGHT_FACTOR = 5.003;
const HARRIS_BENEDICT_MALE_AGE_FACTOR = 6.75;

const HARRIS_BENEDICT_FEMALE_BASE = 655.1;
const HARRIS_BENEDICT_FEMALE_WEIGHT_FACTOR = 9.563;
const HARRIS_BENEDICT_FEMALE_HEIGHT_FACTOR = 1.85;
const HARRIS_BENEDICT_FEMALE_AGE_FACTOR = 4.676;

type BmrStrategy = (
  currentWeightKg: number,
  heightM: number,
  ageY: number,
) => number;

const calcMaleBmr: BmrStrategy = (currentWeightKg, heightM, ageY) =>
  Math.ceil(
    HARRIS_BENEDICT_MALE_BASE +
      HARRIS_BENEDICT_MALE_WEIGHT_FACTOR * currentWeightKg +
      HARRIS_BENEDICT_MALE_HEIGHT_FACTOR * heightM * 100.0 -
      HARRIS_BENEDICT_MALE_AGE_FACTOR * ageY,
  );

const calcFemaleBmr: BmrStrategy = (currentWeightKg, heightM, ageY) =>
  Math.ceil(
    HARRIS_BENEDICT_FEMALE_BASE +
      HARRIS_BENEDICT_FEMALE_WEIGHT_FACTOR * currentWeightKg +
      HARRIS_BENEDICT_FEMALE_HEIGHT_FACTOR * heightM * 100.0 -
      HARRIS_BENEDICT_FEMALE_AGE_FACTOR * ageY,
  );

const bmrStrategyBySex: Record<Sex, BmrStrategy> = {
  [Sex.Male]: calcMaleBmr,
  [Sex.Female]: calcFemaleBmr,
};

type FoodItem = {
  name: string;
  calories: number;
  servings: number;
};

const foods: FoodItem[] = [
  { name: "Kellogg's Tresor", calories: 137, servings: 4 },
  { name: "Weihenstephan Haltbare Milch", calories: 64, servings: 8 },
  { name: "Mühle Frikadellen", calories: 271, servings: 4 },
  { name: "Volvic Tee", calories: 40, servings: 12 },
  { name: "Neuburger lockerer Sahnepudding", calories: 297, servings: 1 },
  { name: "Lagnese Viennetta", calories: 125, servings: 6 },
  { name: "Schöller 10ForTwo", calories: 482, servings: 2 },
  { name: "Ristorante Pizza Salame", calories: 835, servings: 2 },
  { name: "Schweppes Ginger Ale", calories: 37, servings: 25 },
  { name: "Mini Babybel", calories: 59, servings: 20 },
];

export function calcDateOnDiet(
  currentWeightKg: number,
  targetWeightKg: number,
  heightM: number,
  ageY: number,
  sex: Sex,
): number {
  const weightGainKg = targetWeightKg - currentWeightKg;
  if (weightGainKg < 0) {
    throw new Error(`This diet is for gaining weight, not losing it!`);
  }
  if (ageY < 16 || heightM < 1.5) {
    throw new Error(`You do not qualify for this kind of diet.`);
  }
  let dailyCaloriesOnDiet = 0;
  for (const food of foods) {
    dailyCaloriesOnDiet += food.calories * food.servings;
  }
  const dailyBMR = bmrStrategyBySex[sex](currentWeightKg, heightM, ageY);
  const dailyExcessCalories =
    dailyCaloriesOnDiet - dailyBMR;
  if (dailyExcessCalories <= 0) {
    throw new Error("This diet is not sufficient for you to gain weight.");
  }
  return Math.ceil((Constants.CALORIES_PER_KG_FAT_GAIN * weightGainKg) / dailyExcessCalories);
}
