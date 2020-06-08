<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8">
            <v-expansion-panels accordion mandatory v-model="panel" v-bind:readonly="!file">
              <v-expansion-panel>
                <v-expansion-panel-header><strong>1. Open an existing image</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <FileDrop v-on:change="handleFile" />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>2. Customize</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <Form
                    v-bind:initial="initial"
                    v-on:export="handleExport"
                  />
                  <div class="d-flex">
                    <v-btn color="primary" text><v-icon left>mdi-restore</v-icon> Reset all</v-btn>
                    <v-btn color="primary" text class="ml-auto" style="margin-right: 1em;" v-on:click="panel = 0">Back</v-btn>
                    <v-btn color="primary" depressed v-on:click="panel = 2">Next</v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>3. Export</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column justify-center align-center" style="padding-top: 40px; padding-bottom: 40px;">
                    <v-btn color="primary" depressed large>
                      <v-icon left>mdi-download</v-icon> Export
                    </v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { saveAs } from 'file-saver';

import FileDrop from './components/FileDrop';
import Form from './components/Form';

import readFile from './utils/readFile';
import parseImage from './utils/parseImage';
import exportImage from './utils/exportImage'

export default {
  name: 'App',
  components: {
    FileDrop,
    Form,
  },
  data() {
    return {
      panel: 0,
      file: null,
      blob: null,
      initial: {},
    };
  },
  methods: {
    async handleFile(file) {
      this.file = file;
      if (!file) return;
      try {
        this.blob = await readFile(file);
        this.initial = parseImage(this.blob);
        this.values = { ...this.initial };
        this.panel = 1;
      } catch (e) {
        this.file = null;
      }
    },
    handleExport(part, name) {
      const image = exportImage(this.blob, this.initial, part);
      const blob = new Blob([ image ]);
      saveAs(blob, name);
    },
  },
};
</script>
