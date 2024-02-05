<template>
  <q-page class="q-pa-sm">
    <q-pull-to-refresh @refresh="refreshList">
      <q-list>
        <q-item
          v-for="(match, index) in list"
          v-bind:key="index"
          v-ripple
          class="w-100 bg-white border rounded shadow-1 q-mb-sm"
          clickable
          v-on:click="$emit('handleOpenMatch', match)"
        >
          <q-item-section>
            <q-item-label class="overflow-hidden">
              <i class="far fa-trophy-alt mr-2" />
              {{ match.meeName }}
            </q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    async refreshList(done) {
      await this.loadList();
      done();
    },
    async loadList() {
      this.list = await this.$http.get("golfer/meerronden");
    },
  },
};
</script>
