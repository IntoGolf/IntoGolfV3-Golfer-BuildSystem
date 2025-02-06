<template>
  <div>
    <q-separator class="q-mt-md q-mb-md"/>
    <q-input
      v-model="localForm.plcName"
      :rules="[(val) => !!val || '* Required']"
      label="Naam"
    />
    <q-input v-model="localForm.plcEmail" :rules="[emailRule]" label="E-mailadres"/>
    <q-input
      v-model="localForm.plcPhone"
      :rules="[(val) => !!val || '* Required']"
      label="Telefoon"
    />
    <q-input
      v-model="localForm.plcHandicap"
      :rules="[numberRule]"
      label="Speelsterkte"
    />
  </div>
</template>

<script>
export default {
  name: "proCourseGuestForm",
  props: {
    form: Object,
  },
  data() {
    return {
      localForm: this.form,
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
  async created() {
    this.resetForm();
  },
  methods: {
    resetForm() {
      this.localForm = {
        plcName: "Laurens Luder",
        plcEmail: "laurens@intogolf.nl",
        plcPhone: "0172617000",
        plcHandicap: "54",
        payType: "onCourse",
        agreeConditions: false,
        agreeCommerce: false,
      };
    },
    onOpenCourse(item) {
      this.ProCourse = item;
    },
  },
};
</script>
