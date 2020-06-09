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
      <InlineButton
        icon="mdi-restore"
        hint="Reset"
        v-on:click="handleReset"
      />
    </template>
  </v-textarea>
</template>

<script>
import InlineButton from './InlineButton';

export default {
  name: 'TextEditor',
  components: {
    InlineButton,
  },
  props: {
    label: String,
    initial: String,
    value: String,
    maxLength: Number,
    rows: null,
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
    handleValidate(value) {
      return typeof this.maxLength != 'number' || value.length <= this.maxLength;
    },
    handleBlur() {
      this.model = this.format(this.value);
    },
  },
};
</script>
