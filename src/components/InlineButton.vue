<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        x-small
        style="margin-top: 2px"
        v-bind:disabled="disabled"
        v-on="on"
        v-on:click="handleClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ hint }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class InlineButton extends Vue {
  @Prop(String) icon!: string;
  @Prop(String) hint!: string;
  @Prop(Boolean) disabled!: boolean;

  handleClick(): void {
    this.$emit("click");
  }
}
</script>
