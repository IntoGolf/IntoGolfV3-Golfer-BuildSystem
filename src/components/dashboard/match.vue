<template>
  <q-list
    v-if="
      $store.state.currentUser.item.tile_match_y_n &&
      $store.state.settings.item.match !== null
    "
    separator
  >
    <q-item
      v-ripple
      class="full-width bg-white shadow-1 q-mb-sm"
      clickable
      style="border-radius: 4px"
      v-on:click="
        $router.push('/match?id=' + $store.state.settings.item.match.matchId)
      "
    >
      <q-item-section>
        <q-item-label class="itg-text-overflow">
          <i class="far fa-calendar-alt mr-2" />
          <b>Wedstrijd:</b>
          {{ $store.state.settings.item.match.name }}
        </q-item-label>

        <q-item-label caption>
          <i class="far fa-golf-club mr-2" />
        </q-item-label>
      </q-item-section>
      <q-item-section avatar> ></q-item-section>
    </q-item>
  </q-list>
  <!--  <div v-else class="row q-pa-sm">-->
  <!--    <div class="col-12 q-pa-xs text-center" style="border: 1px solid lightgrey">-->
  <!--      <p class="q-mt-md" style="font-size: larger">-->
  <!--        Er zijn geen toekomstige wedstrijddeelnames gevonden-->
  <!--      </p>-->
  <!--      <q-icon class="q-ml-auto q-mr-auto" name="trophy" />-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
