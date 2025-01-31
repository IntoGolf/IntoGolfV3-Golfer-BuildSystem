<template>
  <q-card bordered class="full-width q-pa-md" flat>
    <div class="text-h6">Baan condities</div>
    <q-separator />
    <table class="full-width">
      <thead>
        <tr>
          <th class="text-left">&nbsp;</th>
          <th
            v-for="(rec, key) in $store.state.courseStatus.items"
            :key="key"
            class="text-center"
          >
            {{ rec.course_loop.crlName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">Open</td>
          <td
            v-for="(rec, key) in $store.state.courseStatus.items"
            :key="key"
            class="text-center"
          >
            <q-icon
              :color="rec.clsOpenYN == 0 ? 'green' : 'red'"
              :name="rec.clsOpenYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </td>
        </tr>
        <tr>
          <td class="text-left">Qualifying</td>
          <td
            v-for="(rec, key) in $store.state.courseStatus.items"
            :key="key"
            class="text-center"
          >
            <q-icon
              :color="rec.clsNotQualifyingYN == 0 ? 'green' : 'red'"
              :name="rec.clsNotQualifyingYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <q-btn
      class="full-width q-mt-md"
      color="primary"
      flat
      label="toon alles"
      size="small"
      to="Baanstatus"
    />
  </q-card>
</template>

<script>
export default {
  name: "dashboardCourseStatus",
  computed: {},
  methods: {},
};
</script>
