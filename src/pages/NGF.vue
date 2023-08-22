<template>
  <q-page-container>
    <q-page>
      <q-img :src="blobUrl" />
    </q-page>
  </q-page-container>
</template>

<script>
export default {
  data: function () {
    return {
      loading: false,
      blobUrl: "",
    };
  },
  created() {
    this.loadCard();
  },
  methods: {
    loadCard() {
      let that = this;
      this.$http
        .get("golfer/user/NgfMembershipCard")
        .then((res) => {
          that.blobUrl = "data:image/png;base64," + res;
        })
        .catch((error) => {
          this.$q.notify({
            message: error,
            type: "negative",
            icon: "announcement",
            actions: [
              {
                label: "Dismiss",
                color: "white",
                handler: () => {
                  /* ... */
                },
              },
            ],
          });
        });
    },
  },
};
</script>
