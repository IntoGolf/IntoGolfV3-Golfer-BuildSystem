<template>
  <div>
    <div class="row justify-center q-mt-md q-mb-md">
      <div class="col-12 text-center text-h5">{{ title }}</div>
      <div class="col-12 text-center text-subtitle1">{{ subtitle }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Voornaam</div>
      <div class="col-9">{{ data.relCallName }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Tussenvoegsel</div>
      <div class="col-9">{{ data.relPrefix }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Achternaam</div>
      <div class="col-9">{{ data.relName }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Geboortedatum</div>
      <div class="col-9">
        {{ $dayjs(data.relDateBirth).format("DD-MM-YYYY") }}
      </div>
    </div>

    <hr />

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">E-mailadres</div>
      <div class="col-9">{{ data.relEmail }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Telefoonnummer</div>
      <div class="col-9">{{ data.relPhoneMobile }}</div>
    </div>

    <hr />

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Gsn</div>
      <div class="col-9">{{ data.relGsn }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Handicap</div>
      <div class="col-9">{{ data.relHandicap }}</div>
    </div>

    <hr />

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Straat</div>
      <div class="col-9">{{ data.relAddress1 }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Huisnummer</div>
      <div class="col-9">
        {{ data.relAddressStreetNumber }} {{ data.relAddressStreetAddition }}
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Postcode</div>
      <div class="col-9">{{ data.relPostalCode }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Plaats</div>
      <div class="col-9">{{ data.relCity }}</div>
    </div>

    <hr />

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Lidmaatschap</div>
      <div class="col-9">{{ data.relGrpNr1.grpName }}</div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-3 text-bold">Bedrag</div>
      <div class="col-9">{{ $filters.money(data.relGrpNr1.price) }}</div>
    </div>

    <hr />

    <div v-show="hasConditions">
      <div class="row q-mb-sm">
        <div class="col-12 text-bold">Leveringsvoorwaarden:</div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-12">
          <q-input v-model="conditions" :rows="8" readonly type="textarea" />
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-12">
          <q-checkbox
            v-model="agree"
            label="Ik ga akkoord met de leveringsvoorwaarden"
          />
        </div>
      </div>
    </div>

    <div v-if="false" class="row q-mb-sm">
      <div class="col q-pt-md text-center">
        Betaling vindt plaats via ideal, nadat je op "Betalen" klikt wordt je
        doorgestuurd naar de betaalpagina.
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col q-pt-md text-center">
        <q-btn
          :disable="!agree && hasConditions"
          color="primary"
          label="Inschrijven"
          v-on:click="$emit('onSignUpPay')"
        />
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col text-center">
        <q-btn
          color="primary"
          flat
          label="terug naar formulier"
          v-on:click="$emit('onHideConfirm')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>

.my-card
  min-width: 30%
  max-width: 640px
</style>

<script>
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      title: "Bevestig inschrijving",
      subtitle: "Controleer onderstaande gegevens op juistheid",
      agree: false,
      account: {
        relFirstName: "",
        relCallName: "",
        relPrefix: "",
        relName: "",
        relEmail: "",
        relPhone: "",
        mobile_empPreferLang: "",
        phone_empPreferLang: "",
        relPhoneMobile: "",
        relGsn: "",
        relGender: { value: 1, label: "Man" },
        relHandicap: "",
        repPassword: "",
        confirmRepPassword: "",
        relGrpNr1: Object,
        relPostalCode: "",
        relCity: "",
        relAddressStreetNumber: "",
        relAddressStreetAddition: "",
        relAddress1: "",
        relDateBirth: "",
        ProCourse: this.ProCourse,
      },
    };
  },
  computed: {
    hasConditions() {
      return this.conditions !== 0 && this.conditions.length > 0;
    },
    conditions: function () {
      return this.$store.state.settings.publicItems
        .website_membership_conditions;
    },
  },
};
</script>
