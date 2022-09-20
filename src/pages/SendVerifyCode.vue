<template>

    <q-page-container>

      <q-card
          class="my-card q-ml-auto q-mr-auto q-mt-xl">

        <q-card-section>

          <div class="row q-mt-sm">
            <div class="col text-center">
              <img
                  src="../assets/images/logo-black.svg"
                  class="logo"
                  alt="logo"/>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col text-center text-h5">
              Reset uw wachtwoord
            </div>
          </div>

          <div class="row q-mt-md">

            <div class="col">

              <q-input
                  filled
                  v-model="form.email"
                  label="Uw e-mailadres"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Voer aub uw e-mailadres in']"/>

              <div class="text-center">

                <q-btn
                    label="Verstuur"
                    v-on:click="onSendCode"
                    color="primary"/>

                <q-btn
                    flat
                    class="q-mt-md"
                    label="Terug naar inloggen"
                    v-on:click="$router.push('/');"
                    color="primary"/>

              </div>

            </div>

          </div>

        </q-card-section>

      </q-card>

      <q-dialog
          v-model="verifyCodeDialogVisible"
          persistent>

        <q-card style="width: 320px">

          <q-card-section class="row items-center">

            <span class="text-h5 q-mb-md q-mt-none">
              {{ receiveCodeVisible ? 'Didn\'t receive a code?' : 'Controleer uw e-mail' }}
            </span>

            <span v-if="!receiveCodeVisible">
              We hebben u een e-mail gestuurd met een verificatie code. Voer deze code hieronden in.
            </span>

            <span v-else>
              We've sent a new code to your email address.
            </span>

            <q-input
                class="q-ml-auto q-mr-auto"
                stack-label
                placeholder="Verificatie code"
                v-model="form.verifyCode"
                oninput="if(value.length>4)value=value.slice(0,4)"/>

          </q-card-section>

          <q-card-section>

            <div class="text-center">

              <q-btn
                  label="Verify code"
                  icon="close"
                  color="primary"
                  v-on:click="onVerifyCode"
                  :disabled="form.verifyCode.length < 4"/>

              <q-btn
                  class="q-mt-md"
                  flat
                  label="Terug naar inloggen"
                  v-on:click="$router.push('/');"
                  color="primary"/>

            </div>


          </q-card-section>
        </q-card>

      </q-dialog>

    </q-page-container>

</template>

<script>
export default {
  data: function () {
    return {
      form: {
        email: "laurens@intogolf.nl",
        verifyCode: "",
      },
      verifyCodeDialogVisible: false,
      receiveCodeVisible: false,
    };
  },
  methods: {
    onVerifyCode() {
      this.$http.post("golfer/public/auth/check-verify-code", this.form)
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
    onSendCode() {
      this.$http.post("golfer/send-email-verify-code", this.form)
          .then(() => {
            this.verifyCodeDialogVisible = true;
          });
    },
  },
};
</script>
