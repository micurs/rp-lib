import * as basic from './basic.ts';
import * as smap from './switch-map-01.ts';
import * as cmap from './concat-map.ts';
import * as debounce from './debounce-demo.ts';
import * as throttle from './throttle-demo.ts';

import * as sigBasic from './signals-basic.ts';
import * as sigChained from './signals-chained.ts';
import * as sigComputed from './signals-computed.ts';
import * as sigMultiSource from './signals-multi-source.ts';

// Observable demos

await basic.main();
await smap.main();
await cmap.main();
await debounce.main();
await throttle.main();

// Signals demos

await sigBasic.main();
await sigChained.main();
await sigComputed.main();
await sigMultiSource.main();
