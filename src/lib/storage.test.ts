import test from "node:test";
import assert from "node:assert/strict";
import { filterResources } from "./storage";
import { SEED_RESOURCES } from "../constants";

test("filterResources returns all resources when query is empty and category is 'all'", () => {
  const result = filterResources(SEED_RESOURCES, "", "all");
  assert.equal(result.length, SEED_RESOURCES.length);
});

test("filterResources filters by category accurately", () => {
  const darslikResult = filterResources(SEED_RESOURCES, "", "darslik");
  assert.ok(darslikResult.length > 0);
  assert.ok(darslikResult.every((r) => r.category === "darslik"));
});

test("filterResources filters by search query across title, author, and description", () => {
  const fizikaResult = filterResources(SEED_RESOURCES, "Fizika", "all");
  assert.equal(fizikaResult.length, 1);
  assert.equal(fizikaResult[0].id, "seed-2");
});
