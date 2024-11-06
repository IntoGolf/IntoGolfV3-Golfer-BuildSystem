<template>
  <div :style="{ marginTop: $q.platform.is.ios ? '60px' : '' }">
    <q-btn
      class="full-width"
      color="primary"
      icon="chevron_left"
      label="Terug naar overzicht"
      @click="$emit('handleClose')"
    />
    <div class="row q-mt-sm q-mb-sm text-h6 text-center">
      <div class="col">
        {{ title }}
      </div>
    </div>
    <div v-if="filteredList.length === 0" class="row q-mt-md q-mb-sm text-bold">
      <div class="col">Geen gegevens gevonden</div>
    </div>
    <div v-else class="row">
      <div class="col">
        <div class="row q-mt-md text-bold">
          <div class="col-3 q-pa-sm">Datum</div>
          <div class="col-2 q-pa-sm">Holes</div>
          <div class="col-7 q-pa-sm">
            {{ col2Header }}
          </div>
        </div>
        <q-separator class="q-mt-sm q-mb-sm" />
        <div
          class="row q-mt-md"
          style="height: calc(100vh - 300px); overflow-y: scroll"
        >
          <div class="col">
            <div
              v-for="(item, key) in filteredList"
              :key="key"
              :style="{ backgroundColor: key % 2 === 1 ? 'lightgray' : '' }"
              class="row"
            >
              <div class="col-3 q-pa-sm">
                {{ item.date }}<br />
                {{ extra(item) }}
              </div>
              <div class="col-2 q-pa-sm">
                {{ item.holes }}
              </div>
              <div class="col-7 q-pa-sm">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    typeId: Number,
  },
  computed: {
    filteredList() {
      return this.list.filter((item) => item.eventTypeId === this.typeId);
    },
    title() {
      if (this.typeId === 1) {
        return "Hieronder staan de reeds gespeelde boekingen voor dit jaar";
      } else if (this.typeId === 2) {
        return "Hieronder staan de nog niet gespeelde boekingen voor dit jaar";
      } else if (this.typeId === 3) {
        return "Hieronder staan de evenementen voor dit jaar";
      } else if (this.typeId === 4) {
        return "Hieronder staan de annuleringen voor dit jaar";
      }
      return "";
    },
    col2Header() {
      if ([1, 2].includes(this.typeId)) {
        return "Tijd";
      } else if (this.typeId === 3) {
        return "Naam";
      } else if (this.typeId === 4) {
        return "Reden";
      }
      return "";
    },
  },
  methods: {
    extra(row) {
      if (this.typeId === 4) {
        return row.time;
      }
      return "";
    },
  },
};
</script>
