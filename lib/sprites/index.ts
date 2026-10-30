import { defineSprite } from "./grid";
import { items } from "./items";

export const cloud = defineSprite([
  "........KKKK............",
  ".......KWWWWK...KKK.....",
  "....KKKWWWWWWK.KWWWK....",
  "...KWWWWWWWWWWKWWWWWK...",
  ".KKWWWWWWWWWWWWWWWWWWKK.",
  "KWWWWWWWWWWWWWWWWWWWWWWK",
  "KWWWWWWWWWWWWWWWWWWWWWWK",
  "KWWLLWWWWWWWWWWWWWLLWWWK",
  "KLLLLLLWWWWWWLLLLLLLLLLK",
  ".KLLLLLLLLLLLLLLLLLLLLK.",
  "..KKKKKKKKKKKKKKKKKKKK..",
]);

// More clouds, so the navigation isn't a row of copies.
// Three even puffs.
export const cloudPuffy = defineSprite([
  "........KKKKKKK........",
  "....KKKKWWWWWWWKKKK....",
  "...KWWWWWWWWWWWWWWWK...",
  "..KWWWWWWWWWWWWWWWWWK..",
  "..KWWWWWWWWWWWWWWWWWK..",
  ".KWWWWWWWWWWWWWWWWWWWK.",
  "KWWWWWWWWWWWWWWWWWWWWWK",
  "KWWWWWWWWWWWWWWWWWWWWWK",
  "KLLLLLLLLLLLLLLLLLLLLLK",
  ".KLLLLLLLLLLLLLLLLLLLK.",
  "..KKKKKKKKKKKKKKKKKKK..",
]);

// Long and low.
export const cloudLong = defineSprite([
  "............KKKKKKK.........",
  "......KKKKKKWWWWWWWKKKKK....",
  ".....KWWWWWWWWWWWWWWWWWWK...",
  "....KWWWWWWWWWWWWWWWWWWWWK..",
  "....KWWWWWWWWWWWWWWWWWWWWK..",
  ".KKKKWWWWWWWWWWWWWWWWWWWWKK.",
  "KWWWWWWWWWWWWWWWWWWWWWWWWWWK",
  "KLLLLLLLLLLLLLLLLLLLLLLLLLLK",
  ".KLLLLLLLLLLLLLLLLLLLLLLLLK.",
  "..KKKKKKKKKKKKKKKKKKKKKKKK..",
]);

// One tall puff in the middle.
export const cloudTall = defineSprite([
  ".......KKKKKKK.......",
  "......KWWWWWWWK......",
  ".....KWWWWWWWWWK.....",
  "....KKWWWWWWWWWKK....",
  "...KWWWWWWWWWWWWWK...",
  "..KWWWWWWWWWWWWWWWK..",
  ".KKWWWWWWWWWWWWWWWKK.",
  "KWWWWWWWWWWWWWWWWWWWK",
  "KWWWWWWWWWWWWWWWWWWWK",
  "KLLLLLLLLLLLLLLLLLLLK",
  ".KLLLLLLLLLLLLLLLLLK.",
  "..KKKKKKKKKKKKKKKKK..",
]);

// Two big puffs, heavier on the left.
export const cloudPair = defineSprite([
  "......KKKKKKK...KKKK.......",
  ".....KWWWWWWWK.KWWWWK......",
  "....KWWWWWWWWWKWWWWWWK.....",
  "....KWWWWWWWWWWWWWWWWWK....",
  "....KWWWWWWWWWWWWWWWWWK....",
  ".KKKKWWWWWWWWWWWWWWWWWKKKK.",
  "KWWWWWWWWWWWWWWWWWWWWWWWWWK",
  "KWWWWWWWWWWWWWWWWWWWWWWWWWK",
  "KLLLLLLLLLLLLLLLLLLLLLLLLLK",
  ".KLLLLLLLLLLLLLLLLLLLLLLLK.",
  "..KKKKKKKKKKKKKKKKKKKKKKK..",
]);

// Curly dark hair, thick eyebrows, a big grin and a sage-green polo with
// backpack straps.
export const avatar = defineSprite([
  "...KK.KKK.KKK...",
  "..KHhKHhhKHhhK..",
  ".KHHhHHHHhHHHhK.",
  "KHhhHHhhHHHhhHHK",
  "KHHHHhHHHhhHHHhK",
  "KHhHHHhHHHHhHHHK",
  "KHHhFHHFhHHFHhHK",
  "KHHFFFFFFFFFFHHK",
  ".KHFKKFFFFKKFHK.",
  ".KFFFFFFFFFFFFK.",
  ".KFFFKFFFFKFFFK.",
  ".KFFFKFFFFKFFFK.",
  ".KFNFFFFFFFFNFK.",
  "..KFFMFFFFMFFK..",
  "..KFFFMMMMFFFK..",
  "...KKFFFFFFKK...",
  "....KKTFFTKK....",
  "..KKQQqFFqQQKK..",
  ".KZZZZZZZZZZZZK.",
  "KQQQQQQQQQQQQQQK",
  "KZZZZZZZZZZZZZZK",
  "KFKQQQQQQQQQQKFK",
  ".KKQQQQQQQQQQKK.",
  "..KJJJJJJJJJJK..",
  "..KJJJIKKJJJIK..",
  "..KJJJIKKJJJIK..",
  "..KooooKKooooK..",
  "..KKKKK..KKKKK..",
]);

export const coin = defineSprite([
  "..KKKK..",
  ".KYYYYK.",
  "KYWYYOYK",
  "KYWYYOYK",
  "KYWYYOYK",
  "KYYYYOYK",
  ".KYOOOK.",
  "..KKKK..",
]);

// A twinkle, for the sky background.
export const spark = defineSprite([
  "...Y...",
  "...Y...",
  "..YWY..",
  "YYWWWYY",
  "..YWY..",
  "...Y...",
  "...Y...",
]);

// Night sky visitors, for the background.
export const squid = defineSprite([
  "....GGG....",
  "..GGGGGGG..",
  ".GGWWGWWGG.",
  ".GGWKGWKGG.",
  "GGGGGGGGGGG",
  "GGG.GGG.GGG",
  ".G..G.G..G.",
  "G...G.G...G",
]);

export const rocket = defineSprite([
  "...R...",
  "..RWR..",
  "..WCW..",
  ".WWCWW.",
  ".WWWWW.",
  "RWWWWWR",
  "R.WWW.R",
  "...O...",
  "..OYO..",
  "...O...",
]);

// LinkedIn-style badge, for the contact link.
export const badge = defineSprite([
  "KKKKKKKKK",
  "KBBBBBBBK",
  "KBWBBBBBK",
  "KBBBWWWBK",
  "KBWBWBWBK",
  "KBWBWBWBK",
  "KBBBBBBBK",
  "KKKKKKKKK",
]);

// Points right. Flip it with CSS to point left.
export const arrow = defineSprite([
  "...K...",
  "...KK..",
  "KKKKKK.",
  "KKKKKKK",
  "KKKKKK.",
  "...KK..",
  "...K...",
]);

// Every sprite, so tests can check them all.
export const sprites = {
  cloud,
  cloudPuffy,
  cloudLong,
  cloudTall,
  cloudPair,
  avatar,
  coin,
  arrow,
  badge,
  spark,
  squid,
  rocket,
  ...items,
};

export type SpriteName = keyof typeof sprites;
export const spriteNames = Object.keys(sprites) as [
  SpriteName,
  ...SpriteName[],
];
