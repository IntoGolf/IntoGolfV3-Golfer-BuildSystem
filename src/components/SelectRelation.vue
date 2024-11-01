<template>
  <div class="row">
    <div class="col">
      <q-input
        v-model="searchValue"
        clearable
        label="Zoek marker"
        @clear="onClear"
      >
        <template v-slot:append>
          <q-btn
            :disable="searchDisabled"
            label="Zoeken"
            v-on:click="loadList"
          />
        </template>
      </q-input>
      <q-list>
        <q-item
          v-for="(rel, key) in list"
          :key="key"
          v-ripple
          clickable
          @click="handleUpdate(rel)"
        >
          <q-item-section>{{ rel.full_name2 }}</q-item-section>
          <q-item-section avatar>{{ rel.relGsn }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  name: "SelectRelation",
  mixins: [authMixin],
  props: {
    markerGsn: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      model: null,
      searchValue: null,
      list: [],
    };
  },
  computed: {
    searchDisabled() {
      return this.searchValue === null || this.searchValue.length < 3;
    },
  },
  methods: {
    async loadList() {
      this.loading = true; // Start loading
      try {
        let res = await this.$http.get(
          "golfer/relation?search=" + this.searchValue
        );
        this.list = res.filter(
          (rel) => rel.relGsn !== null && rel.relGsn !== this.currentUser.relGsn
        );
      } catch (error) {
        console.error("Error loading options:", error);
      } finally {
        this.loading = false; // Stop loading
      }
    },
    handleUpdate(rel) {
      this.$emit("update:markerGsn", rel);
    },
    onClear() {
      this.list = [];
    },
  },
};
</script>
