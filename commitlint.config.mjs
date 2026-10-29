const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Adds the roadmap's "content" type for real text, images and posts.
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "style",
        "refactor",
        "test",
        "docs",
        "chore",
        "ci",
        "perf",
        "content",
      ],
    ],
  },
};

export default config;
