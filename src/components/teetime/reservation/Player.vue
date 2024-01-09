<template>
  <div>
    <q-list bordered separator>
      <q-item
        v-for="(player, key) in players"
        :key="key"
        v-ripple
        clickable
        v-on:click="handleEditPlayer(player)"
      >
        <q-item-section>
          <q-item-label>
            <b>{{ player.flpName }}</b>
          </q-item-label>
          <q-item-label caption>
            {{ player.flpEmail }}
          </q-item-label>
        </q-item-section>
        <q-item-section side style="font-size: 24px">
          {{ player.flpHandicap }}
        </q-item-section>
      </q-item>
      <q-item
        v-if="freeSlots > 0"
        v-ripple
        clickable
        v-on:click="handleAddPlayer"
      >
        <q-item-section>
          <q-item-label>
            <b>Speler toevoegen</b>
          </q-item-label>
          <q-item-label caption>
            Er zijn nog {{ freeSlots }} plaatsen beschikbaar
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="add" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  props: {
    flight: Object,
    playerArray: Array,
  },
  data: function () {
    return {};
  },
  computed: {
    players() {
      return this.playerArray.filter((item) => item.flpName !== "");
    },
    freeSlots() {
      return this.playerArray.filter((item) => item.flpName === "").length;
    },
  },
  methods: {
    handleSave: function (flight, close, index) {
      this.$emit("handleSave", flight, close, index);
    },
    handleEditPlayer: function (player) {
      this.$emit("handleEditPlayer", player);
    },
    handleAddPlayer() {
      let newPlayer = {
        flpNr: null,
        flpSide: 2,
        flpRelNr: null,
        flpName: null,
        flpEmail: "",
        flpHandicap: "",
        flpCarNr: null,
      };
      this.$emit("handleAddPlayer", newPlayer);
    },
  },
};
</script>
