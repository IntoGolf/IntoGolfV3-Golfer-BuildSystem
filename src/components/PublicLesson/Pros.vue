<template>
  <div class="row">
    <div class="col hide-scrollbar" style="overflow-x: scroll">
      <div :style="{ width: colWidth }" class="row q-gutter-sm">
        <div v-for="(pro, key) in proArray" :key="key" class="col">
          <pro
            :lessonType="lessonType"
            :lessons="lessons"
            :per="per"
            :pro="pro"
            v-on:handleBook="handleBook"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pro from "components/PublicLesson/Pro.vue";

export default {
  props: {
    lessons: Array,
    per: Object,
    lessonType: Object,
  },
  components: { Pro },
  computed: {
    colWidth: function () {
      return this.proArray.length * 120 + "px";
    },
    proArray: function () {
      if (this.lessons === undefined) {
        return [];
      }
      let helper = [];
      return this.lessons.reduce((acc, obj) => {
        if (!helper.includes(obj.pro.relNr)) {
          helper.push(obj.pro.relNr);
          acc.push(obj.pro);
        }
        return acc;
      }, []);
    },
  },
  methods: {
    handleBook: function (lesson) {
      console.log("c");
      this.$emit("handleBook", lesson);
    },
  },
};
</script>
