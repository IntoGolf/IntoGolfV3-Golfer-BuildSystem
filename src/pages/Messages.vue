<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <q-card v-if="items.length === 0" class="my-card full-width q-mt-md">
        <q-card-section class="text-center">
          <div class="text-h5">Geen berichten</div>
          <div class="text-subtitle1">
            er zijn momenteel geen berichten gevonden
          </div>
        </q-card-section>
      </q-card>
      <q-card v-for="(item, index) in items" :key="index" class="q-mb-md">
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h6">{{ item.msgTitle }}</div>
              <div class="text-subtitle2">
                {{ $dayjs(item.msgFrom, "DD-MM-YYYY").format("DD-MM-YYYY") }}
              </div>
            </div>

            <div v-show="item.message_opened === null" class="col-auto q-pt-sm">
              <q-btn
                color="white"
                size="sm"
                text-color="black"
                v-on:click="handleSetMessage(item)"
              >
                gelezen
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-html="item.msgText" />
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      no_messages: "Er zijn op dit moment geen berichten",
    };
  },
  computed: {
    ...mapGetters("messages", ["items"]),
  },
  mounted() {
    this.fetchMessages();
  },
  methods: {
    ...mapActions("messages", ["fetchMessages", "setMessage"]),
    handleSetMessage: function (item) {
      this.setMessage(item);
    },
  },
};
</script>
