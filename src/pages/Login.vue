<template>

    <q-page-container>

        <div class="row cordova-hide fixed-bottom">
            <q-btn v-if="canSignIn" label="Inschrijven" v-on:click="$router.push('sign-up')" color="secondary" flat/>
            <q-btn v-if="canBookPublic" label="Starttijd boeken" v-on:click="$router.push('teetimes')" color="primary"
                   flat/>
        </div>

        <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">

            <q-card-section>

                <div class="row q-mt-sm">
                    <div class="col text-center">
                        <img
                                src="../assets/images/logo-black.svg"
                                class="logo"
                                alt="logo"/>
                    </div>
                </div>

                <div class="row q-mt-md q-mb-md">
                    <div class="col text-center text-h5">
                        Login met uw account
                    </div>
                </div>

                <q-input
                        filled
                        v-model="form.relEmail"
                        label="Uw e-mailadres"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || 'Voer aub uw e-mailadres in']"/>

                <q-input
                        :type="isPwd ? 'password' : 'text'"
                        filled
                        v-model="form.repPassword"
                        label="Uw wachtwoord"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || 'Voer aub uw e-wachtwoord in']">
                    <template v-slot:append>
                        <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>

                <div class="text-center">
                    <q-btn label="Inloggen" v-on:click="onlogin" color="primary"/>
                    <q-btn label="Wachtwoord vergeten" v-on:click="onResetPassword" color="primary" flat
                           class="q-mt-md"/>
                </div>

            </q-card-section>

        </q-card>

    </q-page-container>

</template>

<script>

import {setCssVar} from "quasar";

export default {
    name: "Login",
    data: function () {
        return {
            form: {
                relEmail: "",
                repPassword: "",
                repKey: ""
            },
            isPwd: true,
            settings: []
        };
    },
    mounted() {
        let that = this;
        this.$http.get(`golfer/psettings`).then((settings) => {
            that.settings = settings;
            setCssVar('primary', settings.app_primary_color);
            setCssVar('primary_font', settings.app_primary_font_color);
            setCssVar('secondary', settings.app_secondary_color);
            setCssVar('secondary_font', settings.app_secondary_font_color);
        });

        if (this.$route.query.key) {
            this.form.repKey = this.$route.query.key;
            this.onlogin();
        }
    },
    computed: {
        canSignIn: function () {
            return parseInt(this.settings.website_display_register_button) === 1;
        },
        canBookPublic: function () {
            return parseInt(this.settings.website_display_teetime_public) === 1;
        }

    },
    methods: {
        onResetPassword: function () {
            this.$router.push("verify-code");
        },
        onSignup: function () {
            this.$router.push("sign-up");
        },
        async onlogin() {
            this.$q.loading.show();

            await this.$recaptchaLoaded();

            const token = await this.$recaptcha('login');

            this.form.captcha = token

            this.$http.post("golfer/login", this.form)
                .then((res) => {
                    if (res) {
                        this.$ls.setItem('authorization', res.relation_password.apiToken, 1000 * 60 * 60 * 24 * 7);
                        this.$ls.setItem('currentUser', res, 1000 * 60 * 60 * 24 * 7);

                        if (this.$ls.getItem('currentUserPref').value == null) {

                            let currentUserPref = {
                                matchList: {
                                    subFilter: 0
                                }
                            }
                            this.$ls.setItem('currentUserPref', currentUserPref, 1000 * 60 * 60 * 24 * 7);
                        }

                        let that = this;
                        this.$http.get(`golfer/settings`).then((settings) => {
                            that.$ls.setItem('settings', settings, 1000 * 60 * 60 * 24 * 7);
                            console.log(settings);
                            setCssVar('primary', settings.app_primary_color);
                            setCssVar('primary_font', settings.app_primary_font_color);
                            setCssVar('secondary', settings.app_secondary_color);
                            setCssVar('secondary_font', settings.app_secondary_font_color);

                            this.$q.loading.hide();
                            this.$router.push("/");

                        });

                    }
                })
                .catch((e) => {
                    this.$message.error(e);
                });
        },
    },
};
</script>
