<template>
  <div>
    <q-separator class="q-mt-md q-mb-md" />

    <div class="text-h6">Hoe wil je betalen?</div>
    <q-option-group
      v-model="localProLesson.payMethod"
      :options="paymentOptions"
    />

    <q-separator class="q-mt-md q-mb-md" />

    <div class="row text-h6">Leveringsvoorwaarden:</div>
    <div
      class="row q-pa-sm"
      style="
        border: 1px solid lightgrey;
        height: 150px;
        font-size: 10px;
        overflow-y: scroll;
      "
    >
      {{ conditions }}
    </div>
    <div class="row q-mt-md">
      <q-checkbox
        v-model="localProLesson.agreeConditions"
        :rules="[(val) => !!val || '* Required']"
        class="q-mb-sm"
        label="Ik ga akkoord met de leveringsvoorvaarden"
        stack-label
      />
    </div>
    <div class="row">
      <q-checkbox
        v-model="localProLesson.agreeCommerce"
        :rules="[(val) => !!val || '* Required']"
        class="q-mb-sm"
        label="Stuur mij aanbiedingen"
        stack-label
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "publicLessonConfirm",
  props: {
    date: String,
    lesson: Object,
    proLesson: Object,
    paymentOptions: Array,
  },
  data() {
    return {
      localProLesson: this.proLesson,
    };
  },
};
</script>
