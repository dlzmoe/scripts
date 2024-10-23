<template></template>

<script>
import packageJson from "../package.json";
export default {
  methods: {},
  created() {
    console.log(
      `%c ${packageJson.name} %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );
  },
};
</script>
