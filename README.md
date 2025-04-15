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
js-bson serialize (single) x 16.68 ops/sec ±0.38% (91 runs sampled)
bson-ext serialize (single) x 4.56 ops/sec ±0.69% (61 runs sampled)
JSON stringify (single) x 15.91 ops/sec ±0.66% (89 runs sampled)
js-bson deserialize (single) x 11.40 ops/sec ±1.62% (78 runs sampled)
bson-ext deserialize (single) x 6.09 ops/sec ±1.88% (65 runs sampled)
JSON parse (single) x 20.58 ops/sec ±0.99% (84 runs sampled)

Concurrent Results (on smaller data):
┌──────────────────────┬─────────────┬───────────┬────────────┐
│ (index)              │ totalTimeMs │ opsPerSec │ avgMsPerOp │
├──────────────────────┼─────────────┼───────────┼────────────┤
│ js-bson serialize    │ '3024.55'   │ '165.31'  │ '6.0491'   │
│ bson-ext serialize   │ '9040.81'   │ '55.30'   │ '18.0816'  │
│ JSON stringify       │ '3330.16'   │ '150.14'  │ '6.6603'   │
│ js-bson deserialize  │ '5015.78'   │ '99.69'   │ '10.0316'  │
│ bson-ext deserialize │ '6961.02'   │ '71.83'   │ '13.9220'  │
│ JSON parse           │ '3076.71'   │ '162.51'  │ '6.1534'   │
└──────────────────────┴─────────────┴───────────┴────────────┘
```