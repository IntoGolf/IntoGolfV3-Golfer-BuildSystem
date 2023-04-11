<template>
    <q-layout id="q-app">
        <router-view/>
    </q-layout>
</template>

<script>
import {defineComponent} from "vue";
import {setCssVar} from "quasar";
export default defineComponent({
    name: "App",
    created() {
        let settings = this.$ls.getItem('settings').value;
        if (settings) {
            setCssVar('primary', settings.app_primary_color);
            setCssVar('primary_font', settings.app_primary_font_color);
            setCssVar('secondary', settings.app_secondary_color);
            setCssVar('secondary_font', settings.app_secondary_font_color);
        }
    }
});
</script>
