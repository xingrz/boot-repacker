<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon x-small
        style="margin-top: 2px"
        v-bind:disabled="disabled"
        v-on="on"
        v-on:click="handleClick"
      >
        <v-icon>{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{hint}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'InlineButton',
  props: {
    icon: String,
    hint: String,
    disabled: Boolean,
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
