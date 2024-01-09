<template>
  <q-item
    v-ripple
    clickable
    v-on:click="$store.dispatch('chats/set', { chat: item, edit: false })"
  >
    <q-item-section avatar>
      <q-avatar color="blue" icon="group" text-color="white" />
    </q-item-section>
    <q-item-section>
      <div class="row" style="height: 24px">
        <div class="col-6">
          <b>{{ item.chtName }}</b>
        </div>
        <div class="col-6 text-right">
          {{ item.lastMessageTime }}
        </div>
      </div>
      <div class="row">
        {{ item.lastMessageText }}
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>
