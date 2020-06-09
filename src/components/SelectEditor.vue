<template>
  <v-select
    class="monospace"
    v-model="model"
    v-bind:items="items"
    v-bind:label="label"
    v-bind:messages="modified ? 'Modified' : ''"
  >
    <template v-slot:append-outer v-if="modified">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px" v-on:click="handleReset">
            <v-icon>mdi-restore</v-icon>
          </v-btn>
        </template>
        <span>Reset</span>
      </v-tooltip>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'SelectEditor',
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
