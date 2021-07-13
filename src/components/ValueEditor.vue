<template>
  <v-text-field
    class="monospace"
    v-model="model"
    v-bind:label="label"
    v-bind:prefix="hex ? '0x' : ''"
    v-bind:messages="modified ? 'Modified' : ''"
    v-bind:rules="[handleValidate]"
    v-on:blur="handleBlur"
    placeholder=" "
  >
    <template v-slot:append v-if="modified">
      <InlineButton icon="mdi-restore" hint="Reset" v-on:click="handleReset" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import InlineButton from "./InlineButton.vue";

@Component({
  components: {
    InlineButton,
  },
})
export default class ValueEditor<T = string | number> extends Vue {
  @Prop(String) label!: string;
  @Prop() initial!: T | null;
  @Prop() value!: T | null;
  @Prop(Boolean) dec?: boolean;
  @Prop(Number) hex?: number;
  @Prop(RegExp) reg?: RegExp;

  model = "";

  mounted(): void {
    this.model = this.format(this.initial);
  }

  get modified(): boolean {
    return this.value != this.initial;
  }

  @Watch("value")
  onValueChanged(value: T): void {
    this.model = this.format(value);
  }

  @Watch("model")
  onModelChanged(value: string): void {
    const v = this.parse(value);
    if (v != this.value) {
      this.$nextTick(() => {
        this.$emit("change", v);
      });
    }
  }

  handleReset(): void {
    this.model = this.format(this.initial);
  }

  handleValidate(value: string): boolean {
    if (this.dec) {
      return !isNaN(this.parse(value) as unknown as number);
    } else if (this.hex) {
      return (
        !isNaN(this.parse(value) as unknown as number) &&
        value.length == this.hex * 2
      );
    } else if (this.reg) {
      return typeof value == "string" && !!value.match(this.reg);
    } else {
      return true;
    }
  }

  handleBlur(): void {
    this.model = this.format(this.value);
  }

  format(value: T | null): string {
    if (this.hex && this.hex > 0) {
      if (isNaN(value as unknown as number)) {
        return "0";
      } else {
        return (value as unknown as number)
          .toString(16)
          .toUpperCase()
          .padStart(this.hex * 2, "0");
      }
    } else if (this.dec) {
      return isNaN(value as unknown as number) ? "0" : `${value}`;
    } else {
      return value as unknown as string;
    }
  }

  parse(str: string): T {
    if (this.dec) {
      return parseInt(str) as unknown as T;
    } else if (this.hex) {
      return parseInt(str, 16) as unknown as T;
    } else {
      return str as unknown as T;
    }
  }
}
</script>
