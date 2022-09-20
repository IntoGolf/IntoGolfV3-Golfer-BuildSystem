<template>

  <q-page-container>

    <h4 class="text-center" v-show="!correct">Voer de 4 cijferige check-in code in</h4>
    <h5  class="text-center" v-show="!correct"> u vindt deze code op de baan bij het checkin point </h5>
    <h4  class="text-center" v-show="correct"> Code correct u wordt ingechecked </h4>
    <div class="row">
      <div class="q-ml-auto q-mr-auto" style="width: 230px">
        <q-input outlined maxlength="1" v-model="NR1" readonly
                 style="width: 50px; float: left; margin-right: 10px; text-align: center; font-size: 24px"/>
        <q-input outlined maxlength="1" v-model="NR2" readonly
                 style="width: 50px; float: left; margin-right: 10px; text-align: center; font-size: 24px"/>
        <q-input outlined maxlength="1" v-model="NR3" readonly
                 style="width: 50px; float: left; margin-right: 10px; text-align: center; font-size: 24px"/>
        <q-input outlined maxlength="1" v-model="NR4" readonly
                 style="width: 50px; float: left; text-align: center; font-size: 24px"/>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="q-ml-auto q-mr-auto q-mb-sm">
        <q-btn color="secondary" label="0" class="q-ma-sm" v-on:click="pressKey(0)" style="font-size: 24px"/>
        <q-btn color="secondary" label="1" class="q-ma-sm" v-on:click="pressKey(1)" style="font-size: 24px"/>
        <q-btn color="secondary" label="2" class="q-ma-sm" v-on:click="pressKey(2)" style="font-size: 24px"/>
        <q-btn color="secondary" label="3" class="q-ma-sm" v-on:click="pressKey(3)" style="font-size: 24px"/>
        <q-btn color="secondary" label="4" class="q-ma-sm" v-on:click="pressKey(4)" style="font-size: 24px"/>
      </div>
    </div>
    <div class="row">
      <div class="q-ml-auto q-mr-auto">
        <q-btn color="secondary" label="5" class="q-ma-sm" v-on:click="pressKey(5)" style="font-size: 24px"/>
        <q-btn color="secondary" label="6" class="q-ma-sm" v-on:click="pressKey(6)" style="font-size: 24px"/>
        <q-btn color="secondary" label="7" class="q-ma-sm" v-on:click="pressKey(7)" style="font-size: 24px"/>
        <q-btn color="secondary" label="8" class="q-ma-sm" v-on:click="pressKey(8)" style="font-size: 24px"/>
        <q-btn color="secondary" label="9" class="q-ma-sm" v-on:click="pressKey(9)" style="font-size: 24px"/>
      </div>
    </div>

    <div class="row q-mt-sm">
      <div class="q-ml-auto q-mr-auto">
        <q-btn color="secondary" label="wissen" v-on:click="onClear" class="q-ma-sm" style="font-size: 24px"/>
      </div>
    </div>

  </q-page-container>

</template>

<script>

export default {
  components: {},
  props: {
    flight: Object
  },
  data() {
    return {
      page: 0,
      type: 1,
      NR1: '',
      NR2: '',
      NR3: '',
      NR4: '',
      nr:1,
      checkCode:''
    };
  },
  created: function () {
  },
  computed: {
    code: function() {
      return this.NR1.toString() + this.NR2.toString() + this.NR3.toString() + this.NR4.toString();
    },
    correct: function() {

      let result = this.code.length == 4 && this.code == this.checkCode;

      if (result) {
        this.onCheckIn();
      }

      return result;
    }
  },
  methods: {

    onCheckIn: function() {
      let flight = {flpNr: this.$route.query.id};
      this.$http.post("golfer/booking/checkin",flight).then((res) => {

        setTimeout(this.onGoHome, 3000);

      });
    },

    onGoHome: function() {
      this.$router.push('/');
    },

    onClear: function() {
      this.NR1 = '';
      this.NR2 = '';
      this.NR3 = '';
      this.NR4 = '';
      this.nr = 1;
    },

    pressKey: function(key) {

      let intTime = this.$filters.timeToMinute(this.$dayjs().format("HH:mm"));
      intTime = intTime * 5767871726;
      this.checkCode = intTime.toString().substr(0,4);

      if (this.nr == 1) {
        this.NR1 = key;
      }
      if (this.nr == 2) {
        this.NR2 = key;
      }
      if (this.nr == 3) {
        this.NR3 = key;
      }
      if (this.nr == 4) {
        this.NR4 = key;
      }

      this.nr = this.nr == 4 ? 1 : this.nr +1;
    },

    handleCloseScorecard: function (reload) {
      // this.$http.get("golfer/handicap/all").then((res) => {
      //   that.handicapList = res.data;
      // });
    }

  }

};
</script>
