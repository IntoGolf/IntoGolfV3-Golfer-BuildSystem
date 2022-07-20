<template>
  <div class="page-messages container q-mt-xl">

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--    ></top-bar>-->

    <q-list
      bordered
      class="col-xl-8 box-show bg-white ml-auto mr-auto rounded-borders p-2"
    >
      <q-expansion-item
        v-for="(item, index) in list"
        :key="index"
        @show="setMessageOpened(item)"
        expand-separator
        icon="perm_identity"
        :class="{ 'text-weight-bold': item.message_opened == null }"
        :label="item.msgTitle"
        :caption="item.msgTimeStamp"
      >
        <q-card>
          <q-card-section>
            <div class="mb-1 icon-container">
              <i class="fal fa-clock mr-1"></i>
              {{ item.msgTo }}
            </div>
            <p>{{ item.msgText }}</p>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
// import TopBar from "../components/TopBar";

export default {
  data() {
    return {
      page: "list",

      back_icon: "fa-home",
      back_link: "/",
      title: "Berichten",
      callBack: undefined,

      listUrl: "golfer/message/all",
      openedUrl: "golfer/message/setOpened",
      list: [],
      selectedItem: null,
      currentUser: this.$ls.getItem("currentUser"),
    };
  },
  created() {
    this.loadList();
  },
  filters: {},
  methods: {
    loadList() {
      this.selectedItem = null;
      let that = this;
      this.$http.get(this.listUrl).then((res) => {
        that.list = res.data;
      });
    },
    setMessageOpened(item) {
      this.selectedItem = item;
      this.$http.post(this.openedUrl, this.selectedItem);
    },
    getAvatar(item) {
      let url = process.env.VUE_APP_BASE_URL;
      return url + "/images/avatar-blank.jpeg";
    },
  },
};
</script>
