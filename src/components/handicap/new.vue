<template>
  <q-page class="q-pa-md">
    <q-card>

      <q-card-section class="text-h6">
        Nieuwe scorekaart {{ scorecard.name }}
      </q-card-section>

      <q-separator inset/>

      <q-card-section class="q-pt-none">

        <!--National scorecard-->
        <div v-if="scorecard.type == 1">

          <!--Step 1: date and time-->
          <div v-if="scorecard.step == 1">
            <q-input
                ref="date"
                label="Datum"
                v-model="scorecard.date"
                v-show="scorecard.step == 1"
                type="date"
                lazy-rules
                :rules="validDate"/>

            <q-input
                type="time"
                v-model="scorecard.time"
                mask="time"
                lazy-rules
                v-show="scorecard.step == 1"/>

            <q-input
                v-show="scorecard.step == 1"
                ref="gsn"
                type="text"
                v-model="scorecard.marker"
                label="Marker"
                hint="Type hier het GSN (NL00000000) van de marker"
                mask="AA########"
                :rules="validGsn"
            />

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                  icon-right="navigate_next"
                  color="secondary"
                  label="Baan"
                  @click="scorecard.step = 2"
                  :disabled="gsnIsInvalid || !scorecard.date || !scorecard.time"
              />
            </q-btn-group>
          </div>

          <!--Step 2: course-->
          <div v-if="scorecard.step == 2">
            <q-select
                ref="selectbaan"
                v-model="scorecard.course"
                :options="banenSelectOptions"
                use-input
                input-debounce="0"
                @filter="filterFn"
                option-value="value"
                option-label="label"
                @input="onChangeBaan"
                behavior="menu"
                emit-value
                map-options
            >
            </q-select>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                  icon="navigate_before"
                  color="secondary"
                  label="datum"
                  @click="scorecard.step = 1"
              />
              <q-btn
                  icon-right="navigate_next"
                  color="secondary"
                  label="Lus"
                  @click="scorecard.step = 3"
                  :disabled="!scorecard.course"
              />
            </q-btn-group>
          </div>

          <!--Step 3: lus-->
          <div v-if="scorecard.step == 3">
            <q-list bordered separator>
              <q-item
                  clickable
                  class="itg-q-item"
                  v-ripple
                  v-for="(lus, index) in baan.baan_lussen"
                  v-bind:key="index"
                  @click="onChangeLus(lus)"
              >
                <q-item-section>
                  <q-item-label class="itg-text-overflow">{{
                      lus.bnlName
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                  icon="navigate_before"
                  color="secondary"
                  label="Baan"
                  @click="scorecard.step = 2"
              />
            </q-btn-group>
          </div>

          <!--Step 4: tee -->
          <div v-if="scorecard.step == 4">
            <q-list bordered separator>
              <q-item
                  clickable
                  class="itg-q-item"
                  v-ripple
                  v-for="(tee, index) in genderTeeList"
                  v-bind:key="index"
                  @click="onChangeTee(tee)"
              >
                <q-item-section>
                  <q-item-label class="itg-text-overflow">
                    <q-icon
                        class="fal fa-golf-ball"
                        :class="teeColor(tee)"
                    ></q-icon>
                    {{ getTeeName(tee.bltCategory) }}
                    <div class="float-right">
                      {{ getTeeAdvise(tee.bltCategory) }}
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                  icon="navigate_before"
                  color="secondary"
                  label="Lus"
                  @click="scorecard.step = 3"
              />
            </q-btn-group>
          </div>

          <!--Step 5: confirmation-->
          <div id="div-scorecard-details" v-if="scorecard.step == 5">
            <div class="row q-mt-md">
              <div class="col" style="font-weight: bold">Datum</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.date }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Tijd</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.time }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Baan</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.course_name }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Lus</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.loop_name }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Tee</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.tee_name }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Courserating</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.courserate }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Sloperating</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.sloperate }}
              </div>
            </div>

            <div class="row">
              <div class="col" style="font-weight: bold">Par</div>
              <div class="col text-right itg-text-overflow">
                {{ scorecard.total_par }}
              </div>
            </div>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                  icon="navigate_before"
                  color="secondary"
                  @click="scorecard.step = 4"
              />

              <q-btn icon="check" color="secondary" @click="onSaveScorecard"/>

              <q-btn
                  icon="close"
                  color="secondary"
                  @click="onCancelScorecard"
              />
            </q-btn-group>
          </div>
        </div>

        <!--Foreign scorecard-->
        <div v-else-if="scorecard.type == 2">

          <q-form class="q-gutter-sm">

            <q-input
                ref="date"
                type="date"
                label="Datum"
                v-model="scorecard.date"
                v-show="scorecard.step == 1"
                lazy-rules
                :rules="validDate"/>

            <q-input
                type="time"
                label="Tijd"
                v-model="scorecard.time"
                v-show="scorecard.step == 1"
                mask="time"
                lazy-rules/>

            <q-select
                v-show="scorecard.step == 1"
                v-model="scorecard.course_country_code"
                :options="countries"
                option-label="couName"
                option-value="couIsoCode"
                emit-value
                map-options
                label="Land"
            />

            <q-input
                v-show="scorecard.step == 2"
                v-model="scorecard.course_name"
                label="Baan"
                hint="Type hier de naam van de speelde baan"
                lazy-rules
                :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige baan naam',
              ]"
            />

            <q-select
                v-show="scorecard.step == 2"
                v-model="scorecard.loop"
                :options="holes_array"
                hint="Selecteer de gespeelde lus"
                label="Holes"
                behavior="menu"
            />

            <q-input
                v-show="scorecard.step == 2"
                type="text"
                v-model="scorecard.loop_name"
                label="Naam lus"
                hint="Type hier de naam van de speelde lus"
                lazy-rules
                :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige lus naam',
              ]"
            />

            <q-input
                v-show="scorecard.step == 2"
                type="text"
                v-model="scorecard.tee_name"
                label="Naam tee"
                hint="Type hier de naam van de speelde tee"
                lazy-rules
                :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige tee naam',
              ]"
            />

            <q-input
                v-show="scorecard.step == 3"
                v-model="scorecard.courserate"
                type="number"
                label="Courserating"
                hint="Voer hier de courserating in van de gespeelde baan"
                lazy-rules
                :rules="validCourseRating"
            />

            <q-input
                v-show="scorecard.step == 3"
                type="number"
                v-model="scorecard.sloperate"
                label="Sloperating"
                hint="Voer hier de sloperating in van de gespeelde baan"
                lazy-rules
                :rules="validSlopeRating"
            />

            <q-input
                v-show="scorecard.step == 3"
                type="number"
                v-model="scorecard.total_par"
                label="Par"
                hint="Voer hier de par in van de gespeelde baan"
                lazy-rules
                :rules="validTotalPar"
            />

            <q-input
                v-show="scorecard.step == 4"
                type="number"
                v-model="scorecard.total_stableford"
                label="Punten"
                hint="Voer hier aantal stableford punten in"
                lazy-rules
                :rules="validStableford"
            />

            <q-input
                v-show="scorecard.step == 4"
                ref="gsn"
                type="text"
                v-model="scorecard.marker"
                label="Marker"
                hint="Type hier het GSN (NL00000000) van de marker"
                mask="AA########"
                :rules="validGsn"
            />

            <q-input
                v-show="scorecard.step == 4"
                type="text"
                v-model="scorecard.remarks"
                label="Opmerking"
                hint="Heeft u een opmerking voer deze hier in"
            />

            <div class="q-pa-md">
              <q-btn-group spread>
                <q-btn
                    v-show="scorecard.step > 1"
                    color="secondary"
                    label="Vorig"
                    @click="setStep(-1)"
                />
                <q-btn
                    v-show="scorecard.step < 4"
                    :disable="!isStepValid"
                    color="secondary"
                    label="Volgende"
                    @click="setStep(1)"
                />
                <q-btn
                    v-show="scorecard.step == 4"
                    :disable="!isStepValid"
                    color="secondary"
                    label="Opslaan"
                    @click="onSaveScorecard()"
                />
              </q-btn-group>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss" scoped>
#div-scorecard-details {
  .row {
    margin-bottom: 10px;
  }

  .row .col {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

<script>
export default {
  props: ["type", "artificialDate"],
  data() {
    return {
      scorecard: {
        type: 0,
        step: 1,

        ngf_card_id: "",
        date: this.$dayjs().format("YYYY-MM-DD"),
        time: this.$dayjs().format("HH:mm"),

        remarks: "",
        marker: "",

        course: 2,
        loop: "",
        tee: "",
        category: "",

        course_name: "",
        loop_name: "",
        tee_name: "",
        course_country_code: "NL",

        handicap:
            Object.assign(this.$ls.getItem("currentUser")).relHandicap == null
                ? 54
                : Object.assign(this.$ls.getItem("currentUser")).relHandicap,
        courserate: "",
        sloperate: "",
        total_par: "",

        total_stableford: "",
        playingHandicap: "-",

        holes: [],

        format_of_play: 1,
        is_competition: false,
        is_qualifying: true,
      },
      scorecardType: [
        {
          id: 1,
          label: "Binnenland",
        },
        {
          id: 2,
          label: "Buiteland",
        },
      ],
      holes_array: [
        {
          id: 1,
          label: "9 Holes",
        },
        {
          id: 101,
          label: "18 Holes",
        },
      ],
      scorecardRules: {
        date: [
          {
            required: true,
            message: "Please input datum",
            trigger: "blur",
            date: this.$dayjs(),
          },
        ],
        time: [
          {
            required: true,
            message: "Please input tijd",
            trigger: "blur",
          },
        ],
        course: [
          {
            required: true,
            message: "Please select Baan",
            trigger: "change",
          },
        ],
        loop: [
          {
            required: true,
            message: "Please select Lus",
            trigger: "change",
          },
        ],
        bltId: [
          {
            required: true,
            message: "Please select Tee",
            trigger: "change",
          },
        ],
      },
      teeSoorten: [],
      banen: [],
      countries: [],
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      banenSelectOptions: [],
      baan: [],
      lus: [],
    };
  },
  created() {
    this.loadBanen();
    this.loadCountries();
  },
  computed: {
    genderTeeList: function () {
      let that = this;
      let result = [];
      let femaleTees = [13, 14, 15, 16, 17];
      this.lus.baan_lus_tees.forEach(function (item) {
        if (that.$ls.getItem("currentUser").value.relGender == 1) {
          if (!femaleTees.includes(item.bltCategory)) {
            result.push(item);
          }
        } else {
          if (femaleTees.includes(item.bltCategory)) {
            result.push(item);
          }
        }
      });
      return result;
    },
    tee: function () {
      return this.teeSoorten.find(item => item.Category == this.scorecard.category);
    },
    teeName: function () {
      if (this.tee == null) {
        return "";
      }

      return this.tee.Omschrijving;
    },
    teeFont: function () {
      if (this.tee == null) {
        return "bg-grey-2";
      }

      return "bg-grey-10";
    },
    par: function () {
      let result = 0;
      this.scorecard.holes.forEach(function (hole) {
        result += hole.par;
      });
      return result;
    },
    banenArry: function () {
      let result = [];
      this.banen.forEach(function (baan) {
        result.push({label: baan.baaClubName, value: baan.baaId});
      });
      return result;
    },
    validDate: function () {
      if (this.scorecard.date == "" || this.scorecard.date == null) {
        return false;
      }

      console.log(this.artificialDate);

      let artDate = new Date(this.artificialDate);
      let varDate = new Date(this.scorecard.date);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      varDate.setHours(0, 0, 0, 0);

      if (varDate > today) {
        return [(val) => false || "Datum mag niet in de toekomst liggen"];
      }

      if (varDate < today.setDate(today.getDate() - 5)) {
        return [
          (val) =>
              false || "Datum mag niet meer dan 5 dagen in het verleden liggen",
        ];
      }

      if (varDate < artDate) {
        return [(val) => false || "Datum mag niet voor eerste kaart liggen"];
      }

      return [(val) => true || ""];
    },
    isStepValid: function () {
      if (this.scorecard.step == 1 && this.scorecard.date.length > 0) {
        if (this.$refs.date == undefined) {
          return true;
        } else {
          return !this.$refs.date.hasError;
        }
      }
      if (this.scorecard.step == 2) {
        return (
            this.scorecard.course_name.length > 0 &&
            this.scorecard.loop_name.length > 0 &&
            this.scorecard.tee_name.length > 0
        );
      }
      if (this.scorecard.step == 3) {
        return (
            this.scorecard.courserate > 20 &&
            this.scorecard.courserate < 100 &&
            this.scorecard.sloperate > 0 &&
            this.scorecard.sloperate < 100 &&
            this.scorecard.total_par > 0 &&
            this.scorecard.total_par < 100
        );
      }
      if (this.scorecard.step == 4) {
        return (
            this.scorecard.total_stableford > 20 &&
            this.scorecard.total_stableford < 100 &&
            !this.gsnIsInvalid
        );
      }
      return false;
    },
    validCourseRating: function () {
      return [
        (val) =>
            (this.scorecard.courserate > 0 && this.scorecard.courserate < 100) ||
            "Waarde van de courserating moet tussen 0 en 100 liggen",
      ];
    },
    validSlopeRating: function () {
      return [
        (val) =>
            (this.scorecard.sloperate > 0 && this.scorecard.sloperate < 100) ||
            "Waarde van de sloperating moet tussen 0 en 100 liggen",
      ];
    },
    validTotalPar: function () {
      return [
        (val) =>
            (this.scorecard.total_par > 0 && this.scorecard.total_par < 100) ||
            "Waarde van de par moet tussen 0 en 100 liggen",
      ];
    },
    validStableford: function () {
      return [
        (val) =>
            (this.scorecard.total_stableford > 0 &&
                this.scorecard.total_stableford < 100) ||
            "Waarde van de stablefordpunten moet tussen 0 en 100 liggen",
      ];
    },
    validGsn: function () {
      return [
        (val) =>
            !this.gsnIsInvalid ||
            "Voer een geldig GSN nummer in of laat het veld leeg",
      ];
    },
    gsnIsInvalid: function () {
      if (this.scorecard.marker.length > 0) {
        if (this.scorecard.marker.length < 10) {
          return true;
        } else if (this.scorecard.marker.length > 10) {
          return true;
        } else if (isNaN(parseInt(this.scorecard.marker.substr(2, 8)))) {
          return true;
        } else if (!/[A-Z]/.test(this.scorecard.marker.substr(0, 1))) {
          return true;
        } else if (!/[A-Z]/.test(this.scorecard.marker.substr(1, 2))) {
          return true;
        } else if (this.scorecard.marker == "NL00000000") {
          return true;
        }
      }
      return false;
    },
  },
  methods: {

    teeColor: function (tee) {

      if([7,17].indexOf(tee.bltCategory) > -1) {
        return "bg-grey-6";
      } else if([9,13].indexOf(tee.bltCategory) > -1) {
        return "bg-yellow-6";
      } else if([10,14].indexOf(tee.bltCategory) > -1) {
        return "bg-blue-6";
      } else if([11,15].indexOf(tee.bltCategory) > -1) {
        return "bg-red-6";
      } else if([12,16].indexOf(tee.bltCategory) > -1) {
        return "bg-orange-6";
      } else if(tee.bltCategory == 8) {
        return "bg-white";
      }

      return "bg-grey-6";
    },

    setStep: function (value) {
      if (this.scorecard.step == 1 && value == -1) {
        return;
      }
      this.scorecard.step += value;
    },

    getTeeName: function (id) {
      let result = null;
      this.teeSoorten.forEach((item) => {
        if (item.Category == id) {
          result = item.Omschrijving;
        }
      });
      return result;
    },

    getTeeAdvise: function (id) {
      let result = "";
      this.teeSoorten.forEach((item) => {
        if (item.Category == id) {
          result =
              this.currentUser.relHandicap <= item.HcpMin &&
              this.currentUser.relHandicap >= item.HcpMax
                  ? "advies "
                  : "";
        }
      });
      return result;
    },

    getTeeColor: function (id) {
      let result = null;
      this.teeSoorten.forEach((item) => {
        if (item.Category == id) {
          result = item.Achtergrond;
        }
      });
      return result;
    },

    handleNewScorecard(type) {
      this.scorecard.type = type;
      this.scorecard.step = 1;

      if (type > 0) {
        this.scorecard.name = type == 1 ? "Binnenland" : "Buitenland";
      }

      if (type == 1) {
        this.scorecard.course = 2;
        this.onChangeBaan(this.scorecard.course);
      }

      if (type == 2) {
        this.scorecard.course = 993;
        this.scorecard.course_country_code = "DE";
      }
    },

    onSaveScorecard: function () {
      this.$emit("handleNewScorecard", this.scorecard);
    },

    onCancelScorecard: function () {
      this.scorecard = {
        type: 0,
        step: 1,

        ngf_card_id: "",
        date: this.$dayjs().format("DD/MM/YYYY"),
        time: "09:00",

        remarks: "",
        marker: "",

        course: 1,
        loop: "",
        tee: "",
        category: "",

        course_name: "",
        loop_name: "",
        tee_name: "",
        course_country_code: "NL",

        handicap:
            Object.assign(this.$ls.getItem("currentUser")).relHandicap == null
                ? 54
                : Object.assign(this.$ls.getItem("currentUser")).relHandicap,
        courserate: "",
        sloperate: "",
        total_par: "",

        total_stableford: "",
        playingHandicap: "-",

        holes: [],

        format_of_play: 1,
        is_competition: false,
        is_qualifying: true,
      };

      this.$emit("handleCloseScorecard", false);
    },

    onSummarize: function () {
      this.scorecard.step = 5;
    },

    onChangeBaan: function (baaId) {
      let that = this;
      this.banen.forEach((item) => {
        if (item.baaId == baaId) {
          that.baan = item;
          that.scorecard.course = baaId;
          that.scorecard.course_name = item.baaClubName;
        }
      });
    },

    onChangeLus: function (lus) {
      this.lus = lus;
      this.scorecard.loop = lus.bnlId;
      this.scorecard.loop_name = lus.bnlName;
      this.scorecard.step = 4;
    },

    onChangeTee: function (tee) {
      this.scorecard.tee = tee.bltCategory;
      this.scorecard.category = tee.bltCategory;
      this.scorecard.courserate = tee.bltCourseRating;
      this.scorecard.sloperate = tee.bltSlopeRating;

      this.scorecard.tee_name = this.teeName;

      this.scorecard.holes = [];
      for (let i = 1; i <= 18; i++) {
        this.scorecard.holes.push({
          number: i,
          distance: tee["bltLng" + i],
          par: tee["bltPar" + i],
          strokeindex: tee["bltSi" + i],
          personal_par: 0,
          stableford: 0,
          strokes: 0,
          adjusted_strokes: 0,
          is_computed: 0,
        });
      }

      this.scorecard.total_par = this.par;

      this.scorecard.step = 5;
    },

    loadBanen() {
      let that = this;
      this.$http.get("golfer/handicap/banen").then((res) => {
        this.banen = res.data.banen;
        this.teeSoorten = res.data.teeSoorten;
        this.banenSelectOptions = this.banenArry;

        this.handleNewScorecard(that.type);
      });
    },

    loadCountries() {
      this.$http.get("golfer/handicap/getCountries").then((res) => {
        this.countries = res.data;
      });
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.banenSelectOptions = this.banenArry;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.banenSelectOptions = this.banenArry.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
};
</script>
