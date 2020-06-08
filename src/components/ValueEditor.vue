<template>
  <v-text-field
    class="monospace"
    v-model="value"
    v-bind:label="label"
    v-bind:prefix="hex ? '0x' : ''"
    v-bind:messages="modified ? 'Modified' : ''"
    v-bind:rules="[() => handleValidate(value)]"
    placeholder=" "
  >
    <template v-slot:append v-if="modified">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px" v-on:click="handleReset">
            <v-icon>mdi-restore</v-icon>
          </v-btn>
        </template>
        <span>Reset</span>
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'ValueEditor',
  props: {
    label: String,
    initial: null,
    dec: Boolean,
    hex: Number,
  },
  data() {
    return {
      value: this.format(this.initial),
    };
  },
  computed: {
    modified() {
      return this.value != this.format(this.initial);
    },
  },
  watch: {
    value(value) {
      if (this.dec || this.hex) {
        const v = this.parse(value);
        if (!isNaN(v)) {
          const s = this.format(v);
          if (s != value) {
            this.$nextTick(() => this.value = s);
          }
        }
      }
    },
  },
  methods: {
    handleReset() {
      this.value = this.format(this.initial);
    },
    handleValidate(value) {
      if (this.dec) {
        return !isNaN(this.parse(value));
      } else if (this.hex) {
        return !isNaN(this.parse(value)) && value.length == this.hex * 2;
      } else {
        return !!value;
      }
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
