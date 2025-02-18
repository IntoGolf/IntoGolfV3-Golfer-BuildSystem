<template>
  <div class="q-pa-md overflow-auto" style="height: 100vh">
    <div v-if="form === null">
      <q-card v-for="(item,key) in list" :key="key" v-ripple class="q-pa-sm">
        <pro-them-lesson-list-details :item="item" v-on:onOpen="onSetProLesson"/>
      </q-card>
    </div>
    <public-lesson-client-book v-else :form="form" v-on:onClose="onClose"/>
  </div>
</template>

<script>

import PublicLessonClientBook from "components/proLessonClient/book.vue";
import ProThemLessonListDetails from "components/proLesson/list/themDetails.vue";

export default {
  components: {ProThemLessonListDetails, PublicLessonClientBook},
  data() {
    return {
      list: [],
      form: null
    };
  },
  async created() {
    await this.getList();
  },
  methods: {
    async getList() {
      this.list = await this.$http.get("public/walkins");
      console.log(this.list);
    },
    async onClose() {
      this.form = null;
      await this.getList();
    },
    onSetProLesson(item) {
      let client = {
        firstName: "laurens",
        prefix: "",
        lastName: "luder",
        email: "lluder@icloud.com",
        phone: "0172617000",
        handicap: 54.0
      }
      item.clients.push(client);
      this.form = item;
    }
  },
};
</script>
