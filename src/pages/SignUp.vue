<template>
  <div class="page-signup mb-3">
    <div class="container">
      <div
        class="row box-show border rounded bg-white pb-3 flex-column col-md-8 col-lg-7 m-auto"
      >
        <div class="form-group mb-4 pt-5">
          <div class="text-center">
            <img src="../assets/images/logo-black.svg" alt="logo" />
            <h3 class="page-title mb-2">Create an account</h3>
            <p class="sub-title m-0">
              Please fill in your credentials and details to create an account.
            </p>
            <p class="sub-title m-0">All fields with an * are mandatory.</p>
          </div>
        </div>

        <el-form
          ref="account_form"
          :model="account_form"
          :rules="rules"
          v-loading="loading"
        >
          <div class="d-flex justify-content-between">
            <el-form-item :label="$t('Initials')" prop="relFirstName">
              <el-input
                v-model="account_form.relFirstName"
                placeholder="Your initials"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('First name')"
              class="flex-grow-1"
              prop="relCallName"
            >
              <el-input
                v-model="account_form.relCallName"
                placeholder="Your first name"
              ></el-input>
            </el-form-item>
          </div>

          <div class="d-flex justify-content-between">
            <el-form-item :label="$t('Prefix')">
              <el-input
                v-model="account_form.relPrefix"
                placeholder="Your prefix"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('Last name')"
              class="flex-grow-1"
              prop="relName"
            >
              <el-input
                v-model="account_form.relName"
                placeholder="Your last name"
              ></el-input>
            </el-form-item>
          </div>

          <div class="d-flex justify-content-between">
            <el-form-item
              :label="$t('Phone number')"
              label-position="top"
              class="el-country-select flex-grow-1"
            >
              <el-input v-model="account_form.relPhone">
                <el-select
                  v-model="account_form.phone_empPreferLang"
                  placeholder=""
                >
                  <el-option value="nl" label="NL(+31)" class="mb-1">
                    <span class="country-flag"
                      ><img src="../assets/images/nl.png" alt="" class="mr-2"
                    /></span>
                    <span class="label">Netherlands (+31)</span>
                  </el-option>
                  <el-option value="en" label="EN(+44)">
                    <span class="country-flag"
                      ><img src="../assets/images/gb.png" alt="" class="mr-2"
                    /></span>
                    <span class="label">Great Brittain (+44)</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item
              :label="$t('Mobile phone number')"
              label-position="top"
              class="el-country-select flex-grow-1"
            >
              <el-input v-model="account_form.relPhoneMobile">
                <el-select
                  v-model="account_form.mobile_empPreferLang"
                  placeholder=""
                >
                  <el-option value="nl" label="NL(+31)" class="mb-1">
                    <span class="country-flag"
                      ><img src="../assets/images/nl.png" alt="" class="mr-2"
                    /></span>
                    <span class="label">Netherlands (+31)</span>
                  </el-option>
                  <el-option value="en" label="EN(+44)">
                    <span class="country-flag mb-1"
                      ><img src="../assets/images/gb.png" alt="" class="mr-2"
                    /></span>
                    <span class="label">Great Brittain (+44)</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>

          <div class="d-flex justify-content-between">
            <el-form-item :label="$t('NGF-number')" class="flex-grow-1">
              <el-input
                v-model="account_form.relGolferId"
                placeholder="Your NGF-number"
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('Playing HCP')" class="flex-grow-1">
              <el-input
                v-model="account_form.relHandicap"
                placeholder="Your playing HCP"
              ></el-input>
            </el-form-item>
          </div>

          <el-form-item :label="$t('Email')" prop="relEmail" required>
            <div class="input-append-icon">
              <el-input
                v-model="account_form.relEmail"
                name="relEmail"
                type="email"
                :disabled="inviteVisible"
                autocomplete="off"
                placeholder="Your account email"
              ></el-input>
              <span
                :class="
                  inviteVisible === true ? 'd-inline tip-invite' : 'd-none'
                "
                >You are invited via this email address therefore you can't
                change it</span
              >
            </div>
          </el-form-item>

          <el-form-item :label="$t('Soort account')" prop="relGrpNr1" required>
            <el-select
              v-model="account_form.relGrpNr1"
              name="relGrpNr1"
              class="w-100"
            >
              <el-option
                v-for="item in relationGroups"
                :key="item.grpNr"
                :label="item.grpName"
                :value="item.grpNr"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Password')" prop="repPassword" required>
            <div class="input-append-icon">
              <el-input
                v-model="account_form.repPassword"
                :type="passwordShow ? 'text' : 'password'"
                name="password"
                autocomplete="off"
                placeholder="Your account password"
              ></el-input>
              <span class="container-icon pointer">
                <i
                  v-if="!passwordShow"
                  @click="passwordShow = true"
                  class="far fa-eye"
                ></i>
                <i
                  v-else
                  @click="passwordShow = false"
                  class="far fa-eye-slash"
                ></i>
              </span>
            </div>
          </el-form-item>

          <el-form-item
            :label="$t('Confirm your password')"
            prop="confirmRepPassword"
            required
          >
            <div class="input-append-icon">
              <el-input
                v-model="account_form.confirmRepPassword"
                :type="passwordShow_2 ? 'text' : 'password'"
                name="password"
                autocomplete="off"
                placeholder="Your password again"
              ></el-input>
              <span class="container-icon pointer">
                <i
                  v-if="!passwordShow_2"
                  @click="passwordShow_2 = true"
                  class="far fa-eye"
                ></i>
                <i
                  v-else
                  @click="passwordShow_2 = false"
                  class="far fa-eye-slash"
                ></i>
              </span>
            </div>
          </el-form-item>
          <el-button
            type="primary"
            @click="onCreateAccount('account_form')"
            class="g-recaptcha d-block w-100 border rounded text-white mt-4"
            ><i aria-hidden="true" class="far fa-user-plus mr-2"></i>Create your
            account!
          </el-button>

          <button
            type="button"
            @click="onHome"
            class="btn btn-white btn-block border rounded border-primary text-primary text-weight mt-4"
          >
            <i aria-hidden="true" class="far fa-user-edit mr-2"></i>Back
          </button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { VueReCaptcha } from "vue-recaptcha-v3";

Vue.use(VueReCaptcha, { siteKey: "6Ld49AsbAAAAAGmQmEyOWeypfUrEaAAUreRv6o9G" });

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else if (value.length < 6) {
        callback(new Error("Password length must be at least 6"));
      } else if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
        callback(new Error("Must contain letters and numbers"));
      } else {
        if (this.account_form.repPassword !== "") {
          // this.$refs.ruleForm.validateField('password');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.account_form.repPassword) {
        callback(new Error("The password is inconsistent!"));
      } else {
        callback();
      }
    };
    return {
      inviteVisible: false,
      loading: false,
      passwordShow: false,
      passwordShow_2: false,
      relationGroups: [],
      account_form: {
        relFirstName: "",
        relCallName: "",
        relPrefix: "",
        relName: "",
        relEmail: "",
        relPhone: "",
        mobile_empPreferLang: "",
        phone_empPreferLang: "",
        relPhoneMobile: "",
        relGolferId: "",
        relHandicap: "",
        repPassword: "",
        confirmRepPassword: "",
        relGrpNr1: null,
      },
      rules: {
        relEmail: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "blur",
          },
        ],
        relFirstName: [
          {
            required: true,
            message: "Please enter your initials",
            trigger: "blur",
          },
        ],
        relCallName: [
          {
            required: true,
            message: "Please enter your first name",
            trigger: "blur",
          },
        ],
        relName: [
          {
            required: true,
            message: "Please enter your last name",
            trigger: "blur",
          },
        ],
        repPassword: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        confirmRepPassword: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  beforeMount() {},
  created: function () {
    let that = this;

    if (JSON.stringify(this.$route.query).indexOf("email") !== -1) {
      this.account_form.relEmail = this.$route.query.email;
      this.inviteVisible = true;
    }

    this.$http.get(`golfer/public/relation-groups/get`).then((res) => {
      that.relationGroups = res;
      this.account_form.relGrpNr1 = that.relationGroups[0].grpNr;
      console.log(that.relationGroups);
    });
  },
  methods: {
    onBlur(e) {
      if (e.target.value) {
        this.$http.get("check-email/" + e.target.value).then((res) => {
          if (res.data === 1) {
            this.$message({
              message: "This email address has been registered!",
              type: "warning",
            });
          }
        });
      }
    },
    onHome() {
      this.$router.push("/");
    },
    async onCreateAccount(formName) {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded();
      // Execute reCAPTCHA with action "login".
      const token = await this.$recaptcha("login");
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /* eslint-disable no-undef */
          // Add your logic to submit to your backend server here.
          // that.$http.post(`golfer/public/reCaptcha/verify`, {
          //   token
          // })
          //     .then(res => {
          //       // recaptcha verify success
          //       if (res.success) {
          that.loading = true;
          that.$http
            .post(`golfer/public/auth/sign-up`, that.account_form)
            .then((signUp) => {
              that.loading = false;
              that.$message.success(signUp.message);
              that.$router.push("/");
            });
          that.loading = false;
          //   } else {
          //     that.loading = false;
          //   }
          // })
          // .catch(() => {
          //   this.loading = false;
          // });
        } else {
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "../css/_variables";

.page-signup {
  .el-form-item {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .input-append-icon {
    position: relative;

    .container-icon {
      position: absolute;
      top: 40px;
      right: 10px;

      .far {
        color: $sub-title;
      }
    }
  }

  .tip-invite {
    color: $red;
    font-size: 0.8rem;
  }

  .el-form-item__label {
    font-size: 0.7rem;
  }
}
</style>
