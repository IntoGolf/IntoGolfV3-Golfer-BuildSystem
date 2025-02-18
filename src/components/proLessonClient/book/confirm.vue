<template>
  <div>
    <q-separator class="q-mt-md q-mb-md"/>

    <div class="text-h6">Hoe wil je betalen?</div>
    <q-option-group
      v-model="lForm.payMethod"
      :options="paymentOptions"
    />

    <q-separator class="q-mt-md q-mb-md"/>

    <div class="row text-h6">Leveringsvoorwaarden:</div>
    <div
      class="row q-pa-sm"
      style="
        border: 1px solid lightgrey;
        height: 150px;
        font-size: 12px;
        overflow-y: scroll;
      "
    >
      {{ conditions }}
    </div>
    <div class="row q-mt-md">
      <q-checkbox
        v-model="lForm.agreeConditions"
        :rules="[(val) => !!val || '* Required']"
        class="q-mb-sm"
        label="Ik ga akkoord met de leveringsvoorvaarden"
        stack-label
      />
    </div>
    <div class="row">
      <q-checkbox
        v-model="lForm.agreeCommerce"
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
  name: "publicLessonClientConfirm",
  props: {
    form: Object,
  },
  data() {
    return {
      lForm: this.form,
      paymentOptions: [
        {label: "op de baan", value: "onCourse"},
        {label: "via iDeal", value: "iDeal"},
      ],
    };
  },
  computed: {
    conditions: function () {
      if (this.$store.getters['settings/publicItems'] === null) {
        return "";
      }
      return this.$store.getters['settings/publicItems'].website_payment_conditions;
    },
  }
};
</script>
