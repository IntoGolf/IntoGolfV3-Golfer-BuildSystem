<template>
  <q-page class="q-pa-sm">
    <div class="row q-mb-sm">
      <div class="col-2">
        <q-icon
          name="arrow_back_ios"
          size="sm"
          @click="$store.dispatch('chats/edit', false)"
        />
      </div>
      <div class="col-8 text-center" style="font-size: 18px">
        Groepsinformatie
      </div>
      <div class="col-2">&nbsp;</div>
    </div>
    <q-input v-model="form.chtName" class="q-mb-md" label="Naam">
      <template v-slot:append>
        <q-icon name="save" @click="$store.dispatch('chats/setChat', form)"/>
      </template>
    </q-input>

    <div class="q-mb-sm" style="font-size: 14px; font-weight: bold">
      U kunt vrienden uitnodigen voor uw clubjes. Geef een e-mailadres op en wij
      controleren of uw vriend in ons relatiebestand aanwezig is.
    </div>
    <q-input v-model="email" label="Nodig uit voor groep">
      <template v-slot:append>
        <q-icon name="send" @click="handleInvite"/>
      </template>
    </q-input>

    <q-list bordered class="q-mt-md" separator>
      <chat-relation-item
        v-for="(item, key) in relations"
        :key="key"
        :item="item"
        :relation="item.relation"
      />
    </q-list>

    <q-btn
      class="full-width q-mt-md"
      color="red"
      label="Delete groep"
      outline
      v-on:click="handleDeleteChat"
    />

    <q-btn
      class="full-width q-mt-md"
      color="red"
      label="Verlaat groep"
      outline
      v-on:click="handleLeaveGroup"
    />

    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar color="red" icon="delete" text-color="white"/>
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
  components: {ChatRelationItem},
  data: function () {
    return {
      form: null,
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
  computed: {
    relations() {
      return this.$store.state.chats.chat.chat_relations;
    },
  },
  methods: {
    handleInvite() {
      const request = {
        chtNr: this.form.chtNr,
        email: this.email,
      };
      this.$store.dispatch("chats/invite", request);
    },
    getImageUrl(imageName) {
      // Modify the base URL as needed
      return `golfer/image?name=${encodeURIComponent(
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
