<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8">
            <v-expansion-panels accordion mandatory v-model="panel" v-bind:readonly="!file">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <strong v-if="file == null">1. Open an existing image</strong>
                  <strong v-else>1. Image: {{file.name}}</strong>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <FileDrop v-on:change="handleFile" />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>2. Customize</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <Form
                    v-bind:initial="initial"
                    v-bind:values="values"
                    v-bind:images="images"
                    v-on:change="handleChange"
                    v-on:replace="handleReplace"
                    v-on:remove="handleRemove"
                    v-on:export="handleExport"
                  />
                  <div class="d-flex">
                    <v-btn color="primary" text v-on:click="handleResetAll"><v-icon left>mdi-restore</v-icon> Reset all</v-btn>
                    <v-btn color="primary" text class="ml-auto" style="margin-right: 1em;" v-on:click="panel = 0">Back</v-btn>
                    <v-btn color="primary" depressed v-on:click="panel = 2">Next</v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>3. Export</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column justify-center align-center" style="padding-top: 40px; padding-bottom: 40px;">
                    <v-btn color="primary" depressed large v-on:click="handleBuild">
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
import buildImage from './utils/buildImage';
import calculatePosition from './utils/calculatePosition';

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
      values: {},
      images: {},
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
        this.images = {};
        this.panel = 1;
      } catch (e) {
        this.file = null;
      }
    },
    handleChange(key, value) {
      this.values = { ...this.values, [key]: value };
    },
    handleResetAll() {
      this.values = { ...this.initial };
      this.images = {};
    },
    updateRecoveryDtboOffset() {
      const { offset, size } = calculatePosition('recovery_dtbo', this.values);
      this.values = { ...this.values, recovery_dtbo_offset: (size > 0 ? offset : 0) };
    },
    handleReplace(part, file) {
      const sizeKey = `${part}_size`;
      this.images = { ...this.images, [part]: file };
      if (file) {
        this.values = { ...this.values, [sizeKey]: file.size };
      } else {
        this.values = { ...this.values, [sizeKey]: this.initial[sizeKey] };
      }
      this.updateRecoveryDtboOffset();
    },
    handleRemove(part) {
      this.images = { ...this.images, [part]: { removed: true } };
      this.values = { ...this.values, [`${part}_size`]: 0 };
      this.updateRecoveryDtboOffset();
    },
    handleExport(part, name) {
      const image = exportImage(this.blob, this.initial, part);
      const blob = new Blob([ image ]);
      saveAs(blob, name);
    },
    async handleBuild() {
      const image = await buildImage(this.blob, this.initial, this.values, this.images);
      const blob = new Blob([ image ]);
      saveAs(blob, `${this.file.name}-rebuilt.img`);
    },
  },
};
</script>
