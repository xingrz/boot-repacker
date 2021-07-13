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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import fileDialog from "file-dialog";

import InlineButton from "./InlineButton.vue";

@Component({
  components: {
    InlineButton,
  },
})
export default class ImageReplacer extends Vue {
  @Prop(String) label!: string;
  @Prop(String) defaultName!: string;
  @Prop() initial!: File | null;
  @Prop() value!: File | null;

  get name(): string | null {
    if (this.modified && this.value instanceof File) return this.value.name;
    if (this.removed || !this.presence) return null;
    return this.defaultName;
  }

  get presence(): boolean {
    return this.initial != null;
  }

  get modified(): boolean {
    return this.initial != this.value;
  }

  get removed(): boolean {
    return this.modified && this.value == null;
  }

  async handleReplace(): Promise<void> {
    const [file] = await fileDialog();
    this.$emit("replace", file);
  }

  handleRemove(): void {
    this.$emit("remove");
  }

  handleReset(): void {
    this.$emit("replace", null);
  }

  handleExport(): void {
    this.$emit("export");
  }
}
</script>
