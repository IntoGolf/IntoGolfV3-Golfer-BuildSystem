<template>
  <div>
    <!-- Nieuwe groep knop -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">Mijn Groepen</div>
      <q-btn color="primary" label="Nieuwe Groep" @click="showCreateGroupDialog = true" />
    </div>

    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="groups.owned_groups.length === 0 && groups.member_groups.length === 0" 
         class="text-center q-pa-md text-grey-6">
      <q-icon name="groups" size="4em" class="q-mb-md" />
      <div>Je hebt nog geen groepen</div>
      <div class="text-caption">Maak een groep om vrienden te organiseren</div>
    </div>

    <div v-else>
      <!-- Eigen groepen -->
      <div v-if="groups.owned_groups.length > 0" class="q-mb-lg">
        <div class="text-subtitle1 text-weight-medium q-mb-md">Mijn Groepen</div>
        <q-list separator>
          <q-item 
            v-for="group in groups.owned_groups" 
            :key="group.id" 
            class="q-pa-md"
            clickable
            @click="viewGroup(group)"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="50px">
                <q-icon name="groups" size="30px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ group.name }}</q-item-label>
              <q-item-label caption v-if="group.description">{{ group.description }}</q-item-label>
              <q-item-label caption>
                {{ group.member_count }} {{ group.member_count === 1 ? 'lid' : 'leden' }}
              </q-item-label>
              <q-item-label caption class="text-grey-5">
                Eigenaar • {{ formatDate(group.created_at) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click.stop="editGroup(group)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click.stop="deleteGroup(group)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Groepen waar ik lid van ben -->
      <div v-if="groups.member_groups.length > 0">
        <div class="text-subtitle1 text-weight-medium q-mb-md">Groepen waar ik lid van ben</div>
        <q-list separator>
          <q-item 
            v-for="group in groups.member_groups" 
            :key="group.id" 
            class="q-pa-md"
            clickable
            @click="viewGroup(group)"
          >
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white" size="50px">
                <q-icon name="groups" size="30px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ group.name }}</q-item-label>
              <q-item-label caption v-if="group.description">{{ group.description }}</q-item-label>
              <q-item-label caption>
                {{ group.member_count }} {{ group.member_count === 1 ? 'lid' : 'leden' }}
              </q-item-label>
              <q-item-label caption class="text-grey-5">
                Eigenaar: {{ group.owner_name }} • {{ formatDate(group.created_at) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                flat
                round
                color="negative"
                icon="exit_to_app"
                @click.stop="leaveGroup(group)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Nieuwe groep dialog -->
    <q-dialog v-model="showCreateGroupDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nieuwe Groep Maken</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newGroup.name"
            label="Groepsnaam"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Groepsnaam is verplicht']"
          />
          <q-input
            v-model="newGroup.description"
            label="Beschrijving (optioneel)"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuleren" @click="showCreateGroupDialog = false" />
          <q-btn flat label="Maken" @click="createGroup" :loading="creatingGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Bewerk groep dialog -->
    <q-dialog v-model="showEditGroupDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Groep Bewerken</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editingGroup.name"
            label="Groepsnaam"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Groepsnaam is verplicht']"
          />
          <q-input
            v-model="editingGroup.description"
            label="Beschrijving (optioneel)"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuleren" @click="showEditGroupDialog = false" />
          <q-btn flat label="Opslaan" @click="updateGroup" :loading="updatingGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Groep details dialog -->
    <q-dialog v-model="showGroupDetailsDialog" maximized>
      <friend-group-details
        v-if="selectedGroup"
        :group="selectedGroup"
        @close="showGroupDetailsDialog = false"
        @refresh="loadGroups"
      />
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'
import FriendGroupDetails from './FriendGroupDetails.vue'

export default {
  name: 'FriendGroupsTab',
  components: {
    FriendGroupDetails
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    
    const loading = ref(false)
    const creatingGroup = ref(false)
    const updatingGroup = ref(false)
    
    const groups = ref({ owned_groups: [], member_groups: [] })
    const showCreateGroupDialog = ref(false)
    const showEditGroupDialog = ref(false)
    const showGroupDetailsDialog = ref(false)
    
    const newGroup = ref({ name: '', description: '' })
    const editingGroup = ref({ id: null, name: '', description: '' })
    const selectedGroup = ref(null)

    const loadGroups = async () => {
      loading.value = true
      try {
        const response = await proxy.$axios.get('golfer/friend-groups')
        groups.value = response || { owned_groups: [], member_groups: [] }
      } catch (error) {
        console.error('Error loading groups:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van groepen'
        })
      } finally {
        loading.value = false
      }
    }

    const createGroup = async () => {
      if (!newGroup.value.name.trim()) return

      creatingGroup.value = true
      try {
        await proxy.$axios.post('golfer/friend-group', {
          name: newGroup.value.name.trim(),
          description: newGroup.value.description.trim()
        })
        
        $q.notify({
          type: 'positive',
          message: 'Groep succesvol aangemaakt'
        })
        
        showCreateGroupDialog.value = false
        newGroup.value = { name: '', description: '' }
        loadGroups()
        emit('refresh')
      } catch (error) {
        console.error('Error creating group:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij aanmaken van groep'
        })
      } finally {
        creatingGroup.value = false
      }
    }

    const editGroup = (group) => {
      editingGroup.value = {
        id: group.id,
        name: group.name,
        description: group.description || ''
      }
      showEditGroupDialog.value = true
    }

    const updateGroup = async () => {
      if (!editingGroup.value.name.trim()) return

      updatingGroup.value = true
      try {
        await proxy.$axios.put('golfer/friend-group', {
          group_id: editingGroup.value.id,
          name: editingGroup.value.name.trim(),
          description: editingGroup.value.description.trim()
        })
        
        $q.notify({
          type: 'positive',
          message: 'Groep succesvol bijgewerkt'
        })
        
        showEditGroupDialog.value = false
        loadGroups()
        emit('refresh')
      } catch (error) {
        console.error('Error updating group:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij bijwerken van groep'
        })
      } finally {
        updatingGroup.value = false
      }
    }

    const deleteGroup = (group) => {
      $q.dialog({
        title: 'Groep verwijderen',
        message: `Weet je zeker dat je de groep "${group.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.delete('golfer/friend-group', {
            data: { group_id: group.id }
          })
          
          $q.notify({
            type: 'positive',
            message: 'Groep verwijderd'
          })
          
          loadGroups()
          emit('refresh')
        } catch (error) {
          console.error('Error deleting group:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij verwijderen van groep'
          })
        }
      })
    }

    const leaveGroup = (group) => {
      $q.dialog({
        title: 'Groep verlaten',
        message: `Weet je zeker dat je de groep "${group.name}" wilt verlaten?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await proxy.$axios.post('golfer/friend-group/leave', {
            group_id: group.id
          })
          
          $q.notify({
            type: 'positive',
            message: 'Groep verlaten'
          })
          
          loadGroups()
          emit('refresh')
        } catch (error) {
          console.error('Error leaving group:', error)
          $q.notify({
            type: 'negative',
            message: 'Fout bij verlaten van groep'
          })
        }
      })
    }

    const viewGroup = async (group) => {
      try {
        const response = await proxy.$axios.get('golfer/friend-group', {
          params: { group_id: group.id }
        })
        selectedGroup.value = response
        showGroupDetailsDialog.value = true
      } catch (error) {
        console.error('Error loading group details:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van groepsdetails'
        })
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('nl-NL')
    }

    onMounted(() => {
      loadGroups()
    })

    return {
      loading,
      creatingGroup,
      updatingGroup,
      groups,
      showCreateGroupDialog,
      showEditGroupDialog,
      showGroupDetailsDialog,
      newGroup,
      editingGroup,
      selectedGroup,
      loadGroups,
      createGroup,
      editGroup,
      updateGroup,
      deleteGroup,
      leaveGroup,
      viewGroup,
      formatDate
    }
  }
}
</script>