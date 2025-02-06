<template>
  <div>
    <q-separator class="q-mt-md q-mb-md"/>
    <div class="text-h6">Betaalwijze</div>
    <q-option-group
      v-model="localForm.payType"
      :options="payTypeArray"
    />
    <div class="row text-h6">Leveringsvoorwaarden:</div>
    <div
      class="row q-pa-sm"
      style="
                border: 1px solid lightgrey;
                height: 100px;
                font-size: 10px;
                overflow-y: scroll;
              "
    >
      {{ conditions }}
    </div>
    <q-checkbox
      v-model="localForm.agreeConditions"
      :rules="[(val) => !!val || '* Required']"
      class="q-mb-sm"
      label="Ik ga akkoord met de leveringsvoorvaarden"
      stack-label
    />
    <q-checkbox
      v-model="localForm.agreeCommerce"
      :rules="[(val) => !!val || '* Required']"
      class="q-mb-sm"
      label="Stuur mij aanbiedingen"
      stack-label
    />
  </div>
</template>

<script>

export default {
  name: "proCourseConfirm",
  props: {
    form: Object,
  },
  data() {
    return {
      localForm: this.form,
      payTypeArray: [
        {label: "Op de baan", value: "onCourse"},
        {label: "iDeal", value: "iDeal"},
      ],
    };
  },
  computed: {
    conditions: function () {
      if (this.$store.state.settings === null) {
        return "";
      }
      return this.$store.state.settings.item.website_payment_conditions;
    },

  },
};
</script>
