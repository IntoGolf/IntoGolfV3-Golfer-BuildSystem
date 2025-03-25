<template>
  <q-card v-if="$store.state.currentUser.item.tile_match_y_n"
          bordered class="full-width q-pa-md q-mb-md  bg-purple-1" flat>
    <div class="row text-h6">
      <div class="col">Wedstrijden</div>
    </div>
    <q-separator class="q-mb-sm"/>

    <q-list v-if="list.length > 0" separator>
      <q-item
        v-for="(item, index) in list"
        v-show="index < 3"
        v-bind:key="index"
        v-ripple
        class="full-width q-pa-sm bg-purple-2 q-mb-sm"
        clickable
        style="border-radius: 4px"
        v-on:click="handleOpen(item)"
      >
        <q-item-section>
          <q-item-label class="itg-text-overflow">
            <i class="far fa-calendar-alt mr-2"/>
            {{ $dayjs(item.date).format("ddd D MMM") }}
            {{}} -
            {{ item.time }}
          </q-item-label>

          <q-item-label caption class="text-bold">
            <i class="far fa-golf-club mr-2"/>
            {{ item.name }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar> ></q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else>
      er zijn geen wedstrijden gevonden...
    </q-card-section>
    <q-separator class="q-mb-sm"/>
    <q-btn
      class="full-width"
      color="primary"
      label="ga naar wedstrijden"
      outline
      size="small"
      v-on:click="$router.replace({path: '/match'})"
    />
  </q-card>


</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.list = await this.$http.get('golfer/userEvents');
    },
    handleOpen(player) {
      this.$router.push('/match?id=' + player.id)
    }
  },
};
</script>
