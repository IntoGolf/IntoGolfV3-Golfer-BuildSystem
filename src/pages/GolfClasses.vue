<template>
  <div>
    <div v-if="!ProCourse" class="q-pa-md">
      <div class="row justify-center">
        <div class="col text-center text-h5">Ons cursus aanbod</div>
      </div>
      <q-separator class="q-mt-sm" />
      <div v-if="ProCourseArray.length === 0" class="row">
        <div class="col text-h6 q-mt-xl">
          Er zijn momenteel geen cursussen beschikbaar.
        </div>
      </div>
      <div v-else class="row">
        <div class="col">
          <div
            v-for="(item, key) in ProCourseArray"
            :key="key"
            class="flex-container div-pro-course"
          >
            <div class="row text-bold">
              <div class="col-6">Cursus: {{ item.pcsName }}</div>
              <div class="col-6 text-right">
                Start:
                {{ $filters.unixToDate(item.pcsDateFrom, "dddd D MMMM") }}
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-4">Tijd</div>
              <div class="col-8">
                :
                {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedFrom) }}
                tot
                {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedTo) }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Aantal lessen</div>
              <div class="col-8">: {{ item.pro_lessons.length }}</div>
            </div>
            <div class="row">
              <div class="col-4">Lessen datums</div>
              <div class="col-8">: {{ lessonsText(item) }}</div>
            </div>
            <div class="row">
              <div class="col-4">Beschikbare plaatsen</div>
              <div class="col-8">
                :
                {{ item.available_spots }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Kosten</div>
              <div class="col-8">: € 295,-</div>
            </div>
            <div class="row">
              <div class="col">
                {{ item.pro_lesson_type.pltNotes }}
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col text-right">
                <q-btn
                  color="primary"
                  label="Details"
                  size="sm"
                  v-on:click="ProCourse = item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="ProCourse && !subscribe" class="pro-course-card">
      <div class="row justify-center q-mt-md q-mb-md">
        <div class="col text-center text-h5">
          Cursus {{ ProCourse.pcsName }}
        </div>
      </div>
      <q-separator class="q-mb-md" />
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col-4">Eerste les</div>
            <div class="col-8">
              :
              {{ $filters.unixToDate(ProCourse.pcsDateFrom, "dddd D MMMM") }}
            </div>
          </div>

          <div class="row">
            <div class="col-4">Tijd</div>
            <div class="col-8">
              :
              {{
                $filters.minuteToTime(ProCourse.pro_lessons[0].lesBlockedFrom)
              }}
              tot
              {{ $filters.minuteToTime(ProCourse.pro_lessons[0].lesBlockedTo) }}
            </div>
          </div>
          <div class="row">
            <div class="col-4">Aantal lessen</div>
            <div class="col-8">: {{ ProCourse.pro_lessons.length }}</div>
          </div>
          <div class="row">
            <div class="col-4">Lessen datums</div>
            <div class="col-8">: {{ lessonsText(ProCourse) }}</div>
          </div>
          <div class="row">
            <div class="col-4">Beschikbare plaatsen</div>
            <div class="col-8">
              :
              {{ ProCourse.available_spots }}
            </div>
          </div>
          <div class="row">
            <div class="col-4">Kosten</div>
            <div class="col-8">: € 295,-</div>
          </div>
          <q-separator
            v-show="ProCourse.pcsText != null && ProCourse.pcsText.length > 0"
            class="q-mt-md"
          />
          <div class="row">
            <div id="course-text" class="col" v-html="ProCourse.pcsText" />
          </div>
          <hr />
          <div class="row">
            <div class="col text-right">
              <q-btn
                color="primary"
                flat
                label="Terug naar cursussen"
                size="sm"
                v-on:click="ProCourse = null"
              />
              <q-btn
                v-if="!ProCourse.full"
                color="primary"
                label="Inschrijven"
                size="sm"
                v-on:click="onSubscribe"
              />
              <div v-else class="q-mr-md text-bold">Vol</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <sign-up
      v-else-if="subscribe"
      :ProCourse="ProCourse"
      v-on:onCloseSignUp="onCloseSignUp"
    />
  </div>
</template>

<style>
#course-text {
  margin-top: 20px;
}

#course-text p {
  margin-bottom: 0 !important;
}

.pro-course-card {
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
}

.div-pro-course {
  margin: 5px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 4px;
}
</style>

<script>
import signUp from "./SignUp.vue";

export default {
  components: { signUp },
  data() {
    return {
      ProCourseArray: [],
      ProCourse: null,
      subscribe: false,
    };
  },
  created() {
    this.$http.get("golfer/classes").then((res) => {
      this.ProCourseArray = res;
    });
  },
  watch: {},
  computed: {},
  methods: {
    onSubscribe: function () {
      this.subscribe = true;
    },
    onCloseSignUp: function () {
      this.subscribe = false;
      this.ProCourse = null;
    },
    lessonsText: function (item) {
      let result = "";
      for (let i = 0; i < item.pro_lessons.length; i++) {
        result +=
          (i > 0 ? ", " : "") +
          this.$filters.unixToDate(item.pro_lessons[i].lesDate, "D/M");
      }
      return result;
    },
  },
};
</script>
