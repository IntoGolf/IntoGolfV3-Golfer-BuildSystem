<template>
  <div class="page-upload">
    <div class="text-center mb-2" style="position: relative">
      <el-upload
        :action="getUploadUrl()"
        :before-upload="beforeAvatarUpload"
        :headers="{
          relNr: relNr || 0,
          authorization: 'Bearer ' + apiToken,
        }"
        :on-progress="handleAvatarUploading"
        :on-success="handleAvatarSuccess"
        :show-file-list="false"
        class="avatar-uploader mt-4 mb-2 rounded-circle"
      >
        <img
          v-if="relImage"
          ref="uploadElementIMG"
          :src="relImage"
          class="avatar mt-3"
        />
        <i
          v-else
          ref="uploadElement"
          class="el-icon-plus avatar-uploader-icon"
        ></i>
      </el-upload>
      <el-button chat @click="onTriggerUpload"
        ><i class="far fa-upload"></i>
      </el-button>
      <!--      <div class="btn-rewrite">-->
      <!--        <q-btn round icon="far fa-upload" @click="onTriggerUpload"/>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    uploadUrl: String,
  },
  data() {
    return {
      relNr: this.$store.state.currentUser.item.relNr,
      relImage: this.$store.state.currentUser.item.relImage,
      apiToken: this.$store.state.currentUser.relation_password.apiToken,
      uploading: "",
    };
  },
  methods: {
    getUploadUrl() {
      const baseURL = process.env.VUE_APP_BASE_URL;
      return `${baseURL}` + this.uploadUrl;
    },
    onTriggerUpload() {
      if (this.$refs.uploadElementIMG) {
        this.$refs.uploadElementIMG.click();
        this.$refs.uploadElementIMG.click();
      } else {
        this.$refs.uploadElement.click();
        this.$refs.uploadElement.click();
      }
    },
    handleAvatarUploading() {
      this.uploading = this.$loading({
        lock: true,
        text: "Uploading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      if (res.data && res.data) {
        this.relImage = res.data;
      } else {
        this.relImage = URL.createObjectURL(file.raw);
      }
      this.uploading.close();
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!/\.(?:jpg|jpeg|png)$/.test(file.name)) {
        this.$message({
          type: "error",
          message: "Upload avatars only in JPG, JPEG or PNG format!",
        });
        return false;
      }
      if (!isLt2M) {
        this.$message.error("Upload avatar image size cannot exceed 2MB!!");
        return false;
      }
    },
  },
};
</script>

<style lang="scss">
.btn-rewrite {
  .q-btn__content {
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
