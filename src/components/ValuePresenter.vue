<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="value"
    v-bind:messages="value != initial ? 'Modified' : ''"
    placeholder="Not present"
    disabled
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ValuePresenter<T = string | number> extends Vue {
  @Prop(String) label!: string;
  @Prop() initial!: T | null;
  @Prop() value!: T | null;
}
</script>
