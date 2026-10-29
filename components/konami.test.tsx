import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { konamiCode, konamiEvent } from "@/lib/konami";
import { Konami } from "./konami";

function press(keys: readonly string[], target: Element = document.body) {
  for (const key of keys) fireEvent.keyDown(target, { key });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Konami", () => {
  it("shows a message and fires the event when the code is entered", () => {
    const listener = vi.fn();
    addEventListener(konamiEvent, listener);
    render(<Konami />);

    press(konamiCode);

    expect(screen.getByRole("status")).toHaveTextContent(
      "+1000 · secret found!",
    );
    expect(listener).toHaveBeenCalledTimes(1);
    removeEventListener(konamiEvent, listener);
  });

  it("hides the message after a few seconds", () => {
    vi.useFakeTimers();
    render(<Konami />);

    press(konamiCode);
    act(() => vi.advanceTimersByTime(3000));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("ignores keys typed into a form field", () => {
    render(
      <>
        <Konami />
        <input aria-label="message" />
      </>,
    );

    press(konamiCode, screen.getByLabelText("message"));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("does nothing for an incomplete code", () => {
    render(<Konami />);

    press(konamiCode.slice(0, 9));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
