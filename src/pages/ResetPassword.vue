<template>
  <div class="page-reset-password">
    <div class="container mt-2 mb-4">
      <div class="bt-row justify-content-center">
        <div class="col-lg-7 col-md-9 col-xl-5">
          <div class="card-body box-border rounded bg-white">
            <div class="form-group mb-4">
              <div class="text-center">
                <img src="../assets/images/logo-black.svg" alt="logo" />
                <h3 class="page-title mb-2">Reset password</h3>
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
                    auto-complete="new-email"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="password"
                  label="Password"
                  :rules="[
                    {
                      required: true,
                      message: 'Please enter the password',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="form.password"
                    placeholder="Enter the password"
                    show-password
                    auto-complete="new-password"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="passwordAgain"
                  label="Confirm Password"
                  :rules="[
                    {
                      required: true,
                      message: 'Please enter your password again',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="form.passwordAgain"
                    placeholder="Enter the password again"
                    show-password
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-group bt-row mb-3 mt-4">
              <div class="col-md-12 mt-2">
                <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  @click="onResetPassword('form')"
                >
                  Reset password
                </button>
              </div>
            </div>
          </div>
        </div>
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
        password: "",
        passwordAgain: "",
        verifyCode: "",
      },
    };
  },
  mounted() {
    this.form.verifyCode = this.$route.query.verifyCode;
  },
  methods: {
    onVerifyCode() {
      this.$router.push("/reset/password");
    },
    onResetPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.password === this.form.passwordAgain) {
            this.$http
              .post("golfer/public/auth/reset-password", this.form)
              .then(() => {
                this.$router.push("/");
                this.$message({
                  message: "Password reset successfully.",
                  type: "success",
                });
              });
          } else {
            this.$message({
              type: "warning",
              message: "Inconsistent password entry!",
            });
          }
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

.page-reset-password {
  .card-body {
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  }
}
</style>
