<template>
  <q-page>
    <div class="row q-pa-sm chat-form">
      <div class="col-2" @click="$store.dispatch('chats/edit', false)">
        <q-icon name="arrow_back_ios" size="sm" />
      </div>
      <div class="col-8 text-center" style="font-size: 18px">
        Groepsinformatie
      </div>
      <div class="col-2">&nbsp;</div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-input v-model="form.chtName" class="q-mb-md" label="Naam">
          <template v-slot:append>
            <q-icon
              name="save"
              @click="$store.dispatch('chats/setChat', form)"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-pa-sm" style="font-size: 14px; font-weight: bold">
      <div class="col-12">
        U kunt vrienden uitnodigen voor uw clubjes. Geef een e-mailadres op en
        wij controleren of uw vriend in ons relatiebestand aanwezig is.
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-input
          v-model="email"
          :disable="this.$store.state.chats.chat.chtNr === null"
          label="Nodig uit voor groep"
        >
          <template v-slot:append>
            <q-icon
              :disable="this.$store.state.chats.chat.chtNr === null"
              name="send"
              @click="handleInvite"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-list bordered class="q-mt-md" separator>
          <chat-relation-item
            v-for="(item, key) in relations"
            :key="key"
            :item="item"
            :relation="item.relation"
          />
        </q-list>
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-btn
          :disable="this.$store.state.chats.chat.chtNr === null"
          class="full-width q-mt-md"
          color="red"
          label="Delete groep"
          outline
          v-on:click="handleDeleteChat"
        />

        <q-btn
          :disable="this.$store.state.chats.chat.chtNr === null"
          class="full-width q-mt-md"
          color="red"
          label="Verlaat groep"
          outline
          v-on:click="handleLeaveGroup"
        />
      </div>
    </div>

    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar color="red" icon="delete" text-color="white" />
          <span v-if="confirmDeleteChat" class="q-ml-sm"
            >Weet u zeker dat u deze groep witl verwijderen? Deze actie kan niet
            teruggedraaid worden!</span
          >
          <span v-else-if="confirmLeaveGroup" class="q-ml-sm"
            >Weet u zeker dat u deze groep witl verlaten?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="primary"
            flat
            label="Annuleer"
            v-on:click="cancelConfirm"
          />
          <q-btn
            v-close-popup
            :label="
              'Ja, ' + (confirmDeleteChat ? 'verwijder' : 'groep verlaten')
            "
            color="primary"
            flat
            v-on:click="handleDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ChatRelationItem from "components/chats/chatRelationItem.vue";

export default {
  components: { ChatRelationItem },
  data: function () {
    return {
      form: null,
      isNew: this.$store.state.chats.chat.chtNr === null,
      email: "",
      showConfirm: false,
      confirmDeleteChat: false,
      confirmLeaveGroup: false,
    };
  },
  watch: {
    confirmDeleteChat(value) {
      this.showConfirm = value;
    },
    confirmLeaveGroup(value) {
      this.showConfirm = value;
    },
  },
  created: function () {
    this.form = this.$store.state.chats.chat;
  },
  unmounted() {
    if (this.isNew) {
      this.$store.dispatch("chats/fetchChats");
    }
  },
  computed: {
    relations() {
      return this.$store.state.chats.relations;
    },
  },
  methods: {
    handleInvite() {
      const request = {
        chtNr: this.$store.state.chats.chat.chtNr,
        email: this.email,
      };
      this.$store.dispatch("chats/invite", request);
    },
    getImageUrl(imageName) {
      // Modify the base URL as needed
      return `public/image?name=${encodeURIComponent(
        imageName
      )}&t=${new Date().getTime()}`;
    },
    handleDeleteChat() {
      this.confirmDeleteChat = true;
    },
    handleLeaveGroup() {
      this.confirmLeaveGroup = true;
    },
    cancelConfirm() {
      this.confirmDeleteChat = false;
      this.confirmLeaveGroup = false;
    },
    handleDelete() {
      if (this.confirmDeleteChat) {
        this.$store.dispatch("chats/delete");
      } else if (this.confirmLeaveGroup) {
      }
    },
  },
};
</script>

<style>
.chat-form {
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
}
</style>
