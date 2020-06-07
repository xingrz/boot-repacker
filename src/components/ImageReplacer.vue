<template>
  <v-text-field
    class="monospace"
    v-bind:label="label"
    v-bind:value="value"
    readonly
  >
    <template v-slot:append>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <span>Replace</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Remove</span>
      </v-tooltip>

    </template>

    <template v-slot:append-outer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on" style="margin-top: 2px">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>Export</span>
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'ImageReplacer',
  props: {
    label: String,
    value: String,
  },
};
</script>
