import { assertGreater, assertThrows } from "@std/assert";
import { calcDateOnDiet, Sex } from "./tanzverbot_diet.ts";

// TODO: write a testcast with help of test data


Deno.test("Tanzverbot Diet", () => {
  assertGreater(calcDateOnDiet(74, 100, 1.86, 38, Sex.Male), 0.0);
});

Deno.test("Tanzverbot Diet - female case", () => {
  const result = calcDateOnDiet(60, 70, 1.65, 25, Sex.Female);
  assertGreater(result, 0.0);
});

Deno.test("Tanzverbot Diet - invalid weight gain throws error", () => {
  assertThrows(() => {
    calcDateOnDiet(80, 70, 1.80, 30, Sex.Male);
  });
});

Deno.test("Tanzverbot Diet - invalid age or height throws error", () => {
  assertThrows(() => {
    calcDateOnDiet(70, 80, 1.40, 30, Sex.Male);
  });
});
