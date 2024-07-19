<template>
  <q-page-container>
    <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">
      <q-card-section>
        <div class="row justify-center q-mt-sm">
          <div class="col-4 text-center">
            <img
              alt="logo"
              class="logo"
              src="../assets/images/logo-black.svg"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <div class="col text-center text-h5">Reset wachtwoord</div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-form
              class="q-gutter-sm"
              @reset="onResetPassword"
              @submit="login($event)"
            >
              <q-input
                v-model="form.email"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Voer aub uw e-mailadres in',
                ]"
                label="Uw E-mailadres"
                lazy-rules
              />

              <q-input
                v-model="form.password"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Voer aub uw gewenste wachtwoord in',
                ]"
                label="Nieuw wachtwoord"
                lazy-rules
                type="password"
              />

              <q-input
                v-model="form.passwordAgain"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Voer aub uw e-wachtwoord in',
                ]"
                label="Bevestig wachtwoord"
                lazy-rules
                type="password"
              />

              <div class="text-center">
                <q-btn
                  color="primary"
                  label="Opslaan"
                  v-on:click="onResetPassword"
                />

                <q-btn
                  color="primary"
                  flat
                  label="Terug naar inloggen"
                  v-on:click="$router.push('/')"
                />
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
    onResetPassword() {
      if (this.form.password === this.form.passwordAgain) {
        this.$http.post("golfer/reset-password", this.form).then(() => {
          this.$router.push("/");
          this.$message({
            message: "Uw wachtwoord is aangepast.",
            type: "success",
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "Wachtwoorden zijn ongelijk!",
        });
      }
    },
  },
};
</script>
