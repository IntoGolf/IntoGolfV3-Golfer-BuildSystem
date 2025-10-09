<template>
  <q-page class="q-pa-md">
    <!-- Header met terug knop -->
    <div class="row justify-between items-center q-mb-md">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        @click="$router.back()"
        size="md"
      />
      <div class="text-h6 text-weight-bold">Vrienden Zoeken</div>
      <div style="width: 40px;"></div> <!-- Spacer voor centrering -->
    </div>

    <!-- Zoekbalk -->
    <q-input
      v-model="searchQuery"
      placeholder="Zoek op naam of email..."
      outlined
      dense
      class="q-mb-md"
      @update:model-value="searchUsers"
      debounce="500"
      autofocus
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append v-if="searchQuery">
        <q-icon name="close" @click="searchQuery = ''" class="cursor-pointer" />
      </template>
    </q-input>

    <!-- Zoekresultaten -->
    <div v-if="loadingSearch" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="searchResults.length === 0 && searchQuery" class="text-center q-pa-md text-grey-6">
      <q-icon name="search_off" size="4em" class="q-mb-md" />
      <div>Geen gebruikers gevonden</div>
      <div class="text-caption">Probeer een andere zoekterm</div>
    </div>

    <div v-else-if="!searchQuery" class="text-center q-pa-md text-grey-6">
      <q-icon name="people_outline" size="4em" class="q-mb-md" />
      <div>Zoek naar vrienden</div>
      <div class="text-caption">Typ een naam of emailadres om te beginnen</div>
    </div>

    <q-list v-else-if="searchResults.length > 0" bordered separator>
      <q-item v-for="user in searchResults" :key="user.rel_nr" class="q-pa-md">
        <q-item-section avatar>
          <div class="column items-center" style="gap: 1px;">
            <q-avatar size="30px">
              <img 
                v-if="user.image" 
                :src="getImageUrl(user.image)" 
                @error="$event.target.style.display = 'none'"
              />
              <q-icon name="person" size="30px" />
            </q-avatar>
            <div v-if="user.handicap" class="text-caption text-grey-6">
              {{ user.handicap }}
            </div>
          </div>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium">{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn
            v-if="user.friendship_status === 'none'"
            color="primary"
            label="Uitnodigen"
            size="sm"
            @click="sendFriendRequest(user)"
            :loading="sendingRequest === user.rel_nr"
          />
          <q-chip v-else-if="user.friendship_status === 'friend'" color="positive" size="sm">
            <q-icon name="check" size="xs" class="q-mr-xs" />
            Vrienden
          </q-chip>
          <q-chip v-else-if="user.friendship_status === 'request_sent'" color="orange" size="sm">
            <q-icon name="schedule" size="xs" class="q-mr-xs" />
            Verzonden
          </q-chip>
          <q-chip v-else-if="user.friendship_status === 'request_received'" color="blue" size="sm">
            <q-icon name="mail" size="xs" class="q-mr-xs" />
            Ontvangen
          </q-chip>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref, getCurrentInstance, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'FriendsSearch',
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    
    const loadingSearch = ref(false)
    const sendingRequest = ref(null)
    const searchQuery = ref('')
    const searchResults = ref([])

    const searchUsers = async () => {
      if (!searchQuery.value || searchQuery.value.length < 2) {
        searchResults.value = []
        return
      }

      loadingSearch.value = true
      try {
        const response = await proxy.$axios.get('golfer/search-users', {
          params: { search: searchQuery.value }
        })
        searchResults.value = response || []
      } catch (error) {
        console.error('Error searching users:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij zoeken van gebruikers'
        })
      } finally {
        loadingSearch.value = false
      }
    }

    const sendFriendRequest = async (user) => {
      sendingRequest.value = user.rel_nr
      try {
        await proxy.$axios.post('golfer/friend-request', {
          rel_nr: user.rel_nr
        })
        
        $q.notify({
          type: 'positive',
          message: 'Vriendschapsverzoek verzonden',
          timeout: 2000
        })
        
        // Update search results
        user.friendship_status = 'request_sent'
      } catch (error) {
        console.error('Error sending friend request:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij verzenden van vriendschapsverzoek'
        })
      } finally {
        sendingRequest.value = null
      }
    }

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null
      return `${process.env.VUE_APP_BASE_URL}api/public/image?path=${imagePath}`
    }

    // Watch voor zoekfunctie
    watch(searchQuery, (newValue) => {
      if (newValue && newValue.length >= 2) {
        searchUsers()
      } else {
        searchResults.value = []
      }
    }, { debounce: 500 })

    return {
      loadingSearch,
      sendingRequest,
      searchQuery,
      searchResults,
      searchUsers,
      sendFriendRequest,
      getImageUrl
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>