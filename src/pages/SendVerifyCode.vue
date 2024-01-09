<template>
  <q-page-container>
    <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">
      <q-card-section>
        <div class="row q-mt-sm">
          <div class="col text-center">
            <img
              alt="logo"
              class="logo"
              src="../assets/images/logo-black.svg"
            />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-center text-h5">Reset uw wachtwoord</div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-input
              v-model="form.email"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Voer aub uw e-mailadres in',
              ]"
              filled
              label="Uw e-mailadres"
              lazy-rules
            />

            <div class="text-center">
              <q-btn color="primary" label="Verstuur" v-on:click="onSendCode" />

              <q-btn
                class="q-mt-md"
                color="primary"
                flat
                label="Terug naar inloggen"
                v-on:click="$router.push('/')"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="verifyCodeDialogVisible" persistent>
      <q-card style="width: 320px">
        <q-card-section class="row items-center">
          <span class="text-h5 q-mb-md q-mt-none">
            {{
              receiveCodeVisible
                ? "Didn't receive a code?"
                : "Controleer uw e-mail"
            }}
          </span>

          <span v-if="!receiveCodeVisible">
            We hebben u een e-mail gestuurd met een verificatie code. Voer deze
            code hieronden in.
          </span>

          <span v-else> We've sent a new code to your email address. </span>

          <q-input
            v-model="form.verifyCode"
            class="q-ml-auto q-mr-auto"
            oninput="if(value.length>4)value=value.slice(0,4)"
            placeholder="Verificatie code"
            stack-label
          />
        </q-card-section>

        <q-card-section>
          <div class="text-center">
            <q-btn
              :disabled="form.verifyCode.length < 4"
              color="primary"
              icon="close"
              label="Verify code"
              v-on:click="onVerifyCode"
            />

            <q-btn
              class="q-mt-md"
              color="primary"
              flat
              label="Terug naar inloggen"
              v-on:click="$router.push('/')"
            />
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
        .post("golfer/check-code", this.form)
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
      this.$http.post("golfer/send-code", this.form).then(() => {
        this.verifyCodeDialogVisible = true;
      });
    },
  },
};
</script>
