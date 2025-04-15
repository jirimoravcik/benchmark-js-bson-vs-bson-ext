# benchmark-js-bson-vs-bson-ext
This repository contains a benchmark of npm packages `bson` and `bson-ext`.


## How to run
```
npm i
npm start
```

## Results on a M3 Max Macbook Pro

Running it on a M3 Max gives the following results:
```
js-bson serialize (single) x 16.14 ops/sec ±0.36% (90 runs sampled)
bson-ext serialize (single) x 4.83 ops/sec ±0.54% (62 runs sampled)
js-bson deserialize (single) x 11.34 ops/sec ±1.70% (78 runs sampled)
bson-ext deserialize (single) x 6.30 ops/sec ±1.45% (65 runs sampled)

Concurrent Results (on smaller data):
┌──────────────────────┬─────────────┬───────────┬────────────┐
│ (index)              │ totalTimeMs │ opsPerSec │ avgMsPerOp │
├──────────────────────┼─────────────┼───────────┼────────────┤
│ js-bson serialize    │ '3130.65'   │ '159.71'  │ '6.2613'   │
│ bson-ext serialize   │ '8926.39'   │ '56.01'   │ '17.8528'  │
│ js-bson deserialize  │ '5341.08'   │ '93.61'   │ '10.6822'  │
│ bson-ext deserialize │ '7470.52'   │ '66.93'   │ '14.9410'  │
└──────────────────────┴─────────────┴───────────┴────────────┘
```