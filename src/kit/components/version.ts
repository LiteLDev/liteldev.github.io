// The kit version (keep in sync with ../VERSION; static/build-static.mjs and the tests check it).
export const KIT_VERSION = '2.32.0';
/**
 * A build stamp after the version in <meta name="generator">; 'dev' adds none. Unused since the kit is part of
 * levimc.org's source (it was the content hash of the kit levimc.org published for the sites built elsewhere).
 */
export const KIT_BUILD: string = 'dev';
/** Value of <meta name="generator"> on every page the kit renders, so deployments are verifiable. */
export const KIT_GENERATOR = `levimc-kit ${KIT_VERSION}${KIT_BUILD === 'dev' ? '' : `+${KIT_BUILD}`}`;
export const GENERATOR_META = `<meta name="generator" content="${KIT_GENERATOR}">`;
