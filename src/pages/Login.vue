<template>

  <q-page-container>

    <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">

      <q-card-section>

        <div class="row justify-center q-mt-sm">
          <div class="col-4 text-center">
            <img
                src="../assets/images/logo-black.svg"
                class="logo"
                alt="logo"/>
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <div class="col text-center text-h5">
            Login with your account
          </div>
        </div>

        <div class="row q-mt-md">

          <div class="col">

            <q-form
                @submit="login($event)"
                @reset="onReserPassword"
                class="q-gutter-sm">

              <q-input
                  filled
                  v-model="form.relEmail"
                  label="Uw e-mailadres"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw e-mailadres in']"/>

              <q-input
                  filled
                  v-model="form.repPassword"
                  label="Uw wachtwoord"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw e-wachtwoord in']"/>

              <div>
                <q-btn label="Inloggen" type="submit" color="primary"/>
                <q-btn label="Wachtwoord vergeten" type="reset" color="primary" flat class="q-ml-sm"/>
              </div>

            </q-form>

          </div>
        </div>

      </q-card-section>

    </q-card>

  </q-page-container>

</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>

<script>
// @ is an alias to /src

export default {
  name: "Login",
  data: function () {
    return {
      form: {
        relEmail: "",
        repPassword: "",
      },
      passwordShow: false,
    };
  },
  methods: {
    onResetPassword() {
      this.$router.push("verify/code");
    },
    onSignup() {
      this.$router.push("sign-up");
    },
    login() {
      this.$q.loading.show();
      this.$http
          .post("golfer/auth/login", this.form)
          .then((res) => {
            if (res) {
              this.$ls.setItem('authorization', res.relation_password.apiToken, 1000 * 60 * 60 * 24 * 7);
              this.$ls.setItem('currentUser', res, 1000 * 60 * 60 * 24 * 7);
              this.$q.loading.hide();
              this.$router.push("/");
            }
          })
          .catch((e) => {
            this.$message.error(e);
          });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../css/_variables";

.home {
  .logo {
    width: 4rem;
  }

  .card-body {
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);

    .input-password {
      height: 2rem;
    }
  }

  .divider-line {
    .rectangle {
      width: 37%;
      height: 1px;
      background-color: #d2ddef;
      vertical-align: center;
    }
  }

  .form-login {
    .input-append-icon {
      position: relative;

      .container-icon {
        position: absolute;
        top: 45px;
        right: 10px;
      }
    }
  }
}
</style>
