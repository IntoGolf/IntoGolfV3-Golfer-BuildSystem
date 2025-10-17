<template>
  <q-page class="q-pa-md">
    <!-- Header met terug knop -->
    <div class="row justify-between items-center q-mb-md">
      <q-btn
        dense
        flat
        icon="arrow_back"
        round
        size="md"
        @click="$router.back()"
      />
      <div class="text-h6 text-weight-bold">Vrienden Uitnodigen</div>
      <div style="width: 40px;"></div> <!-- Spacer voor centrering -->
    </div>

    <!-- Uitleg -->
    <div class="text-center q-mb-lg">
      <q-icon class="q-mb-md" color="primary" name="person_add" size="3em"/>
      <div class="text-h6 q-mb-sm">Nodig een vriend uit</div>
      <div class="text-body2 text-grey-7">
        Voer het emailadres en de naam van je vriend in om een uitnodiging te versturen.
      </div>
    </div>

    <!-- Uitnodigingsformulier -->
    <q-form class="q-gutter-md" @submit="sendFriendRequest">
      <q-input
        v-model="form.email"
        :rules="[val => !!val || 'Emailadres is verplicht', val => isValidEmail(val) || 'Voer een geldig emailadres in']"
        autofocus
        dense
        label="Emailadres *"
        outlined
        type="email"
      >
        <template v-slot:prepend>
          <q-icon name="email"/>
        </template>
      </q-input>

      <q-input
        v-model="form.name"
        :rules="[val => !!val || 'Naam is verplicht']"
        dense
        label="Naam *"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="person"/>
        </template>
      </q-input>

      <div class="text-center q-mt-lg">
        <q-btn
          :disable="!form.email || !form.name"
          :loading="sendingRequest"
          class="q-px-xl"
          color="primary"
          label="Uitnodiging Versturen"
          size="md"
          type="submit"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left"/>
            Versturen...
          </template>
        </q-btn>
      </div>
    </q-form>


    <!-- Tips -->
    <q-card bordered class="q-mt-lg q-pa-md bg-blue-1" flat>
      <div class="text-subtitle2 text-blue-8 q-mb-sm">
        <q-icon class="q-mr-xs" name="info"/>
        Tips
      </div>
      <ul class="text-body2 text-blue-9 q-ma-none q-pl-md">
        <li>Als je vriend al een account heeft, ontvangt hij/zij direct een vriendschapsverzoek</li>
        <li>Als je vriend nog geen account heeft, wordt er een uitnodiging per email verstuurd</li>
        <li>Je kunt alleen mensen uitnodigen die nog niet in je vriendenlijst staan</li>
      </ul>
    </q-card>
  </q-page>
</template>

<script>
import {getCurrentInstance, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

export default {
  name: 'FriendsSearch',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const {proxy} = getCurrentInstance()

    const sendingRequest = ref(false)
    const form = ref({
      email: '',
      name: ''
    })

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const sendFriendRequest = async () => {
      if (!form.value.email || !form.value.name || !isValidEmail(form.value.email)) {
        return
      }

      sendingRequest.value = true

      try {
        const response = await proxy.$axios.post('golfer/friend-request', {
          email: form.value.email,
          name: form.value.name
        })

        console.log(response);

        // Handle different response scenarios
        if (response && response.success) {
          let title, message

          if (response.type === 'existing_user') {
            title = 'Vriendschapsverzoek verzonden!'
            message = `Een vriendschapsverzoek is verzonden naar ${form.value.name}.`
          } else if (response.type === 'email_invitation') {
            title = 'Uitnodiging verzonden!'
            message = `Een uitnodiging is per email verzonden naar ${form.value.email}.`
          } else {
            title = 'Uitnodiging verzonden!'
            message = 'Je vriendschapsverzoek is succesvol verzonden.'
          }

          // Show success notification
          $q.notify({
            type: 'positive',
            message: title,
            timeout: 3000
          })

          // Navigate back to friends page after short delay
          setTimeout(() => {
            router.push('/friends')
          }, 1500)
        } else {
          throw new Error('Onverwacht response format')
        }
      } catch (error) {
        console.error('Error sending friend request:', error)

        let errorMessage = 'Er is een fout opgetreden bij het verzenden van de uitnodiging.'

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.status === 422) {
          errorMessage = 'De ingevoerde gegevens zijn niet geldig.'
        } else if (error.response?.status === 409) {
          errorMessage = 'Deze persoon is al een vriend of er is al een verzoek verzonden.'
        }

        $q.notify({
          type: 'negative',
          message: errorMessage,
          timeout: 4000
        })
      } finally {
        sendingRequest.value = false
      }
    }

    return {
      sendingRequest,
      form,
      isValidEmail,
      sendFriendRequest
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
