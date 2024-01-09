<template>
  <q-item clickable v-on:click="handleCancel">
    <q-item-section>
      <q-item-label>
        <b>{{ item.uni_res_item.uimName }}</b>
      </q-item-label>
      <q-item-label caption>
        artikel:
        {{
          item.uni_res_item_price.uipName + " " + $filters.money(item.uniAmount)
        }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon name="remove" />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    item: Object,
    flight: Object,
  },
  methods: {
    handleCancel() {
      this.$q
        .dialog({
          title: "Bevestiging verwijderen huurartikel",
          message:
            "Je staat op het punt dit huurartikel uit je reservering te verwijderen. Weet je zeker dat je wilt doorgaan?",
          cancel: true,
        })
        .onOk(() => {
          this.setCancel();
        });
    },
    async setCancel() {
      const res = await this.$http.delete("golfer/flight/rent", {
        params: this.item,
      });
      this.$emit("handleRefresh");
    },
  },
};
</script>
