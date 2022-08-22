<template>

  <q-page-container class="q-pa-md">

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--    />-->

    <div class="row q-pa-md q-mt-md bg-white">
      <div class="col">

        <main v-show="focusedItem === null">
          <div class="row q-mb-md">
            <div class="col">
              <q-input outlined v-model="searchValue" label="Zoeken" />
            </div>
          </div>

          <q-list class="full-width" separator>
            <q-item
              clickable
              class="full-width bg-white shadow-1 q-mb-sm"
              v-ripple
              v-for="item in list"
              v-on:click="focusedItem = item"
              :key="item.relNr"
              v-show="item.disabled === 0"
            >
              <q-item-section>
                <q-item-label class="overflow-hidden">
                  <i class="far fa-trophy-alt mr-2" />

                  {{ item.full_name }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar> > </q-item-section>
            </q-item>
          </q-list>
        </main>

        <main v-if="focusedItem !== null">
          <div class="row q-mt-md">
            <div class="col text-h5">Relatie</div>
          </div>

          <q-separator spaced />

          <div class="row">
            <div class="col text-bold">Naam</div>
          </div>

          <div class="row">
            <div class="col-12">
              {{ focusedItem.full_name2 }}
            </div>
          </div>

          <q-separator spaced />

          <div class="row">
            <div class="col text-bold">Speelsterkte</div>
          </div>

          <div class="row">
            <div class="col-12">
              {{ focusedItem.relHandicap.toFixed(1) }}
            </div>
          </div>

          <q-separator spaced v-show="focusedItem.relVisibilityLevel == 2" />

          <div class="row" v-show="focusedItem.relVisibilityLevel == 2">
            <div class="col-12 text-bold">E-mail</div>
          </div>
          <div class="row" v-show="focusedItem.relVisibilityLevel == 2">
            <div class="col-6">
              <a :href="'mailto:' + focusedItem.relEmail">
                {{ email }}
              </a>
            </div>
          </div>

          <q-separator spaced v-show="focusedItem.relVisibilityLevel == 3" />

          <div class="row" v-show="focusedItem.relVisibilityLevel == 3">
            <div class="col-12 text-bold">Telefoonnummer</div>
          </div>
          <div class="row" v-show="focusedItem.relVisibilityLevel == 3">
            <div class="col-12">
              <a :href="'tel:' + focusedItem.relPhone">
                {{ focusedItem.relPhone }}
              </a>
            </div>
          </div>

          <q-separator spaced v-show="focusedItem.relVisibilityLevel == 3" />

          <div class="row" v-show="focusedItem.relVisibilityLevel == 3">
            <div class="col-12 text-bold">Telefoonnummer mobiel</div>
          </div>
          <div class="row" v-show="focusedItem.relVisibilityLevel == 3">
            <div class="col-12">
              <a :href="'tel:' + focusedItem.relPhoneMobile">
                {{ focusedItem.relPhoneMobile }}
              </a>
            </div>
          </div>

          <q-separator spaced />

          <div class="text-center p-2">
            <q-btn
              class="w-100"
              @click="
                focusedItem = null;
                searchValue = '';
              "
              label="Sluiten"
              icon="close"
              color="primary"
            />
          </div>
        </main>

      </div>
    </div>
  </q-page-container>
</template>

<script>
// import TopBar from "../components/TopBar";

export default {
  data: function () {
    return {
      loading: false,

      back_icon: "fa-home",
      back_link: "/",
      title: "Ledenlijst",
      callBack: undefined,

      list: [],
      searchValue: "",
      focusedItem: null,
    };
  },
  created() {},
  computed: {
    searchCount: function () {
      return this.list.length;
    },
    email: function () {
      return this.focusedItem.relEmail ? this.focusedItem.relEmail : "-";
    },
  },
  watch: {
    searchValue: function () {
      if (this.searchValue.length < 3) {
        return;
      }
      this.loadList();
    },
  },
  methods: {
    loadList() {
      let that = this;
      this.$http
        .get("golfer/memberList?search=" + this.searchValue)
        .then((res) => {
          that.list = res;
          that.loading = false;
        });
    },
  },
};
</script>
