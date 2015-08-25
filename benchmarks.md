Benchmarks
==========

As mentioned in the [readme](readme.md), wrapped methods are roughly from 6 times to 400 times slower, but the good part is that they're fast enough for most cases anyway. In any case, you can judge by yourself.

The numbers under the "Native" and "Wrapped" columns are the times the methods get executed in a second, respectively in their native and wrapped versions. The "Times slower" column is nothing more than the ratio between those values, showing how many times the wrapped version is slower than its native counterpart.

## Desktop/server

Test platforms:
* node.js, Edge, IE and Firefox on Windows 10 64 bit (Intel Core i7-4702, 2.2 GHz, 8 GB RAM)

### Firefox 42

| Method  | Native      | Wrapped   | Times slower |
|:--------|------------:|----------:|-------------:|
| push    | 25417829.66 | 543275.63 |        46.79 |
| pop     |  7860866.30 | 677851.76 |        11.60 |
| unshift | 14044179.39 | 510869.77 |        27.49 |
| shift   |  6914513.50 | 655179.43 |        10.55 |
| splice  |  2995672.07 | 497946.07 |         6.02 |

### Edge 20

| Method  | Native      | Wrapped   | Times slower |
|:--------|------------:|----------:|-------------:|
| push    | 54767474.31 | 224397.80 |       244.06 |
| pop     | 17836266.04 | 319777.57 |        55.78 |
| unshift | 42150329.96 | 287599.60 |       146.56 |
| shift   | 22004442.66 | 308611.56 |        71.30 |
| splice  |  7153927.19 | 154216.82 |        46.39 |

### Internet Explorer 11

| Method  | Native      | Wrapped   | Times slower |
|:--------|------------:|----------:|-------------:|
| push    | 67207010.31 | 153079.86 |       439.03 |
| pop     | 19568671.29 | 226766.50 |        86.29 |
| unshift | 61131116.39 | 153108.35 |       399.27 |
| shift   | 32824464.61 | 266664.56 |       123.09 |
| splice  |  7139044.25 | 127588.32 |        55.95 |

### Node.js 0.10.40

| Method  | Native      | Wrapped   | Times slower |
|:--------|------------:|----------:|-------------:|
| push    | 45629360.74 | 344638.00 |       132.40 |
| pop     | 48703376.85 | 351396.30 |       138.60 |
| unshift | 35820837.05 | 337823.47 |       106.03 |
| shift   | 19675249.29 | 338654.35 |        58.10 |
| splice  | 10476493.27 | 327468.59 |        31.99 |


## Mobile

Test platforms:
* Firefox 40 on Samsung Galaxy Note 3 with Android 5.0 (Qualcomm Snapdragon 800, quad core, 2.3 GHz, 3 GB RAM)
* Safari 8 on iPhone 5 with iOS 8.4 (Apple A6, dual core, 1.3 GHz, 1 GB RAM)

### Firefox 40

| Method  | Native     | Wrapped  | Times slower |
|:--------|-----------:|---------:|-------------:|
| push    | 6693456.04 | 39537.94 |       169.29 |
| pop     | 3198455.25 | 28403.75 |       112.61 |
| unshift | 4958252.73 | 37789.83 |       131.21 |
| shift   | 1562613.21 | 15324.80 |       101.97 |
| splice  |  927863.70 | 32838.00 |        28.26 |

### Safari 8

| Method  | Native      | Wrapped   | Times slower |
|:--------|------------:|----------:|-------------:|
| push    |  5368891.57 | 133325.58 |        40.27 |
| pop     | 39911211.76 | 229963.86 |       173.55 |
| unshift |  5833209.88 | 129235.29 |        45.14 |
| shift   |  2396270.59 | 144764.71 |        16.55 |
| splice  |  1824675.32 | 107976.19 |        16.90 |
