<template>
  <div>
    <q-separator class="q-mb-md q-mt-md" />

    <div class="q-mb-sm">Voer de gegevens van de les deelnemers in</div>

    <q-tabs
      v-model="localTab"
      dense
      indicator-color="green"
      inline-label
      @update:model-value="checkForm"
    >
      <q-tab
        v-for="(person, key) in proLesson.ProLessonClient"
        :key="key"
        :label="getTabName(key)"
        :name="'person' + key"
        icon="person"
      />
    </q-tabs>

    <q-form ref="formRelation">
      <q-tab-panels v-model="localTab">
        <q-tab-panel
          v-for="(person, key) in proLesson.ProLessonClient"
          :key="key"
          :name="'person' + key"
          class="q-pa-none q-pt-md"
        >
          <div v-if="key === 0">
            <div class="text-h6">Jouw gegevens</div>
            <div class="row">
              <div class="col-8">
                <q-input
                  v-model="relation.relCallName"
                  :rules="[(val) => !!val || '* Required']"
                  class="q-mb-sm"
                  dense
                  label="Voornaam"
                  lazy-rules
                />
              </div>
              <div class="col-1">&nbsp;</div>
              <div class="col-3">
                <q-input
                  v-model="relation.relPrefix"
                  class="q-mb-lg"
                  dense
                  label="Tussenvoegsel"
                />
              </div>
            </div>
            <q-input
              v-model="relation.relName"
              :rules="[(val) => !!val || '* Required']"
              class="q-mb-sm"
              dense
              label="Achternaam"
              lazy-rules
            />
            <q-input
              v-model="relation.relEmail"
              :rules="[emailRule]"
              class="q-mb-sm"
              dense
              label="E-mailadres"
              lazy-rules
            />
            <q-input
              v-model="relation.relPhoneMobile"
              :rules="[(val) => !!val || '* Required']"
              class="q-mb-lg"
              dense
              label="Telefoonummer"
              lazy-rules
              mask="###############"
            />
          </div>
          <div v-else>
            <div class="text-h6">Deelnemer {{ key + 1 }}</div>
            <q-input
              v-model="person.plcName"
              :rules="[(val) => !!val || '* Required']"
              class="q-mb-sm"
              dense
              label="Naam"
              lazy-rules
            />
            <q-input
              v-model="person.plcEmail"
              :rules="[emailRule]"
              class="q-mb-sm"
              dense
              label="E-mailadres"
              lazy-rules
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-form>
  </div>
</template>

<script>
export default {
  name: "publicLessonRegister",
  props: {
    lesson: Object,
    proLesson: Object,
    tab: String,
  },
  data() {
    return {
      prevTab: "person0",
      localTab: this.tab,
      relation: {
        relName: "luder",
        relPrefix: "",
        relCallName: "laurens",
        relGender: 1,
        relEmail: "laurens@intogolf.nl",
        relPhoneMobile: "06110457700",
      },
      emailRule: (val) =>
        /.+@.+\..+/.test(val) || "Voer een geldig e-mailadres in",
      numberRule: (val) => {
        const num = parseFloat(val.replace(",", "."));
        return (
          (!isNaN(num) && num >= -9.9 && num <= 54) ||
          "Voer een geldig nummer in tussen -9,9 en 54"
        );
      },
    };
  },
  watch: {
    tab(newValue) {
      if (this.localTab !== newValue) {
        this.localTab = newValue;
        this.checkForm(this.localTab);
      }
    },
  },
  methods: {
    getTabName(key) {
      return key + 1;
    },
    checkForm(newTab) {
      const prevTabIndex = parseInt(this.prevTab.substring(6, 7));
      const newTabIndex = parseInt(this.localTab.substring(6, 7));

      if (newTabIndex - prevTabIndex > 1) {
        this.localTab = this.prevTab;
        return;
      }

      if (
        newTab === "person1" &&
        (!this.relation.relName ||
          !this.relation.relCallName ||
          !this.relation.relEmail ||
          !this.relation.relPhoneMobile)
      ) {
        this.$q.notify({
          type: "negative",
          message: "Vul alle velden in!",
          position: "center",
          timeout: 100,
        });
        this.localTab = "person0";
        return;
      }

      if (
        newTab === "person2" &&
        (!this.proLesson.ProLessonClient[1].plcName ||
          !this.proLesson.ProLessonClient[1].plcEmail)
      ) {
        this.$q.notify({
          type: "negative",
          message: "Vul alle velden in!",
          position: "center",
          timeout: 100,
        });
        this.localTab = "person1";
        return;
      }

      if (
        newTab === "person3" &&
        (!this.proLesson.ProLessonClient[2].plcName ||
          !this.proLesson.ProLessonClient[2].plcEmail)
      ) {
        this.$q.notify({
          type: "negative",
          message: "Vul alle velden in!",
          position: "center",
          timeout: 100,
        });
        this.localTab = "person2";
        return;
      }

      if (
        newTab === "person4" &&
        (!this.proLesson.ProLessonClient[3].plcName ||
          !this.proLesson.ProLessonClient[3].plcEmail)
      ) {
        this.$q.notify({
          type: "negative",
          message: "Vul alle velden in!",
          position: "center",
          timeout: 100,
        });
        this.localTab = "person3";
        return;
      }

      this.$emit("setTab", this.localTab);
      this.prevTab = this.localTab;
    },
  },
};
</script>
