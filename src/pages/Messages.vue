<template>

  <q-page-container class="q-pa-md">

    <q-card
        v-if="list.length == 0">

      <q-card-section
          class="text-center text-h6">
        {{ no_messages }}
      </q-card-section>

    </q-card>

    <div v-else>

      <q-card
          class="q-mb-md q-mt-md"
          v-for="(item, index) in unreadMessages"
          :key="index">

        <q-card-section>

          <div class="row">

            <div class="col">
              <div class="text-h6">{{ item.msgTitle }}</div>
              <div class="text-subtitle2">{{ $dayjs(item.msgFrom).format("DD-MM-YYYY") }}</div>
            </div>

            <div
                v-show="item.message_opened == null"
                class="col-auto q-pt-sm">
              <q-btn
                  v-on:click="setMessagesOpened(item)"
                  color="white"
                  text-color="black"
                  size="sm">
                gelezen
              </q-btn>
            </div>

          </div>

        </q-card-section>

        <q-separator/>

        <q-card-section v-html="item.msgText"/>

      </q-card>

      <div
          v-show="readMessages.length > 0"
          class="text-h6 q-mb-md q-mt-md">
        Gelezen berichten
      </div>

      <q-card
          class="q-mb-md"
          v-for="(item, index) in readMessages"
          :key="index">

        <q-card-section>

          <div class="row">

            <div class="col">
              <div class="text-h6">{{ item.msgTitle }}</div>
              <div class="text-subtitle2">{{ $dayjs(item.msgFrom).format("DD-MM-YYYY") }}</div>
            </div>

            <div
                v-show="item.message_opened == null"
                class="col-auto q-pt-sm">
              <q-btn
                  v-on:click="setMessagesOpened(item)"
                  color="white"
                  text-color="black"
                  size="sm">
                gelezen
              </q-btn>
            </div>

          </div>

        </q-card-section>

        <q-separator/>

        <q-card-section v-html="item.msgText"/>

      </q-card>

    </div>

  </q-page-container>

</template>

<script>

export default {
  data() {
    return {
      listUrl: "golfer/messages",
      openedUrl: "golfer/message",
      no_messages: "Er zijn op dit moment geen berichten",
      list: [],
    };
  },
  computed: {
    unreadMessages: function() {
      return this.list.filter(message => message.message_opened == null);
    },
    readMessages: function() {
      return this.list.filter(message => message.message_opened != null);
    }
  },
  created() {
    this.loadList();
  },
  methods: {
    loadList: function() {
      let that = this;
      this.$http.get(this.listUrl).then((res) => {
        that.list = res;
      });
    },
    setMessagesOpened(item) {
        this.$http.post(this.openedUrl, item).then(() => {
          this.loadList();
        });
    }
  },
};
</script>
