<template>

  <q-page-container>

    <div
        v-show="step === 1"
        class="row q-mt-md">

      <div class="col-3"></div>

      <div class="col-6">

        <div class="row text-center">
          <h5 class="q-ml-auto q-mr-auto">Boek een starttijd</h5>
        </div>

        <div class="row q-gutter-sm">

          <div class="col-7">

            <div
                class="row q-gutter-xs">
              <div
                  v-for="(course, cKey) of courses"
                  :key="cKey"
                  class="q-pa-sm col items-start text-center text-white bg-secondary text-bold">
                {{ course.crlName }}
              </div>
            </div>

            <div
                class="row q-gutter-xs"
                style="max-height: 600px; overflow: scroll">
              <div
                  v-for="(course, cKey) of courses"
                  :key="cKey"
                  class="col text-grey-8 text-bold">
                <div
                    v-for="(time, tKey) of course.times"
                    :key="tKey"
                    v-on:click="timeObject = time"
                    class="row text-center q-pt-xs">
                  <div
                      class="col q-pa-sm bg-green-3">
                    {{ $filters.minuteToTime(time.sttTimeFrom) }}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="col-4">
            <q-input class="q-mb-sm" v-model="date" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select class="q-mb-sm" v-model="holes" :options="holesArray" label="Aantal holes"
                      emit-value/>
          </div>

        </div>

      </div>

      <div class="col-3"></div>

    </div>

    <div
        v-show="step === 2"
        class="row q-mt-md">

      <div class="col-4"/>

      <div class="col-4">
        <div class="row text-center">
          <h5 class="q-ml-auto q-mr-auto">Uw reservering</h5>
        </div>
        <div class="row">
          <div class="col-8">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpName1"
                label="Uw naam"
                :rules="[val => !!val || '* Required']"
                stack-label/>
          </div>
          <div class="col-4">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpHandicap1"
                label="Uw handicap"
                mask="##.#"
                fill-mask="0"
                :rules="[val => val > -9.9 && val <= 54 || '* tussen -9.9 tot 54.0']"
                reverse-fill-mask
                stack-label/>
          </div>
        </div>
        <q-input
            class="q-mb-sm"
            v-model="flight.flpEmail1"
            label="Uw e-mailadres"
            :rules="[emailRule]"
            stack-label/>
        <q-input
            class="q-mb-sm"
            v-model="flight.flpPhone1"
            label="Uw telefoonummer"
            :rules="[val => !!val || '* Required']"
            stack-label/>
        <div class="row">
          <div class="col-8">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpName2"
                :rules="[val => !!val || '* Required']"
                label="Speler 2"
                stack-label/>
          </div>
          <div class="col-4">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpHandicap2"
                label="Handicap"
                mask="##.#"
                fill-mask="0"
                :rules="[val => val > -9.9 && val <= 54 || '* tussen -9.9 tot 54.0']"
                reverse-fill-mask
                stack-label/>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpName3"
                :rules="[val => !!val || '* Required']"
                label="Speler 3"
                stack-label/>
          </div>
          <div class="col-4">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpHandicap3"
                label="Handicap"
                mask="##.#"
                fill-mask="0"
                :rules="[val => val > -9.9 && val <= 54 || '* tussen -9.9 tot 54.0']"
                reverse-fill-mask
                stack-label/>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpName4"
                :rules="[val => !!val || '* Required']"
                label="Speler 4"
                stack-label/>
          </div>
          <div class="col-4">
            <q-input
                class="q-mb-sm"
                v-model="flight.flpHandicap4"
                label="Handicap"
                mask="##.#"
                fill-mask="0"
                :rules="[val => val > -9.9 && val <= 54 || '* tussen -9.9 tot 54.0']"
                reverse-fill-mask
                stack-label/>
          </div>
        </div>
        <q-btn class="q-mr-sm" color="secondary" label="Terug" v-on:click="step=1"/>
        <q-btn color="secondary" label="Reserveren" v-on:click="handleSave"/>
      </div>

      <div class="col-4"/>

    </div>

    <div
        v-show="step === 3"
        class="row q-mt-md">

      <div class="col-4"/>

      <div class="col-4">

      </div>

      <div class="col-4"/>

    </div>

  </q-page-container>

</template>

<script>

//import Reservation from "../components/teetime/Reservation";

export default {
  components: {},
  data() {
    return {
      step: 1,
      courses: [],
      holesArray: [
        {label: '9 Holes', value: 9},
        {label: '18 Holes', value: 18}
      ],

      date: null,
      timeObject: null,
      size: 3,
      holes: 9,

      flight: {
        fltDate: null,
        fltTime1: null,
        fltTime1Booked: null,
        fltCrlNr1: null,
        fltCrlNr2: null,
        fltSize: 3,

        flpName1: 'Laurens Luder',
        flpEmail1: 'laurens@intogolf.nl',
        flpPhone1: '',
        flpHandicap1: 21.1,

        flpName2: 'Laurens Luder',
        flpEmail2: 'laurens@intogolf.nl',
        flpPhone2: '0611045770',
        flpHandicap2: 21.1,

        flpName3: 'Laurens Luder',
        flpEmail3: 'laurens@intogolf.nl',
        flpPhone3: '0611045770',
        flpHandicap3: 21.1,

        flpName4: 'Laurens Luder',
        flpEmail4: 'laurens@intogolf.nl',
        flpPhone4: '0611045770',
        flpHandicap4: 21.1,
      }
    };
  },
  mounted() {
    this.date = this.$dayjs().format('YYYY-MM-DD');
  },
  watch: {
    date: function () {
      this.$http.get("igg?date=" + this.date).then((res) => {
        this.loading = false;
        this.courses = res.payload;
      });
    },
    timeObject: function (newValue) {
      this.flight.fltDate = newValue.sttDate;
      this.flight.fltTime1 = newValue.sttTimeFrom;
      this.flight.fltTime1Booked = newValue.sttTimeFrom;
      this.flight.fltCrlNr1 = newValue.sttCrlNr;
      this.flight.fltCrlNr2 = this.holes === 18 ? newValue.sttCrlNrNext : null;
      console.log(newValue);
      this.step = 2;
    }
  },
  computed: {
    emailRule() {
      return (val) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailPattern.test(val) || 'Invalid email format'
      }
    }
  },
  methods: {
    handleSave: function () {
      this.$http.post("igg/guest", this.flight).then((res) => {
        console.log(res);
      });
    }
  }
};
</script>
