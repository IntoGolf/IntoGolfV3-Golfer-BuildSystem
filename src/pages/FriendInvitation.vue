<template>
  <div class="standalone-page">
    <div class="page-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-container">
          <q-img
            v-if="blobUrl"
            :fit="'scale-down'"
            :src="blobUrl"
            class="logo-image"
          />
          <div v-else class="logo-text">
            IntoGolf
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="content-section">
        <div class="state-container loading-state">
          <q-spinner-dots color="primary" size="50px"/>
          <div class="state-text">Uitnodiging laden...</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="content-section">
        <div class="state-container">
          <q-card class="state-card error-card">
            <q-card-section>
              <q-icon color="negative" name="error" size="60px"/>
              <div class="state-title error-title">Fout</div>
              <div class="state-message">{{ error }}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                class="full-width"
                color="primary"
                flat
                label="Opnieuw proberen"
                @click="loadInvitation"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="successMessage" class="content-section">
        <div class="state-container">
          <q-card class="state-card success-card">
            <q-card-section>
              <q-icon color="positive" name="check_circle" size="60px"/>
              <div class="state-title success-title">Gelukt!</div>
              <div class="state-message">{{ successMessage }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Invitation Content -->
      <div v-else-if="invitation" class="content-section">
        <div class="form-container">
          <!-- Invitation Info Card -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <div class="text-h5 text-center q-mb-md">Vriendschapsuitnodiging</div>
              <q-separator class="q-mb-md"/>

              <div class="text-center q-mb-lg">
                <q-avatar class="q-mb-md" color="primary" size="80px" text-color="white">
                  <q-icon name="person" size="40px"/>
                </q-avatar>
                <div class="text-h6">{{ invitation.inviter_name }}</div>
                <div class="text-body2 text-grey-6">wil vrienden worden</div>
              </div>

              <div v-if="invitation.message" class="q-pa-md bg-grey-1 rounded-borders">
                <div class="text-body2">
                  <q-icon class="q-mr-sm" name="format_quote"/>
                  {{ invitation.message }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Registration Form -->
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Jouw gegevens</div>

              <q-form ref="formRef" @submit.prevent="acceptInvitation">
                <div class="q-gutter-md">
                  <!-- First Name Field -->
                  <q-input
                    v-model="form.relCallName"
                    :rules="firstNameRules"
                    filled
                    label="Voornaam *"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="person"/>
                    </template>
                  </q-input>

                  <!-- Prefix Field -->
                  <q-input
                    v-model="form.relPrefix"
                    :rules="prefixRules"
                    filled
                    label="Tussenvoegsel"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="person"/>
                    </template>
                  </q-input>

                  <!-- Last Name Field -->
                  <q-input
                    v-model="form.relName"
                    :rules="lastNameRules"
                    filled
                    label="Achternaam *"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="person"/>
                    </template>
                  </q-input>

                  <!-- Birth Date Field -->
                  <q-input
                    v-model="form.birth_date"
                    :rules="birthDateRules"
                    filled
                    label="Geboortedatum *"
                    lazy-rules
                    type="date"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cake"/>
                    </template>
                  </q-input>

                  <!-- Handicap Field -->
                  <q-input
                    v-model.number="form.handicap"
                    :rules="handicapRules"
                    filled
                    hint="Voer een handicap in tussen -36 en 54"
                    label="Handicap (optioneel)"
                    lazy-rules
                    type="number"
                  >
                    <template v-slot:prepend>
                      <q-icon name="golf_course"/>
                    </template>
                  </q-input>

                  <!-- GSN Number Field -->
                  <q-input
                    v-model="form.gsn_number"
                    :rules="gsnRules"
                    filled
                    hint="Golf Service Nederland nummer"
                    label="GSN nummer (optioneel)"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge"/>
                    </template>
                  </q-input>
                </div>
              </q-form>
            </q-card-section>

            <q-card-actions class="q-pa-md">
              <q-btn
                :loading="submitting"
                class="full-width q-mb-sm"
                color="positive"
                icon="check"
                label="Uitnodiging accepteren"
                size="lg"
                type="submit"
                @click="acceptInvitation"
              />

              <q-btn
                :loading="submitting"
                class="full-width"
                color="negative"
                flat
                icon="close"
                label="Uitnodiging afwijzen"
                @click="declineInvitation"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useStore} from 'vuex'
import axios from 'axios'

export default {
  name: 'FriendInvitation',
  setup() {
    const route = useRoute()
    const $q = useQuasar()
    const store = useStore()

    // Reactive state
    const loading = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const invitation = ref(null)
    const formRef = ref(null)
    const blobUrl = ref('')

    // Form data
    const form = ref({
      relCallName: '',
      relPrefix: '',
      relName: '',
      birth_date: '',
      handicap: null,
      gsn_number: ''
    })

    // Get hash from route params
    const invitationHash = computed(() => route.params.hash)

    // Validation rules
    const firstNameRules = [
      val => (val && val.length > 0) || 'Voornaam is verplicht',
      val => (val && val.length >= 2) || 'Voornaam moet minimaal 2 karakters zijn'
    ]

    const prefixRules = [
      val => {
        if (!val) return true
        return val.length <= 50 || 'Tussenvoegsel mag maximaal 50 karakters zijn'
      }
    ]

    const lastNameRules = [
      val => (val && val.length > 0) || 'Achternaam is verplicht',
      val => (val && val.length >= 2) || 'Achternaam moet minimaal 2 karakters zijn'
    ]

    const birthDateRules = [
      val => !!val || 'Geboortedatum is verplicht',
      val => {
        if (!val) return true
        const selectedDate = new Date(val)
        const today = new Date()
        return selectedDate < today || 'Geboortedatum moet in het verleden liggen'
      }
    ]

    const handicapRules = [
      val => {
        if (val === null || val === undefined || val === '') return true
        const numVal = Number(val)
        return (numVal >= -36 && numVal <= 54) || 'Handicap moet tussen -36 en 54 liggen'
      }
    ]

    const gsnRules = [
      val => {
        if (!val) return true
        return val.length >= 6 || 'GSN nummer moet minimaal 6 karakters zijn'
      }
    ]

    // Load logo image
    const loadImage = async () => {
      try {
        // First ensure we have public settings
        if (!store.state.settings.publicItems || Object.keys(store.state.settings.publicItems).length === 0) {
          await store.dispatch('settings/fetchPublicSettings')
        }

        if (store.state.settings?.publicItems?.system_logo) {
          const response = await axios.get(`golfer/image/${store.state.settings.publicItems.system_logo}`)
          blobUrl.value = "data:image/png;base64," + response
        }
      } catch (err) {
        console.error('Error loading logo:', err)
        // Fallback to default logo or empty
        blobUrl.value = ''
      }
    }

    // Load invitation details
    const loadInvitation = async () => {
      if (!invitationHash.value) {
        error.value = 'Geen geldige uitnodiging gevonden'
        return
      }

      loading.value = true
      error.value = ''

      try {
        const response = await axios.get(`invitation/${invitationHash.value}`)
        invitation.value = response.invitation
      } catch (err) {
        console.error('Error loading invitation:', err)
        if (err.response?.status === 404) {
          error.value = 'Uitnodiging niet gevonden of verlopen'
        } else if (err.response?.status === 410) {
          error.value = 'Deze uitnodiging is verlopen'
        } else {
          error.value = 'Er is een fout opgetreden bij het laden van de uitnodiging'
        }
      } finally {
        loading.value = false
      }
    }

    // Accept invitation
    const acceptInvitation = async () => {
      // Validate form
      if (formRef.value) {
        const isValid = await formRef.value.validate()
        if (!isValid) {
          $q.notify({
            type: 'negative',
            message: 'Controleer de ingevulde gegevens'
          })
          return
        }
      }

      submitting.value = true

      try {
        const response = await axios.post(`invitation/${invitationHash.value}/accept`, {
          relCallName: form.value.relCallName,
          relPrefix: form.value.relPrefix || null,
          relName: form.value.relName,
          birth_date: form.value.birth_date,
          handicap: form.value.handicap || null,
          gsn_number: form.value.gsn_number || null
        })

        successMessage.value = 'Uitnodiging geaccepteerd! Je bent nu vrienden.'
        invitation.value = null

        $q.notify({
          type: 'positive',
          message: 'Uitnodiging succesvol geaccepteerd!'
        })
      } catch (err) {
        console.error('Error accepting invitation:', err)
        let errorMessage = 'Er is een fout opgetreden bij het accepteren van de uitnodiging'

        if (err.response?.status === 409) {
          errorMessage = 'Deze uitnodiging is al verwerkt'
        } else if (err.response?.status === 410) {
          errorMessage = 'Deze uitnodiging is verlopen'
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        }

        $q.notify({
          type: 'negative',
          message: errorMessage
        })
      } finally {
        submitting.value = false
      }
    }

    // Decline invitation
    const declineInvitation = async () => {
      $q.dialog({
        title: 'Uitnodiging afwijzen',
        message: 'Weet je zeker dat je deze uitnodiging wilt afwijzen?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        submitting.value = true

        try {
          await axios.post(`invitation/${invitationHash.value}/decline`)

          successMessage.value = 'Uitnodiging afgewezen.'
          invitation.value = null

          $q.notify({
            type: 'info',
            message: 'Uitnodiging afgewezen'
          })
        } catch (err) {
          console.error('Error declining invitation:', err)
          let errorMessage = 'Er is een fout opgetreden bij het afwijzen van de uitnodiging'

          if (err.response?.status === 409) {
            errorMessage = 'Deze uitnodiging is al verwerkt'
          } else if (err.response?.status === 410) {
            errorMessage = 'Deze uitnodiging is verlopen'
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message
          }

          $q.notify({
            type: 'negative',
            message: errorMessage
          })
        } finally {
          submitting.value = false
        }
      })
    }

    // Load invitation and logo on component mount
    onMounted(() => {
      loadImage()
      loadInvitation()
    })

    return {
      loading,
      submitting,
      error,
      successMessage,
      invitation,
      form,
      formRef,
      blobUrl,
      firstNameRules,
      prefixRules,
      lastNameRules,
      birthDateRules,
      handicapRules,
      gsnRules,
      loadImage,
      loadInvitation,
      acceptInvitation,
      declineInvitation
    }
  }
}
</script>

<style scoped>
/* Standalone page styling */
.standalone-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.page-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Logo section */
.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-image {
  max-width: 300px;
  max-height: 120px;
  border-radius: 10px;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

/* Content sections */
.content-section {
  width: 100%;
}

.state-container {
  text-align: center;
  margin: 0 auto;
  max-width: 400px;
}

.loading-state {
  color: white;
  padding: 2rem;
}

.state-text {
  margin-top: 1rem;
  font-size: 1.25rem;
  color: white;
  font-weight: 500;
}

.state-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.state-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
}

.state-message {
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #666;
}

.error-title {
  color: #c62828;
}

.success-title {
  color: #2e7d32;
}

/* Form container */
.form-container {
  width: 100%;
}

.form-container .q-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.rounded-borders {
  border-radius: 12px;
}

/* Responsive design */
@media (max-width: 600px) {
  .standalone-page {
    padding: 10px;
    align-items: flex-start;
    padding-top: 40px;
  }
  
  .page-container {
    max-width: 100%;
  }
  
  .logo-container {
    padding: 15px;
    border-radius: 15px;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .state-card {
    margin: 0 10px;
    padding: 1rem;
  }
  
  .form-container .q-card {
    margin: 0 0 1rem 0;
  }
}

@media (max-width: 400px) {
  .logo-text {
    font-size: 1.75rem;
  }
  
  .state-title {
    font-size: 1.25rem;
  }
  
  .logo-container {
    padding: 10px;
  }
}

/* Dark mode compatibility */
@media (prefers-color-scheme: dark) {
  .standalone-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
}
</style>
