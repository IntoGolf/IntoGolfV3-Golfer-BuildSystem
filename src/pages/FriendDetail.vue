<template>
  <q-page class="q-pa-md">
    <!-- Header met terug knop -->
    <div class="row items-center justify-between q-mb-md" style="margin-bottom: 16px;">
      <div class="text-h5 text-weight-bold">
        {{ friend?.isRequest ? 'Uitnodiging Details' : 'Vriend Details' }}
      </div>
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        @click="$router.go(-1)"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em"/>
    </div>

    <!-- Friend details -->
    <div v-else-if="friend" class="q-gutter-md" style="margin-top: 16px;">
      <!-- Profile photo and name -->
      <q-card class="q-pa-md">
        <div class="column items-center text-center">
          <q-avatar size="120px" class="q-mb-md">
            <img
              v-if="friend.image"
              :src="getImageUrl(friend.image)"
              @error="$event.target.style.display = 'none'"
            />
            <q-icon name="person" size="120px"/>
          </q-avatar>
          
          <div class="text-h5 text-weight-bold q-mb-xs">
            {{ friend.name }}
          </div>
          
          <div v-if="friend.handicap" class="text-h6 text-primary q-mb-sm">
            Handicap: {{ friend.handicap }}
          </div>
          
          <div class="text-caption text-grey-6">
            {{ friend.isRequest 
              ? `Uitgenodigd op: ${formatDate(friend.requested_at)}` 
              : `Vrienden sinds: ${formatDate(friend.since)}` 
            }}
          </div>
        </div>
      </q-card>

      <!-- Contact information - only for actual friends -->
      <q-card v-if="!friend.isRequest" class="q-pa-md">
        <div class="text-subtitle1 text-weight-medium q-mb-md">
          Contactgegevens
        </div>
        
        <q-list>
          <!-- Email -->
          <q-item v-if="friend.email" clickable>
            <q-item-section avatar>
              <q-icon name="email" color="primary"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Email</q-item-label>
              <q-item-label caption>{{ friend.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="content_copy"
                @click="copyToClipboard(friend.email, 'Email gekopieerd')"
              />
            </q-item-section>
          </q-item>

          <!-- Mobile phone -->
          <q-item v-if="friend.mobile" clickable>
            <q-item-section avatar>
              <q-icon name="phone_android" color="primary"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mobiel</q-item-label>
              <q-item-label caption>{{ friend.mobile }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="content_copy"
                @click="copyToClipboard(friend.mobile, 'Telefoonnummer gekopieerd')"
              />
            </q-item-section>
          </q-item>

          <!-- Home phone -->
          <q-item v-if="friend.phone" clickable>
            <q-item-section avatar>
              <q-icon name="phone" color="primary"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Telefoon</q-item-label>
              <q-item-label caption>{{ friend.phone }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="content_copy"
                @click="copyToClipboard(friend.phone, 'Telefoonnummer gekopieerd')"
              />
            </q-item-section>
          </q-item>

          <!-- Work phone -->
          <q-item v-if="friend.work_phone" clickable>
            <q-item-section avatar>
              <q-icon name="business_center" color="primary"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Werk</q-item-label>
              <q-item-label caption>{{ friend.work_phone }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="content_copy"
                @click="copyToClipboard(friend.work_phone, 'Telefoonnummer gekopieerd')"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>


      <!-- Actions -->
      <q-card class="q-pa-md">
        <div class="text-subtitle1 text-weight-medium q-mb-md">
          Acties
        </div>
        
        <div class="row q-gutter-sm">
          <q-btn
            v-if="!friend.isRequest"
            color="negative"
            outline
            icon="person_remove"
            label="Vriend verwijderen"
            @click="removeFriend"
            class="col"
          />
          <q-btn
            v-if="friend.isRequest"
            color="negative"
            outline
            icon="cancel"
            label="Uitnodiging annuleren"
            @click="cancelRequest"
            class="col"
          />
        </div>
      </q-card>
    </div>

    <!-- Error state -->
    <div v-else class="text-center q-pa-md text-grey-6">
      <q-icon class="q-mb-md" name="error" size="4em"/>
      <div>Vriend niet gevonden</div>
    </div>
  </q-page>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'FriendDetail',
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()

    const loading = ref(false)
    const friend = ref(null)

    const loadFriend = async () => {
      loading.value = true
      try {
        const relNr = route.params.relNr
        const type = route.query.type || 'friend' // 'friend' or 'request'
        
        if (!relNr) {
          throw new Error('Geen relNr opgegeven')
        }

        if (type === 'request') {
          // Load from friend requests for outgoing invitations
          const requestsResponse = await proxy.$axios.get('golfer/friend-requests')
          const outgoingRequest = requestsResponse.outgoing.find(req => req.rel_nr == relNr)
          
          if (!outgoingRequest) {
            throw new Error('Uitnodiging niet gevonden')
          }
          
          friend.value = {
            ...outgoingRequest,
            isRequest: true
          }
        } else {
          // Load full friend details
          const response = await proxy.$axios.get('golfer/friend-details', {
            params: { rel_nr: relNr }
          })
          
          friend.value = {
            ...response,
            isRequest: false
          }
        }
      } catch (error) {
        console.error('Error loading friend details:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van vriend details'
        })
      } finally {
        loading.value = false
      }
    }

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null
      return `${process.env.VUE_APP_BASE_URL}api/public/image?path=${imagePath}`
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('nl-NL')
    }

    const copyToClipboard = (text, message) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          $q.notify({
            type: 'positive',
            message: message,
            timeout: 1500
          })
        }).catch(() => {
          $q.notify({
            type: 'negative',
            message: 'Kon niet kopiëren naar klembord'
          })
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          $q.notify({
            type: 'positive',
            message: message,
            timeout: 1500
          })
        } catch (err) {
          $q.notify({
            type: 'negative',
            message: 'Kon niet kopiëren naar klembord'
          })
        }
        document.body.removeChild(textArea)
      }
    }

    const removeFriend = async () => {
      $q.dialog({
        title: 'Vriend verwijderen',
        message: `Weet je zeker dat je ${friend.value.name} als vriend wilt verwijderen?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.delete('golfer/friend', {
            data: { friendship_id: friend.value.friendship_id }
          })

          $q.notify({
            type: 'positive',
            message: 'Vriend verwijderd'
          })

          router.push('/friends')
        } catch (error) {
          console.error('Error removing friend:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij verwijderen van vriend'
          })
        }
      })
    }

    const cancelRequest = async () => {
      $q.dialog({
        title: 'Uitnodiging annuleren',
        message: `Weet je zeker dat je de uitnodiging aan ${friend.value.name} wilt annuleren?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.post('golfer/friend-request/cancel', {
            friendship_id: friend.value.friendship_id
          })

          $q.notify({
            type: 'positive',
            message: 'Uitnodiging geannuleerd'
          })

          router.push('/friends')
        } catch (error) {
          console.error('Error cancelling friend request:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij annuleren van uitnodiging'
          })
        }
      })
    }

    onMounted(() => {
      loadFriend()
    })

    return {
      loading,
      friend,
      getImageUrl,
      formatDate,
      copyToClipboard,
      removeFriend,
      cancelRequest
    }
  }
}
</script>