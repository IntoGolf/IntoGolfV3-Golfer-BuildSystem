<template>
  <q-page>
    <q-card>
      <q-card-section class="text-h6">
        Nieuwe scorekaart {{ scorecard.name }}
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-pt-none">
        <!--National scorecard-->
        <div v-if="scorecard.type === 1">
          <!--Step 1: date and time-->
          <div v-if="scorecard.step === 1">
            <q-input
              v-show="scorecard.step === 1"
              ref="date"
              v-model="scorecard.date"
              :rules="validDate"
              label="Datum"
              lazy-rules
              type="date"
            />

            <q-input
              v-show="scorecard.step === 1"
              v-model="scorecard.time"
              lazy-rules
              mask="time"
              type="time"
            />

            <q-input
              v-show="scorecard.step === 1"
              ref="gsn"
              v-model="scorecard.marker"
              :rules="validGsn"
              hint="Type hier het GSN (NL00000000) van de marker"
              label="Marker"
              mask="AA########"
              type="text"
            />

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                :disabled="gsnIsInvalid || !scorecard.date || !scorecard.time"
                color="primary"
                icon-right="navigate_next"
                label="Baan"
                @click="scorecard.step = 2"
              />
            </q-btn-group>
          </div>

          <!--Step 2: course-->
          <div v-if="scorecard.step === 2">
            <q-select
              v-model="scorecard.course"
              :options="banenArry"
              behavior="menu"
              emit-value
              map-options
              use-input
              @input-value="filterBanen"
            >
            </q-select>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                color="primary"
                icon="navigate_before"
                label="datum"
                @click="scorecard.step = 1"
              />
              <q-btn
                :disabled="!scorecard.course"
                color="primary"
                icon-right="navigate_next"
                label="Lus"
                @click="scorecard.step = 3"
              />
            </q-btn-group>
          </div>

          <!--Step 3: lus-->
          <div v-if="scorecard.step === 3">
            <q-list bordered separator>
              <q-item
                v-for="(lus, index) in baan.baan_lussen"
                v-bind:key="index"
                v-ripple
                class="itg-q-item"
                clickable
                @click="onChangeLus(lus)"
              >
                <q-item-section>
                  <q-item-label class="itg-text-overflow"
                    >{{ lus.bnlName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn-group class="q-mt-lg" spread>
              <q-btn
                color="primary"
                icon="navigate_before"
                label="Baan"
                @click="scorecard.step = 2"
              />
            </q-btn-group>
          </div>

          <!--Step 4: tee -->
          <div v-if="scorecard.step === 4">
            <q-list bordered separator>
              <q-item
                v-for="(tee, index) in genderTeeList"
                v-bind:key="index"
                v-ripple
                class="itg-q-item"
                clickable
                @click="onChangeTee(tee)"
              >
                <q-item-section>
                  <q-item-label class="itg-text-overflow">
                    <q-icon
                      :class="teeColor(tee)"
                      class="fal fa-golf-ball"
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
                color="primary"
                icon="navigate_before"
                label="Lus"
                @click="scorecard.step = 3"
              />
            </q-btn-group>
          </div>

          <!--Step 5: confirmation-->
          <div v-if="scorecard.step === 5" id="div-scorecard-details">
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
                {{ baan.baaName }}
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
                color="primary"
                icon="navigate_before"
                @click="scorecard.step = 4"
              />

              <q-btn color="primary" icon="check" @click="onSaveScorecard" />

              <q-btn color="primary" icon="close" @click="onCancelScorecard" />
            </q-btn-group>
          </div>
        </div>

        <!--Foreign scorecard-->
        <div v-else-if="scorecard.type === 2">
          <q-form class="q-gutter-sm">
            <q-input
              v-show="scorecard.step === 1"
              ref="date"
              v-model="scorecard.date"
              :rules="validDate"
              label="Datum"
              lazy-rules
              type="date"
            />

            <q-input
              v-show="scorecard.step === 1"
              v-model="scorecard.time"
              label="Tijd"
              lazy-rules
              mask="time"
              type="time"
            />

            <q-select
              v-show="scorecard.step === 1"
              v-model="scorecard.course_country_code"
              :options="countries"
              emit-value
              label="Land"
              map-options
              option-label="couName"
              option-value="couIsoCode"
            />

            <q-input
              v-show="scorecard.step === 2"
              v-model="scorecard.course_name"
              :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige baan naam',
              ]"
              hint="Type hier de naam van de speelde baan"
              label="Baan"
              lazy-rules
            />

            <q-select
              v-show="scorecard.step === 2"
              v-model="scorecard.loop"
              :options="holes_array"
              behavior="menu"
              hint="Selecteer de gespeelde lus"
              label="Holes"
            />

            <q-input
              v-show="scorecard.step === 2"
              v-model="scorecard.loop_name"
              :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige lus naam',
              ]"
              hint="Type hier de naam van de speelde lus"
              label="Naam lus"
              lazy-rules
              type="text"
            />

            <q-input
              v-show="scorecard.step === 2"
              v-model="scorecard.tee_name"
              :rules="[
                (val) => (val && val.length > 0) || 'Ongeldige tee naam',
              ]"
              hint="Type hier de naam van de speelde tee"
              label="Naam tee"
              lazy-rules
              type="text"
            />

            <q-input
              v-show="scorecard.step === 3"
              v-model="scorecard.courserate"
              :rules="validCourseRating"
              hint="Voer hier de courserating in van de gespeelde baan"
              label="Courserating"
              lazy-rules
              type="number"
            />

            <q-input
              v-show="scorecard.step === 3"
              v-model="scorecard.sloperate"
              :rules="validSlopeRating"
              hint="Voer hier de sloperating in van de gespeelde baan"
              label="Sloperating"
              lazy-rules
              type="number"
            />

            <q-input
              v-show="scorecard.step === 3"
              v-model="scorecard.total_par"
              :rules="validTotalPar"
              hint="Voer hier de par in van de gespeelde baan"
              label="Par"
              lazy-rules
              type="number"
            />

            <q-input
              v-show="scorecard.step === 4"
              v-model="scorecard.total_stableford"
              :rules="validStableford"
              hint="Voer hier aantal stableford punten in"
              label="Punten"
              lazy-rules
              type="number"
            />

            <q-input
              v-show="scorecard.step === 4"
              ref="gsn"
              v-model="scorecard.marker"
              :rules="validGsn"
              hint="Type hier het GSN (NL00000000) van de marker"
              label="Marker"
              mask="AA########"
              type="text"
            />

            <q-input
              v-show="scorecard.step === 4"
              v-model="scorecard.remarks"
              hint="Heeft u een opmerking voer deze hier in"
              label="Opmerking"
              type="text"
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
                  v-show="scorecard.step === 4"
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
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    type: Number,
    artificialDate: Date,
  },
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
        course_country_code: "BE",

        handicap:
          this.currentUser.relHandicap === null
            ? 54
            : this.currentUser.relHandicap,
        courserate: "",
        sloperate: "",
        total_par: "",

        total_stableford: "",
        playingHandicap: "-",

        holes: [],

        format_of_play: 1,
        is_competition: 0,
        is_qualifying: 1,
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
      banenSelectOptions: [],
      baanFilter: "",
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
        if (that.currentUser.relGender === 1) {
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
      return this.teeSoorten.find(
        (item) => item.Category === this.scorecard.category
      );
    },
    teeName: function () {
      if (this.tee === null) {
        return "";
      }

      return this.tee.Omschrijving;
    },
    teeFont: function () {
      if (this.tee === null) {
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
      let array = this.banen;
      if (this.baanFilter !== "") {
        array = this.banen.filter(
          (baan) => baan.baaClubName.toLowerCase().indexOf(this.baanFilter) > -1
        );
      }
      return array.map((baan) => ({
        label: baan.baaClubName,
        value: baan.baaId,
      }));
    },
    baan: function () {
      return this.banen.find((baan) => baan.baaId === this.scorecard.course);
    },
    validDate: function () {
      if (this.scorecard.date === "" || this.scorecard.date === null) {
        return false;
      }

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
      if (this.scorecard.step === 1 && this.scorecard.date.length > 0) {
        if (this.$refs.date === undefined) {
          return true;
        } else {
          return !this.$refs.date.hasError;
        }
      }
      if (this.scorecard.step === 2) {
        return (
          this.scorecard.course_name.length > 0 &&
          this.scorecard.loop_name.length > 0 &&
          this.scorecard.tee_name.length > 0
        );
      }
      if (this.scorecard.step === 3) {
        return (
          this.scorecard.courserate > 20 &&
          this.scorecard.courserate < 100 &&
          this.scorecard.sloperate > 0 &&
          this.scorecard.sloperate < 200 &&
          this.scorecard.total_par > 0 &&
          this.scorecard.total_par < 100
        );
      }
      if (this.scorecard.step === 4) {
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
          (this.scorecard.sloperate > 0 && this.scorecard.sloperate < 200) ||
          "Waarde van de sloperating moet tussen 0 en 200 liggen",
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
        } else if (this.scorecard.marker === "NL00000000") {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    teeColor: function (tee) {
      if ([7, 17].indexOf(tee.bltCategory) > -1) {
        return "bg-grey-6";
      } else if ([9, 13].indexOf(tee.bltCategory) > -1) {
        return "bg-yellow-6";
      } else if ([10, 14].indexOf(tee.bltCategory) > -1) {
        return "bg-blue-6";
      } else if ([11, 15].indexOf(tee.bltCategory) > -1) {
        return "bg-red-6";
      } else if ([12, 16].indexOf(tee.bltCategory) > -1) {
        return "bg-orange-6";
      } else if (tee.bltCategory === 8) {
        return "bg-white";
      }

      return "bg-grey-6";
    },

    setStep: function (value) {
      if (this.scorecard.step === 1 && value === -1) {
        return;
      }
      this.scorecard.step += value;
    },

    getTeeName: function (id) {
      let result = null;
      this.teeSoorten.forEach((item) => {
        if (item.Category === id) {
          result = item.Omschrijving;
        }
      });
      return result;
    },

    getTeeAdvise: function (id) {
      let result = "";
      this.teeSoorten.forEach((item) => {
        if (item.Category === id) {
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
        if (item.Category === id) {
          result = item.Achtergrond;
        }
      });
      return result;
    },

    handleNewScorecard(type) {
      this.scorecard.type = type;
      this.scorecard.step = 1;

      if (type > 0) {
        this.scorecard.name = type === 1 ? "Binnenland" : "Buitenland";
      }

      if (type === 1) {
        this.scorecard.course = this.currentUser.relHomeClub;
      }

      if (type === 2) {
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
        course_country_code: "BE",

        handicap:
          this.currentUser.relHandicap === null
            ? 54
            : this.currentUser.relHandicap,
        courserate: "",
        sloperate: "",
        total_par: "",

        total_stableford: "",
        playingHandicap: "-",

        holes: [],

        format_of_play: 1,
        is_competition: 0,
        is_qualifying: 1,
      };

      this.$emit("handleCloseScorecard", true);
    },

    onSummarize: function () {
      this.scorecard.step = 5;
    },

    onChangeLus: function (lus) {
      this.lus = lus;
      this.scorecard.loop = lus.bnlLusNr;
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
      this.$http.get("golfer/courses").then((res) => {
        this.banen = res.data.data;
        this.teeSoorten = []; //res.teeSoorten;

        this.handleNewScorecard(that.type);
      });
    },

    loadCountries() {
      this.$http.get("golfer/countries").then((res) => {
        this.countries = res.data;
      });
    },
    filterBanen(val) {
      this.baanFilter = val;
    },
  },
};
</script>
