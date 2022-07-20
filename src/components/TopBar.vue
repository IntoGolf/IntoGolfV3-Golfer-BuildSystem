<template>
  <q-header class="bg-secondary" elevated>
    <div class="row q-pa-xs">
      <div class="col-3 text-left p-0">
        <q-btn flat icon="home" @click="link" />
      </div>

      <div class="col-6 text-center">
        <h6 class="q-ma-none">{{ title }}</h6>
      </div>

      <div class="col-3 text-right"></div>
    </div>
  </q-header>
</template>

<script>
export default {
  props: {
    back_link: String,
    back_icon: String,
    title: String,
    callBack: { type: Function },
  },
  data: function () {
    return {
      backIcon: this.back_icon,
      backLink: this.back_link,
      titleText: this.title,
    };
  },
  name: "TopBar",
  methods: {
    link: function () {
      if (this.callBack == undefined) {
        this.$router.push(this.back_link);
      } else {
        this.callBack();
      }
    },
  },
};
</script>
