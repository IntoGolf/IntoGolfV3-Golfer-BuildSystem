<template>
  <div>
    <div
      v-for="(time, key) of times"
      :key="key"
      class="row q-pt-xs"
      v-on:click="
        this.$emit('setTimeObject', { time: time, price: price(time), course: course })
      "
    >
      <div
        v-if="$store.state.settings.publicItems.app_display_greenfee_pay == 0"
        :style="backgroundColor(time)"
        class="col-12 q-pa-sm cursor-pointer"
      >
        {{ $filters.minuteToTime(time.sttTimeFrom) }}
      </div>
      <div v-else class="col-12">
        <div class="row">
          <div
            :style="backgroundColor(time)"
            class="col-5 q-pa-sm cursor-pointer"
          >
            {{ $filters.minuteToTime(time.sttTimeFrom) }}
            <q-icon
              v-for="(p, k) in time.playerCount"
              v-show="time.playerCount > 0"
              :key="k"
              name="person"
              style="margin-bottom: 4px"
            />
          </div>
          <div
            :style="backgroundColor(time)"
            class="col-7 text-right q-pa-sm cursor-pointer"
          >
            {{ $filters.money(price(time)) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
    holes: Number,
    size: Number,
    per: Object,
  },
  computed: {
    from: function () {
      let result = 240;
      if (this.per.value === 3) {
        result = 720;
      } else if (this.per.value === 4) {
        result = 1080;
      }
      return result;
    },
    to: function () {
      let result = 1439;
      if (this.per.value === 2) {
        result = 720;
      } else if (this.per.value === 3) {
        result = 1080;
      }
      return result;
    },
    times: function () {
      return Object.values(this.course.times).filter((t) => {
        return (
          (this.holes.value === 9 ||
            (this.holes.value === 18 && t.sttCrlNrNext > 0)) &&
          t.sttMaxPlayers >= this.size &&
          t.sttTimeFrom >= this.from &&
          t.sttTimeFrom < this.to
        );
      });
    },
  },
  methods: {
    price: function (time) {
      if (
        this.holes.value === 18 &&
        (!time || !time.greenFeePrice18 || time.greenFeePrice18.length === 0)
      ) {
        return 0;
      }

      if (
        this.holes.value === 9 &&
        (!time || !time.greenFeePrice9 || time.greenFeePrice9.length === 0)
      ) {
        return 0;
      }

      if (this.holes.value === 18) {
        return time.greenFeePrice18[0].price * this.size;
      } else {
        return time.greenFeePrice9[0].price * this.size;
      }
    },
    backgroundColor: function (time) {
      let customBG = this.$store.getters["settings/publicItems"].app_primary_color;
      let customFont = this.$store.getters["settings/publicItems"].app_primary_font_color;

      let backgroundColor = time.players.length > 0 ? '#90caf9' : '#a5d6a7';
      let color = 'black;'
      if (customBG) {
        backgroundColor = customBG;
        color = customFont;
      }

      return {
        backgroundColor: backgroundColor,
        color: color
      }
    }
  },
};
</script>
