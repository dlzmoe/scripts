<template>
  <div class="lobewebdav">
    <a aria-label="webdav" @click="opendialog" href="javascript:void(0)">
      <div
        style="border-radius: 8px; height: 44px; width: 44px"
        class="layoutkit-flexbox css-5wokcq acss-1rzhzi1"
      >
        <span class="anticon acss-17q14cp" role="img">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-brand-webflow"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 10s-1.376 3.606 -1.5 4c-.046 -.4 -1.5 -8 -1.5 -8c-2.627 0 -3.766 1.562 -4.5 3.5c0 0 -1.843 4.593 -2 5c-.013 -.368 -.5 -4.5 -.5 -4.5c-.15 -2.371 -2.211 -3.98 -4 -3.98l2 12.98c2.745 -.013 4.72 -1.562 5.5 -3.5c0 0 1.44 -4.3 1.5 -4.5c.013 .18 1 8 1 8c2.758 0 4.694 -1.626 5.5 -3.5l3.5 -9.5c-2.732 0 -4.253 2.055 -5 4z"
            />
          </svg>
        </span>
      </div>
    </a>
    <div class="lobewebdav-dialog" v-show="open">
      <div class="close" @click="this.open = false">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </div>
      <h2>同步 Lobechat 数据到 WebDav</h2>
      <div class="item">
        <label>WebDav 地址：</label>
        <input type="text" v-model="webdav.baseurl" placeholder="https://xxx.com/dav/" />
      </div>
      <div class="item">
        <label>WebDav 用户名：</label>
        <input type="text" v-model="webdav.username" />
      </div>
      <div class="item">
        <label>WebDav 密码：</label>
        <input type="password" v-model="webdav.password" />
      </div>
      <div class="item">
        <button @click="savewebdav">保存密码</button>
      </div>
      <div class="item">
        <button @click="uploadSampleFile">同步到云端</button>
        <button @click="downloadSampleFile">下载到本地</button>
      </div>
      <div class="item">
        <div class="msg">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import packageJson from "../package.json";
export default {
  data() {
    return {
      open: false,
      exportData: {},
      importData: {},
      webdav: {
        baseurl: "",
        username: "",
        password: "",
      },
      msg: "",
    };
  },
  methods: {
    // 打开弹窗
    opendialog() {
      this.open = !this.open;
    },
    // 保存密码
    savewebdav() {
      localStorage.setItem("lobechat-webdav", JSON.stringify(this.webdav));
    },
    // 获取 lobechat 数据生成 json
    getIndexedDB() {
      const dbName = "LOBE_CHAT_DB";
      const storeNames = ["messages", "sessionGroups", "sessions", "topics"];

      let request = indexedDB.open(dbName);

      request.onsuccess = (event) => {
        const db = event.target.result;
        let state = {
          messages: [],
          sessionGroups: [],
          sessions: [],
          topics: [],
        };

        let pendingStores = 0;

        storeNames.forEach((storeName) => {
          if (db.objectStoreNames.contains(storeName)) {
            pendingStores++;
            const transaction = db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const allRecords = objectStore.getAll();

            allRecords.onsuccess = (event) => {
              const result = event.target.result;
              state[storeName] = result;
              pendingStores--;

              if (pendingStores === 0) {
                this.exportData = JSON.stringify({
                  exportType: "all",
                  state: state,
                  version: 7,
                });
              }
            };

            allRecords.onerror = (event) => {
              console.error(`Error fetching data from ${storeName}:`, event);
            };
          } else {
            console.warn(`Object store ${storeName} not found in database ${dbName}`);
          }
        });

        if (pendingStores === 0) {
          console.log("No valid object stores found in the database.");
        }
      };

      request.onerror = (event) => {
        console.error("Error opening database:", event);
      };
    },

    // 检查文件夹是否存在
    checkFolderExists(folderUrl) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "PROPFIND",
          url: folderUrl,
          headers: {
            Authorization:
              "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`),
            Depth: "1", // 只检查一层
          },
          onload: function (response) {
            if (response.status === 207) {
              // Multi-Status
              resolve(true);
            } else if (response.status === 404) {
              resolve(false);
            } else {
              reject(new Error(`Error checking folder: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 创建文件夹
    createFolder(folderUrl) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "MKCOL",
          url: folderUrl,
          headers: {
            Authorization:
              "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`),
          },
          onload: function (response) {
            if (response.status === 201) {
              // Created
              resolve(true);
            } else {
              reject(new Error(`Error creating folder: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 检查并创建文件夹
    async checkAndCreateFolder() {
      this.getIndexedDB();
      const folderUrl = `${this.webdav.baseurl}lobechat-webdav-backup/`;

      try {
        const exists = await this.checkFolderExists(folderUrl);
        if (!exists) {
          await this.createFolder(folderUrl);
          console.log("Folder 'lobechat-webdav-backup' created successfully.");
        } else {
          console.log("Folder 'lobechat-webdav-backup' already exists.");
        }

        const data = this.exportData;

        if (!data) {
          console.error("Export data is not initialized properly.");
          return;
        }

        const uploadUrl = `${this.webdav.baseurl}lobechat-webdav-backup/data.json`;

        try {
          const uploadResponse = await this.uploadFile(uploadUrl, data);
          this.msg = "同步到云端成功！";
        } catch (error) {
          console.error("Upload failed:", error);
          this.msg = "同步失败！";
        }
      } catch (error) {
        console.error(error);
      }
    },

    uploadFile(url, fileData) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "PUT",
          url: url,
          data: fileData,
          headers: {
            "Content-Type": "text/plain",
            Authorization:
              "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`),
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response);
            } else {
              reject(new Error(`Upload failed: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    downloadFile(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: {
            Authorization:
              "Basic " + btoa(`${this.webdav.username}:${this.webdav.password}`),
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.responseText);
            } else {
              reject(new Error(`Download failed: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },
    // 上传
    async uploadSampleFile() {
      this.checkAndCreateFolder();
    },
    // 下载
    async downloadSampleFile() {
      const downloadUrl = `${this.webdav.baseurl}lobechat-webdav-backup/data.json`;

      try {
        const downloadResponse = await this.downloadFile(downloadUrl);
        const importData = JSON.parse(downloadResponse);
        console.log(importData);
        // localStorage.setItem("lobechat_webdav_backup_importData", importData);
        this.msg = "下载成功，即将同步数据，请勿操作页面！";

        // 覆盖云端数据到本地 indexedDB 中
        // 数据库名称和对象存储名称
        const dbName = "LOBE_CHAT_DB";
        const storeNames = ["messages", "sessionGroups", "sessions", "topics"]; // 不包括 'settings'

        // 打开数据库连接
        let request = indexedDB.open(dbName);

        request.onsuccess = function (event) {
          const db = event.target.result;
          // const lobechat_webdav_backup_importData = JSON.parse(
          //   localStorage.getItem("lobechat_webdav_backup_importData")
          // );
          const state = importData.state; //  从 importData 获取 state 数据
          console.log(importData);

          // 遍历所有对象存储并更新数据
          storeNames.forEach((storeName) => {
            if (db.objectStoreNames.contains(storeName)) {
              const transaction = db.transaction([storeName], "readwrite");
              const objectStore = transaction.objectStore(storeName);

              // 清空当前对象存储
              const clearRequest = objectStore.clear();
              clearRequest.onsuccess = function () {
                console.log(`${storeName} store cleared.`);

                // 添加新的数据
                const data = state[storeName];
                if (Array.isArray(data)) {
                  data.forEach((item) => {
                    const addRequest = objectStore.add(item);
                    addRequest.onsuccess = function () {
                      console.log(`Item added to ${storeName} store.`);
                    };
                    addRequest.onerror = function (event) {
                      console.error(`Error adding item to ${storeName}:`, event);
                    };
                  });
                  setTimeout(() => {
                    this.msg = "同步完成，请手动刷新页面！";
                  }, 1000);
                }
              };

              clearRequest.onerror = function (event) {
                console.error(`Error clearing ${storeName} store:`, event);
              };
            } else {
              console.warn(`Object store ${storeName} not found in database ${dbName}`);
            }
          });
        };

        request.onerror = function (event) {
          console.error("Error opening database:", event);
        };
      } catch (error) {
        console.error(error);
        this.msg = "下载失败，请检查是否存在备份！";
      }
    },
  },
  created() {
    const lobechat_webdav = JSON.parse(localStorage.getItem("lobechat-webdav"));

    if (lobechat_webdav) {
      this.webdav = lobechat_webdav;
    }

    console.log(
      `%c ${packageJson.name} %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );
  },
};
</script>
