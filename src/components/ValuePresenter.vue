<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="value"
    v-bind:messages="value != initial ? 'Modified' : ''"
    placeholder=" "
    disabled
  />
</template>

<script>
export default {
  name: 'ValuePresenter',
  props: {
    label: String,
    initial: null,
    value: null,
  },
};
</script>
