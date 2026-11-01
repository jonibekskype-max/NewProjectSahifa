import test from "node:test";
import assert from "node:assert/strict";
import {
  computeResourceSummary,
  filterResources,
  incrementResourceDownloads,
  sortResources,
  toggleReadResource,
} from "./storage";
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

test("incrementResourceDownloads increments target resource download counter by 1", () => {
  const initial = SEED_RESOURCES[0].downloads;
  const updated = incrementResourceDownloads(SEED_RESOURCES, "seed-1");
  assert.equal(updated[0].downloads, initial + 1);
  assert.equal(updated[1].downloads, SEED_RESOURCES[1].downloads);
});

test("computeResourceSummary calculates books, articles, tests, and total downloads", () => {
  const summary = computeResourceSummary(SEED_RESOURCES);
  assert.equal(summary.badiiy, 2);
  assert.equal(summary.darslik, 4);
  assert.equal(summary.books, 6);
  assert.equal(summary.articles, 3);
  assert.equal(summary.tests, 3);
  assert.equal(summary.totalResources, 12);
  assert.equal(
    summary.totalDownloads,
    SEED_RESOURCES.reduce((acc, r) => acc + r.downloads, 0)
  );
});

test("sortResources sorts by newest first (createdAt descending) and popular first (downloads descending)", () => {
  const byNewest = sortResources(SEED_RESOURCES, "newest");
  assert.equal(byNewest[0].id, "seed-12");
  assert.equal(byNewest[byNewest.length - 1].id, "seed-1");

  const byPopular = sortResources(SEED_RESOURCES, "popular");
  assert.equal(byPopular[0].id, "seed-10"); // 21 downloads
  assert.equal(byPopular[1].id, "seed-4");  // 19 downloads
  assert.ok(byPopular[0].downloads >= byPopular[1].downloads);
});

test("toggleReadResource adds and removes resource IDs from read list", () => {
  const afterAdd = toggleReadResource([], "seed-1");
  assert.deepEqual(afterAdd, ["seed-1"]);
  const afterSecondAdd = toggleReadResource(afterAdd, "seed-2");
  assert.deepEqual(afterSecondAdd, ["seed-1", "seed-2"]);
  const afterRemove = toggleReadResource(afterSecondAdd, "seed-1");
  assert.deepEqual(afterRemove, ["seed-2"]);
});
