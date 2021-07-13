<template>
  <v-textarea
    class="monospace"
    v-model="model"
    v-bind:label="label"
    v-bind:messages="modified ? 'Modified' : ''"
    v-bind:rules="[handleValidate]"
    v-bind:rows="rows"
    placeholder=" "
    counter
    no-resize
  >
    <template v-slot:append v-if="modified">
      <InlineButton icon="mdi-restore" hint="Reset" v-on:click="handleReset" />
    </template>
  </v-textarea>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import InlineButton from "./InlineButton.vue";

@Component({
  components: {
    InlineButton,
  },
})
export default class TextEditor extends Vue {
  @Prop(String) label!: string;
  @Prop(String) initial!: string;
  @Prop(String) value!: string;
  @Prop(Number) maxLength?: number;
  @Prop(String) rows?: string;

  model = "";

  mounted(): void {
    this.model = this.initial;
  }

  get modified(): boolean {
    return this.value != this.initial;
  }

  @Watch("value")
  onValueChanged(value: string): void {
    this.model = value;
  }

  @Watch("model")
  onModelChanged(value: string): void {
    this.$emit("change", value);
  }

  handleReset(): void {
    this.$emit("change", this.initial);
  }

  handleValidate(value: string): boolean {
    return typeof this.maxLength != "number" || value.length <= this.maxLength;
  }

  handleBlur(): void {
    this.model = this.value;
  }
}
</script>
