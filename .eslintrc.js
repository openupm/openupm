module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
