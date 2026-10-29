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

export const avatar = defineSprite([
  "...KKKKKK...",
  "..KHHHHHHK..",
  ".KHHHHHHHHK.",
  ".KHSSSSSSHK.",
  ".KSSKSSKSSK.",
  ".KSSSSSSSSK.",
  "..KSSMMSSK..",
  "...KKSSKK...",
  "..KBBBBBBK..",
  ".KBBBYYBBBK.",
  ".KSBBBBBBSK.",
  ".KSBBBBBBSK.",
  "..KPPKKPPK..",
  "..KKK..KKK..",
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
  avatar,
  coin,
  arrow,
  badge,
  spark,
  ...items,
};

export type SpriteName = keyof typeof sprites;
export const spriteNames = Object.keys(sprites) as [
  SpriteName,
  ...SpriteName[],
];
