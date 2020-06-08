<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="value"
    disabled
  />
</template>

<script>
export default {
  name: 'ValuePresenter',
  props: {
    label: String,
    value: null,
  },
};
</script>
