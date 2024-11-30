<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <main v-show="focusedItem === null">
        <div class="row q-mb-md">
          <div class="col">
            <q-input
              v-model="searchValue"
              clearable
              hint="voer min. 3 letters is voor het zoeken van een lid"
              label="Zoeken"
            />
          </div>
        </div>

        <div v-if="emptySearch">
          <p>Geen leden gevonden</p>
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

        <div v-if="base64Image" class="row q-mt-md">
          <q-img
            :fit="'contain'"
            :src="base64Image"
            height="180px"
            spinner-color="red"
          />
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
          <div class="col text-bold">Relatiecode</div>
        </div>

        <div class="row">
          <div class="col-12">
            {{ focusedItem.relMemberCode }}
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

        <q-separator spaced />

        <div class="row">
          <div class="col text-bold">GSN</div>
        </div>

        <div class="row">
          <div class="col-12">
            {{ focusedItem.relGsn }}
          </div>
        </div>

        <div v-show="focusedItem.relVisibilityLevel > 1">
          <q-separator spaced />
          <div class="row">
            <div class="col-12 text-bold">E-mail</div>
          </div>
          <div class="row">
            <div class="col-6">
              <a :href="'mailto:' + focusedItem.relEmail">
                {{ email }}
              </a>
            </div>
          </div>
        </div>

        <div v-show="focusedItem.relVisibilityLevel > 2">
          <q-separator spaced />
          <div class="row">
            <div class="col-12 text-bold">Telefoonnummer</div>
          </div>
          <div class="row">
            <div class="col-12">
              <a :href="'tel:' + focusedItem.relPhone">
                {{ focusedItem.relPhone }}
              </a>
            </div>
          </div>
          <q-separator spaced />
          <div class="row">
            <div class="col-12 text-bold">Telefoonnummer mobiel</div>
          </div>
          <div class="row">
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
        </div>

        <div v-show="focusedItem.relVisibilityLevel > 3">
          <q-separator spaced />
          <div class="row">
            <div class="col-12 text-bold">Adres</div>
          </div>
          <div class="row">
            <div class="col-12">
              <p>
                {{ focusedItem.relAddress }}<br />
                {{ focusedItem.relPostalCode }}<br />
                {{ focusedItem.relCity }}<br />
                {{ focusedItem.couName }}<br />
              </p>
            </div>
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
              base64Image = '';
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
      emptySearch: false,
      focusedItem: null,

      base64Image: "",
    };
  },
  async mounted() {},
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
        this.emptySearch = false;
        return;
      }
      this.loadList();
    },
    focusedItem: function (newValue) {
      if (newValue) {
        this.loadImage(newValue);
      }
    },
  },
  methods: {
    loadList() {
      let that = this;
      this.$http
        .get("golfer/relation?search=" + this.searchValue)
        .then((res) => {
          that.list = res;
          that.emptySearch = res.length === 0;
          that.loading = false;
        });
    },
    async loadImage(relation) {
      let name = relation.relImage;
      name = name === "" ? "empty" : name;

      const url = "golfer/image/" + name;
      const response = await this.$http({
        method: "get",
        url: url,
      });

      this.base64Image = `data:image/jpeg;base64,${response}`;
    },
  },
};
</script>
