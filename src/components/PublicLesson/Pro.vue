<template>
  <div>
    <div class="row">
      <div class="col q-pt-sm text-bold text-center">
        <q-img
          :fit="'cover'"
          :src="image"
          style="max-width: 180px; height: 150px"
        >
          <div class="absolute-bottom text-center">
            {{ pro.full_name2 }}
          </div>
        </q-img>
      </div>
    </div>
    <div class="row hide-scrollbar" style="overflow-y: scroll">
      <comp-lessons
        :lessonType="lessonType"
        :lessons="lessons"
        :per="per"
        :pro="pro"
        v-on:handleBook="handleBook"
      />
    </div>
  </div>
</template>

<script>
import compLessons from "./Lessons.vue";

export default {
  components: { compLessons },
  props: {
    pro: Object,
    lessons: Array,
    per: Object,
    lessonType: Object,
  },
  data: function () {
    return {
      image: null,
    };
  },
  mounted() {
    this.$http.get("public/image?name=" + this.pro.proImage).then((res) => {
      this.image = "data:image/png;base64," + res;
    });
  },
  methods: {
    handleBook: function (lesson) {
      this.$emit("handleBook", lesson);
    },
  },
};
</script>
