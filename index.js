const crypto = require('node:crypto');

const asyncLib = require('async');
const Benchmark = require('benchmark');
const BSON = require('bson');
const BSONExt = require('bson-ext');


const SINGLE_TEST_MIN_SAMPLES = 50;

// Generate a large array of complex objects
function generateLargeDataset(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: i,
      guid: crypto.randomUUID(),
      timestamp: new Date(),
      name: `User_${i}`,
      email: `user${i}@example.com`,
      isActive: i % 2 === 0,
      score: Math.random() * 100,
      metadata: {
        age: 20 + (i % 50),
        tags: Array.from({ length: 5 }, (_, j) => `tag_${j}_${i}`),
        location: {
          lat: Math.random() * 180 - 90,
          long: Math.random() * 360 - 180,
        },
      },
    });
  }
  return arr;
}

const bigData = { data: generateLargeDataset(50_000) }; // Data above 50k will not fit into the BSON.
const mediumData = { data: generateLargeDataset(5_000) }; // A smaller dataset for concurrent tests due to memory limitations.

// Pre-serialize for deserialization tests
const bufferBigJS = BSON.serialize(bigData);
const bufferBigExt = BSONExt.serialize(bigData);
const bufferMediumJS = BSON.serialize(mediumData);
const bufferMediumExt = BSONExt.serialize(mediumData);

async function runWithConcurrency(fn, total = 500, concurrency = 10) {
    const tasks = Array.from({ length: total }, (_, i) => i);

    const start = process.hrtime.bigint();

    await new Promise((resolve, reject) => {
      asyncLib.mapLimit(
        tasks,
        concurrency,
        async () => await fn(),
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    return {
      totalTimeMs: durationMs.toFixed(2),
      opsPerSec: (total / (durationMs / 1000)).toFixed(2),
      avgMsPerOp: (durationMs / total).toFixed(4),
    };
  }


// Benchmark Suite
const suite = new Benchmark.Suite();

suite
  .add('js-bson serialize (single)', () => {
    BSON.serialize(bigData);
  }, { minSamples: SINGLE_TEST_MIN_SAMPLES }) // Why is this copy-pasted? Setting it at the root level doesn't work
  .add('bson-ext serialize (single)', () => {
    BSONExt.serialize(bigData);
  }, { minSamples: SINGLE_TEST_MIN_SAMPLES }) // Why is this copy-pasted? Setting it at the root level doesn't work
  .add('js-bson deserialize (single)', () => {
    BSON.deserialize(bufferBigJS);
  }, { minSamples: SINGLE_TEST_MIN_SAMPLES }) // Why is this copy-pasted? Setting it at the root level doesn't work
  .add('bson-ext deserialize (single)', () => {
    BSONExt.deserialize(bufferBigExt);
  }, { minSamples: SINGLE_TEST_MIN_SAMPLES }) // Why is this copy-pasted? Setting it at the root level doesn't work
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', async function () {
    const jsSer = await runWithConcurrency(() => BSON.serialize(mediumData));
    const extSer = await runWithConcurrency(() => BSONExt.serialize(mediumData));
    const jsDes = await runWithConcurrency(() => BSON.deserialize(bufferMediumJS));
    const extDes = await runWithConcurrency(() => BSONExt.deserialize(bufferMediumExt));

    console.log('\nConcurrent Results (on smaller data):');
    console.table({
      'js-bson serialize': jsSer,
      'bson-ext serialize': extSer,
      'js-bson deserialize': jsDes,
      'bson-ext deserialize': extDes,
    });
  })
  .run({ async: true });
