<template>
  <div>
    <q-separator class="q-mb-md q-mt-md"/>

    <div class="q-mb-sm">Voer de gegevens van de les deelnemers in</div>

    <q-tabs
      v-model="localTab"
      dense
      indicator-color="green"
      inline-label
      @update:model-value="checkForm"
    >
      <q-tab
        v-for="(person, key) in lForm.clients"
        :key="key"
        :label="getTabName(key)"
        :name="'person' + key"
        icon="person"
      />
    </q-tabs>

    <q-form ref="formRelation">
      <q-tab-panels v-model="localTab">
        <q-tab-panel
          v-for="(client, key) in lForm.clients"
          :key="key"
          :name="'person' + key"
          class="q-pa-none q-pt-md"
        >
          <div class="row">
            <div class="col-8">
              <q-input
                v-model="client.firstName"
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
                v-model="client.prefix"
                class="q-mb-lg"
                dense
                label="Tussenvoegsel"
              />
            </div>
          </div>
          <q-input
            v-model="client.lastName"
            :rules="[(val) => !!val || '* Required']"
            class="q-mb-sm"
            dense
            label="Achternaam"
            lazy-rules
          />
          <q-input
            v-model="client.email"
            :rules="[emailRule]"
            class="q-mb-sm"
            dense
            label="E-mailadres"
            lazy-rules
          />
          <q-input
            v-model="client.phone"
            :rules="[(val) => !!val || '* Required']"
            class="q-mb-lg"
            dense
            label="Telefoonummer"
            lazy-rules
            mask="###############"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-form>
  </div>
</template>

<script>
export default {
  name: "publicLessonClientRegister",
  props: {
    form: Object,
    tab: String,
  },
  data() {
    return {
      lForm: this.form,
      prevTab: "person0",
      localTab: this.tab,
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
      if (key === 0) {
        return 'Jouw gegevens'
      }
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
        (!this.lForm.clients[0].firstName ||
          !this.lForm.clients[0].lastName ||
          !this.lForm.clients[0].email ||
          !this.lForm.clients[0].phone)
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
        (!this.lForm.clients[1].firstName ||
          !this.lForm.clients[1].lastName ||
          !this.lForm.clients[1].email)
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
        (!this.lForm.clients[2].firstName ||
          !this.lForm.clients[2].lastName ||
          !this.lForm.clients[2].email)
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
        (!this.lForm.clients[3].firstName ||
          !this.lForm.clients[3].lastName ||
          !this.lForm.clients[3].email)
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
