/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals"
  ],
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/.eslintrc.cjs",
    ".next",
    "dist",
    "pnpm-lock.yaml",
    "apps/**", // Ignore apps directory to focus on main build
  ],
};