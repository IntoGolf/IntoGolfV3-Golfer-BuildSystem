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
            Reset wachtwoord
          </div>
        </div>

        <div class="row q-mt-md">

          <div class="col">

            <q-form
                @submit="login($event)"
                @reset="onResetPassword"
                class="q-gutter-sm">

              <q-input
                  v-model="form.email"
                  label="Nieuw e-mailadres"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw e-mailadres in']"/>

              <q-input
                  v-model="form.password"
                  label="Nieuw wachtwoord"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw gewenste wachtwoord in']"/>

              <q-input
                  v-model="form.passwordAgain"
                  label="Bevestig wachtwoord"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw e-wachtwoord in']"/>

              <div class="text-center">

                <q-btn
                    label="Opslaan"
                    v-on:click="onResetPassword"
                    color="primary"/>

                <q-btn
                    flat
                    label="Terug naar inloggen"
                    v-on:click="$router.push('/');"
                    color="primary"/>

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
    },
  },
};
</script>
