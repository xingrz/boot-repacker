<template>
  <v-select
    class="monospace"
    v-model="model"
    v-bind:items="items"
    v-bind:label="label"
    v-bind:messages="modified ? 'Modified' : ''"
  >
    <template v-slot:append-outer v-if="modified">
      <InlineButton icon="mdi-restore" hint="Reset" v-on:click="handleReset" />
    </template>
  </v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import InlineButton from "./InlineButton.vue";

@Component({
  components: {
    InlineButton,
  },
})
export default class SelectEditor<T = string | number> extends Vue {
  @Prop(String) label!: string;
  @Prop(Array) items!: { value: T; text: string }[];
  @Prop() initial!: T | null;
  @Prop() value!: T | null;

  model: T | null = null;

  mounted(): void {
    this.model = this.initial;
  }

  get modified(): boolean {
    return this.value != this.initial;
  }

  @Watch("value")
  onValueChanged(value: T): void {
    this.model = value;
  }

  @Watch("model")
  onModelChanged(value: T): void {
    this.$emit("change", value);
  }

  handleReset(): void {
    this.$emit("change", this.initial);
  }
}
</script>
