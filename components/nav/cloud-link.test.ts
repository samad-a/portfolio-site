import { describe, expect, it } from "vitest";
import {
  cloud,
  cloudLong,
  cloudPair,
  cloudPuffy,
  cloudTall,
} from "@/lib/sprites";
import { labelPosition } from "./cloud-link";

describe("labelPosition", () => {
  it.each(
    Object.entries({ cloud, cloudLong, cloudPair, cloudPuffy, cloudTall }),
  )("puts %s's label on its body", (_name, grid) => {
    const position = labelPosition(grid);
    const row = Math.floor(position * grid.length);
    const width = grid[0].length;

    expect(position).toBeGreaterThan(0.45);
    expect(position).toBeLessThan(0.7);
    // The label's middle sits on a row the cloud's fill spans most of.
    expect(grid[row].replace(/[.K]/g, "").length).toBeGreaterThanOrEqual(
      width * 0.6,
    );
  });
});
