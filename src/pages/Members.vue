<template>
  <q-page-container>
    <q-page>
      <main v-show="focusedItem === null">
        <div class="row q-mb-md">
          <div class="col">
            <q-input v-model="searchValue" clearable label="Zoeken" />
          </div>
        </div>

        <q-list class="full-width" separator>
          <q-item
            v-for="item in list"
            :key="item.relNr"
            v-ripple
            class="full-width bg-white shadow-1 q-mb-sm"
            clickable
            v-on:click="focusedItem = item"
          >
            <q-item-section>
              <q-item-label class="overflow-hidden">
                <i class="far fa-trophy-alt mr-2" />

                {{ item.full_name }}
              </q-item-label>
            </q-item-section>

            <q-item-section avatar> ></q-item-section>
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

        <q-separator v-show="focusedItem.relVisibilityLevel > 1" spaced />

        <div v-show="focusedItem.relVisibilityLevel > 1" class="row">
          <div class="col-12 text-bold">E-mail</div>
        </div>
        <div v-show="focusedItem.relVisibilityLevel > 1" class="row">
          <div class="col-6">
            <a :href="'mailto:' + focusedItem.relEmail">
              {{ email }}
            </a>
          </div>
        </div>

        <q-separator v-show="focusedItem.relVisibilityLevel > 2" spaced />

        <div v-show="focusedItem.relVisibilityLevel > 2" class="row">
          <div class="col-12 text-bold">Telefoonnummer</div>
        </div>
        <div v-show="focusedItem.relVisibilityLevel > 2" class="row">
          <div class="col-12">
            <a :href="'tel:' + focusedItem.relPhone">
              {{ focusedItem.relPhone }}
            </a>
          </div>
        </div>

        <q-separator v-show="focusedItem.relVisibilityLevel > 2" spaced />

        <div v-show="focusedItem.relVisibilityLevel > 2" class="row">
          <div class="col-12 text-bold">Telefoonnummer mobiel</div>
        </div>
        <div v-show="focusedItem.relVisibilityLevel > 2" class="row">
          <div class="col-12">
            <a
              v-if="focusedItem.relPhoneMobile"
              :href="'tel:' + focusedItem.relPhoneMobile"
            >
              {{ focusedItem.relPhoneMobile }}
            </a>
            <p v-else>-</p>
          </div>
        </div>

        <q-separator spaced />

        <div class="text-center p-2">
          <q-btn
            class="w-100"
            color="primary"
            icon="close"
            label="Sluiten"
            @click="
              focusedItem = null;
              searchValue = '';
            "
          />
        </div>
      </main>
    </q-page>
  </q-page-container>
</template>

<script>
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
      if (this.searchValue === null || this.searchValue.length < 3) {
        this.list = [];
        return;
      }
      this.loadList();
    },
  },
  methods: {
    loadList() {
      let that = this;
      this.$http
        .get("golfer/relation?search=" + this.searchValue)
        .then((res) => {
          that.list = res;
          that.loading = false;
        });
    },
  },
};
</script>
