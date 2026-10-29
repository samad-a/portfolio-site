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

// Every sprite, so tests can check them all.
export const sprites = { cloud, avatar, coin, ...items };
