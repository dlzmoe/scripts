<template>
  <div id="webdavBtn">
    <button
      class="button_icon-button__VwAMf undefined button_shadow__G4m_0 clickable undefined"
      role="button"
      aria-label="ChatGPT"
    >
      <div class="button_icon-button-icon__AMZta false">上传到云端</div>
    </button>

    <button
      class="button_icon-button__VwAMf undefined button_shadow__G4m_0 clickable undefined"
      role="button"
      aria-label="ChatGPT"
    >
      <div class="button_icon-button-icon__AMZta false">同步到本地</div>
    </button>
  </div>
</template>

<script>
import packageJson from "../package.json";
export default {
  methods: {
    addWebdavBtn() {},
  },
  created() {
    console.log(
      `%c ${packageJson.name} %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );

    this.addWebdavBtn();
  },
};
</script>
