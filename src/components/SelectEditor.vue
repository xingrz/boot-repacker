<template>
  <v-select
    class="monospace"
    v-model="model"
    v-bind:items="items"
    v-bind:label="label"
    v-bind:messages="modified ? 'Modified' : ''"
  >
    <template v-slot:append-outer v-if="modified">
      <InlineButton
        icon="mdi-restore"
        hint="Reset"
        v-on:click="handleReset"
      />
    </template>
  </v-select>
</template>

<script>
import InlineButton from './InlineButton';

export default {
  name: 'SelectEditor',
  components: {
    InlineButton,
  },
  props: {
    label: String,
    items: Array,
    initial: null,
    value: null,
  },
  data() {
    return {
      model: this.initial,
    };
  },
  computed: {
    modified() {
      return this.value != this.initial;
    },
  },
  watch: {
    value(value) {
      this.model = value;
    },
    model(value) {
      this.$emit('change', value);
    },
  },
  methods: {
    handleReset() {
      this.$emit('change', this.initial);
    },
  },
};
</script>
