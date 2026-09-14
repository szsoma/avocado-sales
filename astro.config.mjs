// @ts-check
import { defineConfig } from 'astro/config';

// Avocado writes its own generated config beside this one when it opens the
// project; this is the config `astro build` uses on a machine that has never
// seen Avocado, which is the whole point.
export default defineConfig({});
