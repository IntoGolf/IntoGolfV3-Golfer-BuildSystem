<template>
  <q-card class="full-height">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="$emit('close')"
          class="q-mr-md"
        />
        <div>
          <div class="text-h6">{{ group.name }}</div>
          <div class="text-caption">{{ group.members.length }} {{ group.members.length === 1 ? 'lid' : 'leden' }}</div>
        </div>
        <q-space />
        <q-btn
          v-if="group.is_owner"
          flat
          round
          dense
          icon="person_add"
          @click="showAddMemberDialog = true"
        />
      </div>
    </q-card-section>

    <q-card-section v-if="group.description" class="q-pb-none">
      <div class="text-body2 text-grey-7">{{ group.description }}</div>
    </q-card-section>

    <q-card-section class="q-pt-sm">
      <div class="text-subtitle2 text-weight-medium q-mb-md">Leden</div>

      <!-- Eigenaar -->
      <q-list separator>
        <q-item class="q-pa-md">
          <q-item-section avatar>
            <q-avatar size="50px">
              <img v-if="group.owner.image" :src="getImageUrl(group.owner.image)" />
              <q-icon v-else name="person" size="30px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ group.owner.name }}</q-item-label>
            <q-item-label caption>Eigenaar van de groep</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip color="gold" text-color="black" size="sm">
              <q-icon name="star" size="xs" class="q-mr-xs" />
              Eigenaar
            </q-chip>
          </q-item-section>
        </q-item>

        <!-- Groepsleden -->
        <q-item
          v-for="member in group.members"
          :key="member.rel_nr"
          class="q-pa-md"
        >
          <q-item-section avatar>
            <q-avatar size="50px">
              <img v-if="member.image" :src="getImageUrl(member.image)" />
              <q-icon v-else name="person" size="30px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ member.name }}</q-item-label>
            <q-item-label caption>{{ member.email }}</q-item-label>
            <q-item-label caption v-if="member.handicap">
              Handicap: {{ member.handicap }}
            </q-item-label>
            <q-item-label caption class="text-grey-5">
              Toegevoegd door {{ member.added_by }} op {{ formatDate(member.added_at) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side v-if="group.is_owner">
            <q-btn
              flat
              round
              color="negative"
              icon="person_remove"
              @click="removeMember(member)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Lid toevoegen dialog -->
    <q-dialog v-model="showAddMemberDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Lid Toevoegen</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="loadingAvailableFriends" class="text-center q-pa-md">
            <q-spinner color="primary" size="2em" />
          </div>

          <div v-else-if="availableFriends.length === 0" class="text-center q-pa-md text-grey-6">
            <q-icon name="people" size="3em" class="q-mb-md" />
            <div>Geen vrienden beschikbaar om toe te voegen</div>
            <div class="text-caption">Alle vrienden zijn al lid van deze groep</div>
          </div>

          <q-list v-else separator>
            <q-item
              v-for="friend in availableFriends"
              :key="friend.rel_nr"
              clickable
              @click="addMember(friend)"
            >
              <q-item-section avatar>
                <q-avatar size="40px">
                  <img v-if="friend.image" :src="getImageUrl(friend.image)" />
                  <q-icon v-else name="person" size="24px" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ friend.name }}</q-item-label>
                <q-item-label caption>{{ friend.email }}</q-item-label>
                <q-item-label caption v-if="friend.handicap">
                  Handicap: {{ friend.handicap }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="add" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Sluiten" @click="showAddMemberDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'FriendGroupDetails',
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    
    const showAddMemberDialog = ref(false)
    const loadingAvailableFriends = ref(false)
    const availableFriends = ref([])

    const loadAvailableFriends = async () => {
      if (!props.group.is_owner) return

      loadingAvailableFriends.value = true
      try {
        const response = await proxy.$axios.get('golfer/friend-group/available-friends', {
          params: { group_id: props.group.id }
        })
        availableFriends.value = response || []
      } catch (error) {
        console.error('Error loading available friends:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van beschikbare vrienden'
        })
      } finally {
        loadingAvailableFriends.value = false
      }
    }

    const addMember = async (friend) => {
      try {
        await proxy.$axios.post('golfer/friend-group/member', {
          group_id: props.group.id,
          rel_nr: friend.rel_nr
        })
        
        $q.notify({
          type: 'positive',
          message: `${friend.name} toegevoegd aan de groep`
        })
        
        showAddMemberDialog.value = false
        emit('refresh')
        emit('close')
      } catch (error) {
        console.error('Error adding member:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij toevoegen van lid'
        })
      }
    }

    const removeMember = (member) => {
      $q.dialog({
        title: 'Lid verwijderen',
        message: `Weet je zeker dat je ${member.name} uit de groep wilt verwijderen?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.delete('golfer/friend-group/member', {
            data: {
              group_id: props.group.id,
              rel_nr: member.rel_nr
            }
          })
          
          $q.notify({
            type: 'positive',
            message: `${member.name} verwijderd uit de groep`
          })
          
          emit('refresh')
          emit('close')
        } catch (error) {
          console.error('Error removing member:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij verwijderen van lid'
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
      if (props.group.is_owner) {
        loadAvailableFriends()
      }
    })

    return {
      showAddMemberDialog,
      loadingAvailableFriends,
      availableFriends,
      loadAvailableFriends,
      addMember,
      removeMember,
      getImageUrl,
      formatDate
    }
  }
}
</script>