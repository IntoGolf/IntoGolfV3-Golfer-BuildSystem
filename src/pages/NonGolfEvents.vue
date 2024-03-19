<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <main v-show="focusedItem === null">
        <q-list class="full-width" separator>
          <q-item
            v-for="(item, key) in list"
            :key="key"
            v-ripple
            class="full-width bg-white shadow-1 q-mb-sm"
            clickable
            v-on:click="focusedItem = item"
          >
            <q-item-section>
              <q-item-label class="overflow-hidden">
                <i class="far fa-trophy-alt mr-2" />

                {{ item.evnDate }} {{ item.evnName }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon v-show="getOnEvent(item)" color="green" name="check" />
            </q-item-section>
          </q-item>
        </q-list>
      </main>

      <main v-if="focusedItem !== null">
        <div class="row q-mt-md text-h6">
          {{ focusedItem.evnName }}
        </div>
        <q-separator spaced />
        <div class="row q-mt-sm">
          <div class="col text-bold">Datum:</div>
          <div class="col text-right">{{ focusedItem.evnDate }}</div>
        </div>

        <div class="row q-mt-sm">
          <div class="col text-bold">Inschrijven van:</div>
          <div class="col text-right">{{ focusedItem.evnSubscribeStart }}</div>
        </div>

        <div class="row q-mt-sm">
          <div class="col text-bold">Inschrijven tot:</div>
          <div class="col text-right">{{ focusedItem.evnSubscribeEnd }}</div>
        </div>

        <q-separator spaced />
        <div class="row q-mt-sm">
          <div class="col event_notes" v-html="focusedItem.evnNotes" />
        </div>

        <q-separator spaced />
        <div class="row q-mt-md text-h6">Deelnemers</div>

        <div
          v-for="(person, key) in this.focusedItem.eventPersons"
          :key="key"
          class="row"
        >
          <div class="col">
            <span>{{ person.epeName }}</span>
          </div>
        </div>

        <q-separator spaced />

        <div class="row q-mt-md">
          <q-btn
            v-show="focusedItem.openForSubscription && !onEvent"
            class="full-width"
            color="primary"
            @click="subscribe"
            >Inschrijven
          </q-btn>
          <q-btn
            v-show="focusedItem.openForSubscription && onEvent"
            class="full-width"
            color="primary"
            @click="unSubscribe"
            >Uitschrijven
          </q-btn>
          <q-btn class="full-width q-mt-md" @click="focusedItem = null"
            >Sluiten
          </q-btn>
        </div>
      </main>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  data: function () {
    return {
      list: [],
      focusedItem: null,
    };
  },
  created() {
    this.loadList();
  },
  computed: {
    onEvent() {
      return this.focusedItem.eventPersons.find(
        (person) => person.epeRelNr === this.currentUser.relNr
      );
    },
  },
  methods: {
    getOnEvent(item) {
      return item.eventPersons.find(
        (person) => person.epeRelNr === this.currentUser.relNr
      );
    },
    async loadList() {
      this.list = await this.$http.get("golfer/non_golf_events");
    },
    async subscribe() {
      this.$q
        .dialog({
          title: "Inschrijven activiteit",
          message: "je schrijft je in voor deze activiteit, wil je doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.executeSubscribe();
        });
    },
    async executeSubscribe() {
      const data = { evnNr: this.focusedItem.evnNr };
      await this.$http.post("golfer/non_golf_events", data);
      this.$q.notify({
        type: "positive",
        message: "Je bent ingeschreven",
      });

      this.refresh();
    },
    async unSubscribe() {
      this.$q
        .dialog({
          title: "Uitschrijven activiteit",
          message: "Je schrijft je uit voor deze activiteit, wil je doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.executeUnSubscribe();
        });
    },
    async executeUnSubscribe() {
      const params = { params: { epeNr: this.onEvent.epeNr } };
      await this.$http.delete("golfer/non_golf_events/", params);
      this.$q.notify({
        type: "positive",
        message: "Je bent uitgeschreven",
      });
      this.refresh();
    },
    async refresh() {
      await this.loadList();
      this.focusedItem = this.list.find(
        (item) => item.evnNr === this.focusedItem.evnNr
      );
    },
  },
};
</script>

<style>
.event_notes > p {
  margin: 0;
}
</style>
