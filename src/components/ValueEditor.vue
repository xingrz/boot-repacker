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
      <InlineButton
        icon="mdi-restore"
        hint="Reset"
        v-on:click="handleReset"
      />
    </template>
  </v-text-field>
</template>

<script>
import InlineButton from './InlineButton';

export default {
  name: 'ValueEditor',
  components: {
    InlineButton,
  },
  props: {
    label: String,
    initial: null,
    value: null,
    dec: Boolean,
    hex: Number,
    reg: RegExp,
  },
  data() {
    return {
      model: this.format(this.initial),
    };
  },
  computed: {
    modified() {
      return this.value != this.initial;
    },
  },
  watch: {
    value(value) {
      this.model = this.format(value);
    },
    model(value) {
      const v = this.parse(value);
      if (v != this.value) {
        this.$emit('change', v);
      }
    },
  },
  methods: {
    handleReset() {
      this.$emit('change', this.initial);
    },
    handleValidate(value) {
      if (this.dec) {
        return !isNaN(this.parse(value));
      } else if (this.hex) {
        return !isNaN(this.parse(value)) && value.length == this.hex * 2;
      } else if (this.reg) {
        return typeof value == 'string' && !!value.match(this.reg);
      } else {
        return true;
      }
    },
    handleBlur() {
      this.model = this.format(this.value);
    },
    format(value) {
      if (this.hex > 0) {
        return value.toString(16).toUpperCase().padStart(this.hex * 2, '0');
      } else {
        return value;
      }
    },
    parse(str) {
      if (this.dec) {
        return parseInt(str);
      } else if (this.hex) {
        return parseInt(str, 16);
      } else {
        return str;
      }
    },
  },
};
</script>
