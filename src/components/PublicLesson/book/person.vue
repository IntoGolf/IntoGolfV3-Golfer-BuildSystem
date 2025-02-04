<template>
  <div>
    <q-input
      v-model="ProLessonClient.plcName"
      :rules="[(val) => !!val || '* Required']"
      class="q-mb-sm"
      label="Naam"
      lazy-rules
    />
    <q-input
      v-model="ProLessonClient.plcEmail"
      :rules="[emailRule]"
      class="q-mb-sm"
      label="E-mailadres"
      lazy-rules
    />
    <q-input
      v-model="ProLessonClient.plcPhone"
      :rules="[(val) => !!val || '* Required']"
      class="q-mb-lg"
      label="Telefoonummer"
      lazy-rules
      mask="###############"
    />
  </div>
</template>

<script>
export default {
  name: "publicLessonPerson",
  data() {
    return {
      ProLessonClient: {
        plcName: "laurens",
        plcPhone: "0172617000",
        plcEmail: "laurens+331@intogolf.nl",
      },
    };
  },
  methods: {},
};
</script>
