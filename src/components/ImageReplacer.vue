<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="name"
    v-bind:messages="modified ? 'Modified' : ''"
    v-bind:placeholder="removed ? 'Removed' : 'Not present'"
    readonly
  >
    <template v-slot:append>
      <template v-if="!modified">
        <InlineButton
          icon="mdi-dots-vertical"
          hint="Replace"
          v-on:click="handleReplace"
        />
        <InlineButton
          v-if="presence"
          icon="mdi-close"
          hint="Remove"
          v-on:click="handleRemove"
        />
      </template>
      <template v-else>
        <InlineButton
          icon="mdi-restore"
          hint="Reset"
          v-on:click="handleReset"
        />
      </template>
    </template>

    <template v-slot:append-outer>
      <InlineButton
        icon="mdi-download"
        hint="Export"
        v-bind:disabled="!presence || modified"
        v-on:click="handleExport"
      />
    </template>
  </v-text-field>
</template>

<script>
import fileDialog from 'file-dialog';

import InlineButton from './InlineButton';

export default {
  name: 'ImageReplacer',
  components: {
    InlineButton,
  },
  props: {
    label: String,
    defaultName: String,
    initial: null,
    value: null,
  },
  computed: {
    name() {
      if (this.replaced) return this.value.name;
      if (this.removed || !this.presence) return null;
      return this.defaultName;
    },
    presence() {
      return this.initial != null;
    },
    modified() {
      return this.initial != this.value;
    },
    removed() {
      return this.modified && this.value == null;
    },
    replaced() {
      return this.modified && this.value instanceof File;
    },
  },
  methods: {
    async handleReplace() {
      const [file] = await fileDialog();
      this.$emit('replace', file);
    },
    handleRemove() {
      this.$emit('remove');
    },
    handleReset() {
      this.$emit('replace', null);
    },
    handleExport() {
      this.$emit('export');
    },
  },
};
</script>
