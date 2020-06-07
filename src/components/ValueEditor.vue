<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="value"
    v-bind:prefix="hex ? '0x' : ''"
    placeholder=" "
    messages="Modified"
  >
    <template v-slot:append>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px">
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
    value: String,
    dec: Boolean,
    hex: Boolean,
  },
};
</script>
