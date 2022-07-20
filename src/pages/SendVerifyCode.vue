<template>
  <div class="page-verify-code">
    <div class="container my-4">
      <div class="bt-row justify-content-center">
        <div class="col-lg-7 col-md-9 col-xl-5">
          <div class="card-body box-border rounded bg-white">
            <div class="form-group mb-4">
              <div class="text-center">
                <img src="../assets/images/logo-black.svg" alt="logo" />
                <h3 class="page-title mb-2">Forgot your password?</h3>
                <p class="sub-title">Recover the password for your account</p>
              </div>
            </div>
            <div class="form-group">
              <el-form :model="form" ref="form">
                <el-form-item
                  prop="email"
                  label="Email address"
                  :rules="[
                    {
                      required: true,
                      message: 'Please enter email address',
                      trigger: 'blur',
                    },
                    {
                      type: 'email',
                      message: 'Please enter the correct email address',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input
                    v-model="form.email"
                    placeholder="Enter email address"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-group bt-row mb-3 mt-4">
              <div class="col-md-12 mt-2">
                <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  @click="onSendCode('form')"
                >
                  <span>Send code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          :title="
            receiveCodeVisible ? 'Didn\'t receive a code?' : 'Check your email'
          "
          width="40%"
          v-model:propname="verifyCodeDialogVisible"
          @closed="receiveCodeVisible = false"
        >
          <div class="text-center mb-3">
            <span v-if="!receiveCodeVisible"
              >To reset your password, enter the code you received from us by
              e-mail.</span
            >
            <span v-else>We've sent a new code to your email address.</span>
          </div>
          <div class="bt-row m-auto">
            <el-input
              v-model="form.verifyCode"
              oninput="if(value.length>4)value=value.slice(0,4)"
            ></el-input>
          </div>
          <div class="m-auto pt-4">
            <button
              type="button"
              class="w-100 btn btn-primary"
              @click="onVerifyCode"
              :disabled="form.verifyCode.length < 4"
            >
              Verify code
            </button>
          </div>
          <!--
          <div class="text-center mt-3">
            <a href="#" @click="onReceiveCode">Didn't receive a code?</a>
          </div>
          -->
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      form: {
        email: "",
        verifyCode: "",
      },
      verifyCodeDialogVisible: false,
      receiveCodeVisible: false,
    };
  },
  methods: {
    onVerifyCode() {
      this.$http
        .post("golfer/public/auth/check-verify-code", this.form)
        .then(() => {
          this.$router.push({
            query: {
              verifyCode: this.form.verifyCode,
            },
            path: "/reset/password",
          });
        })
        .catch(() => {
          this.$message.error(`Check verify code failed!`);
        });
    },
    onReceiveCode() {
      this.$message("TODO");
    },
    onSendCode(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("golfer/public/auth/send-email-verify-code", this.form)
            .then(() => {
              this.verifyCodeDialogVisible = true;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../css/_variables";

.page-verify-code {
  .card-body {
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  }
}
</style>
