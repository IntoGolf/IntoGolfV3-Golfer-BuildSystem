<template>
  <q-page class="q-pa-sm">
    <q-pull-to-refresh @refresh="onRefresh">
      <div class="row q-mb-sm" style="font-size: 24px; font-weight: bold">
        <div class="col-9">Chats</div>
        <div class="col-3 justify-end text-right">
          <q-btn
            color="primary"
            flat
            icon="add"
            round
            size="small"
            v-on:click="$emit('handleNew')"
          />
        </div>
      </div>
      <q-list bordered separator>
        <chat-list-item
          v-for="(item, key) in $store.state.chats.chats"
          :key="key"
          :item="item"
        />
      </q-list>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import ChatListItem from "components/chats/chatListItem.vue";

export default {
  components: { ChatListItem },
  methods: {
    onRefresh(done) {
      console.log("go");
      this.$store.dispatch("chats/fetchChats").then(() => {
        done();
      });
    },
  },
};
</script>
