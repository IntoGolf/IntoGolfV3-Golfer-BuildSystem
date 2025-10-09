<template>
  <q-page class="q-pa-md">
    <!-- Header met titel -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5 text-weight-bold">
        {{ activeTab === 'friends' ? 'Vrienden' : 'Groepen' }}
      </div>
    </div>

    <!-- Vrienden Content -->
    <div v-if="activeTab === 'friends'">
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="2em"/>
      </div>

      <div v-else-if="friends.length === 0 && friendRequests.outgoing.length === 0"
           class="text-center q-pa-md text-grey-6">
        <q-icon class="q-mb-md" name="people" size="4em"/>
        <div>Je hebt nog geen vrienden toegevoegd</div>
        <div class="text-caption q-mb-md">Zoek en voeg vrienden toe</div>
        <q-btn
          color="primary"
          icon="add"
          label="Vrienden zoeken"
          rounded
          @click="$router.push('/friends/search')"
        />
      </div>

      <div v-else>
        <!-- Inkomende vriendschapsverzoeken -->
        <div v-if="friendRequests.incoming.length > 0" class="q-mb-md">
          <div class="text-subtitle2 text-weight-medium q-mb-sm text-blue-8">
            Vriendschapsverzoeken ({{ friendRequests.incoming.length }})
          </div>
          <q-list bordered class="q-mb-md" separator>
            <q-item v-for="request in friendRequests.incoming" :key="request.friendship_id" class="q-pa-md">
              <q-item-section avatar>
                <div class="column items-center" style="gap: 1px;">
                  <q-avatar size="30px">
                    <img
                      v-if="request.image"
                      :src="getImageUrl(request.image)"
                      @error="$event.target.style.display = 'none'"
                    />
                    <q-icon name="person" size="30px"/>
                  </q-avatar>
                  <div v-if="request.handicap" class="text-caption text-grey-6">
                    {{ request.handicap }}
                  </div>
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ request.name }}</q-item-label>
                <q-item-label caption class="text-blue-6">
                  Wil vrienden worden
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="column q-gutter-xs">
                  <q-btn
                    color="positive"
                    dense
                    label="✓"
                    size="sm"
                    @click="acceptRequest(request)"
                  />
                  <q-btn
                    color="negative"
                    dense
                    label="✗"
                    size="sm"
                    @click="declineRequest(request)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Uitnodigingen zonder reactie -->
        <div v-if="friendRequests.outgoing.length > 0" class="q-mb-md">
          <div class="text-subtitle2 text-weight-medium q-mb-sm text-orange-8">
            Uitnodigingen verzonden ({{ friendRequests.outgoing.length }})
          </div>
          <q-list bordered separator>
            <q-item 
              v-for="request in friendRequests.outgoing" 
              :key="request.friendship_id" 
              class="q-pa-md" 
              clickable 
              @click="$router.push(`/friends/${request.rel_nr}?type=request`)"
            >
              <q-item-section avatar>
                <div class="column items-center" style="gap: 1px;">
                  <q-avatar size="30px">
                    <img
                      v-if="request.image"
                      :src="getImageUrl(request.image)"
                      @error="$event.target.style.display = 'none'"
                    />
                    <q-icon name="person" size="30px"/>
                  </q-avatar>
                  <div v-if="request.handicap" class="text-caption text-grey-6">
                    {{ request.handicap }}
                  </div>
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ request.name }}</q-item-label>
                <q-item-label caption class="text-orange-6">
                  Uitgenodigd {{ formatDate(request.requested_at) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" color="grey-5" size="24px"/>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Bevestigde vrienden -->
        <div v-if="friends.length > 0">
          <div class="row justify-between items-center q-mb-sm">
            <div class="text-subtitle2 text-weight-medium text-positive">
              Vrienden ({{ friends.length }})
            </div>
            <q-btn
              color="primary"
              icon="add"
              round
              size="sm"
              @click="$router.push('/friends/search')"
            />
          </div>
          <q-list bordered separator>
            <q-item 
              v-for="friend in friends" 
              :key="friend.rel_nr" 
              class="q-pa-md" 
              clickable 
              @click="$router.push(`/friends/${friend.rel_nr}`)"
            >
              <q-item-section avatar>
                <div class="column items-center" style="gap: 1px;">
                  <q-avatar size="30px">
                    <img
                      v-if="friend.image"
                      :src="getImageUrl(friend.image)"
                      @error="$event.target.style.display = 'none'"
                    />
                    <q-icon name="person" size="30px"/>
                  </q-avatar>
                  <div v-if="friend.handicap" class="text-caption text-grey-6">
                    {{ friend.handicap }}
                  </div>
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ friend.name }}</q-item-label>
                <q-item-label caption class="text-grey-5">
                  Vrienden sinds: {{ formatDate(friend.since) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" color="grey-5" size="24px"/>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- Groepen Content -->
    <div v-if="activeTab === 'groups'">
      <friend-groups-tab @refresh="loadFriends"/>
    </div>

    <!-- Footer met navigatie buttons (verborgen) -->
    <!--
    <q-footer class="bg-white shadow-up-2"
              style="position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto;">
      <q-toolbar class="justify-around">
        <q-btn
          :color="activeTab === 'friends' ? 'primary' : 'grey-6'"
          class="col"
          flat
          @click="activeTab = 'friends'"
        >
          <div class="column items-center">
            <q-icon :name="activeTab === 'friends' ? 'people' : 'people_outline'" size="24px"/>
            <div class="text-caption q-mt-xs">Vrienden</div>
          </div>
        </q-btn>

        <q-btn
          :color="activeTab === 'groups' ? 'primary' : 'grey-6'"
          class="col"
          flat
          @click="activeTab = 'groups'"
        >
          <div class="column items-center">
            <q-icon :name="activeTab === 'groups' ? 'groups' : 'groups_outline'" size="24px"/>
            <div class="text-caption q-mt-xs">Groepen</div>
          </div>
        </q-btn>
      </q-toolbar>
    </q-footer>
    -->
  </q-page>
</template>

<script>
import {getCurrentInstance, onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import FriendGroupsTab from '../components/friends/FriendGroupsTab.vue'

export default {
  name: 'Friends',
  components: {
    FriendGroupsTab
  },
  setup() {
    const $q = useQuasar()
    const {proxy} = getCurrentInstance()

    const activeTab = ref('friends')
    const loading = ref(false)
    const loadingRequests = ref(false)

    const friends = ref([])
    const friendRequests = ref({incoming: [], outgoing: []})

    const loadFriends = async () => {
      loading.value = true
      try {
        const response = await proxy.$axios.get('golfer/friends')
        friends.value = response || []
      } catch (error) {
        console.error('Error loading friends:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van vrienden'
        })
      } finally {
        loading.value = false
      }
    }

    const loadFriendRequests = async () => {
      loadingRequests.value = true
      try {
        const response = await proxy.$axios.get('golfer/friend-requests')
        friendRequests.value = response || {incoming: [], outgoing: []}
      } catch (error) {
        console.error('Error loading friend requests:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van verzoeken'
        })
      } finally {
        loadingRequests.value = false
      }
    }


    const acceptRequest = async (request) => {
      try {
        await proxy.$axios.post('golfer/friend-request/accept', {
          friendship_id: request.friendship_id
        })

        $q.notify({
          type: 'positive',
          message: 'Vriendschapsverzoek geaccepteerd'
        })

        // Refresh data
        loadFriends()
        loadFriendRequests()
      } catch (error) {
        console.error('Error accepting friend request:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij accepteren van verzoek'
        })
      }
    }

    const declineRequest = async (request) => {
      try {
        await proxy.$axios.post('golfer/friend-request/decline', {
          friendship_id: request.friendship_id
        })

        $q.notify({
          type: 'positive',
          message: 'Vriendschapsverzoek geweigerd'
        })

        // Refresh requests
        loadFriendRequests()
      } catch (error) {
        console.error('Error declining friend request:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij weigeren van verzoek'
        })
      }
    }

    const removeFriend = async (friend) => {
      $q.dialog({
        title: 'Vriend verwijderen',
        message: `Weet je zeker dat je ${friend.name} als vriend wilt verwijderen?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.delete('golfer/friend', {
            data: {friendship_id: friend.friendship_id}
          })

          $q.notify({
            type: 'positive',
            message: 'Vriend verwijderd'
          })

          loadFriends()
        } catch (error) {
          console.error('Error removing friend:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij verwijderen van vriend'
          })
        }
      })
    }

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null
      return `${process.env.VUE_APP_BASE_URL}api/public/image?path=${imagePath}`
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('nl-NL')
    }


    onMounted(() => {
      loadFriends()
      loadFriendRequests()
    })

    return {
      activeTab,
      loading,
      loadingRequests,
      friends,
      friendRequests,
      loadFriends,
      loadFriendRequests,
      acceptRequest,
      declineRequest,
      removeFriend,
      getImageUrl,
      formatDate
    }
  }
}
</script>
