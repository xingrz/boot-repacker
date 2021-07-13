<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8">
            <header>
              <h1>Boot Repacker by MoKee</h1>
            </header>

            <v-expansion-panels
              accordion
              mandatory
              v-model="panel"
              v-bind:readonly="!file"
            >
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <strong v-if="file == null">1. Open an existing image</strong>
                  <strong v-else>1. Image: {{ file.name }}</strong>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <FileDrop v-on:change="handleFile" />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <strong>2. Customize</strong>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <Form
                    v-bind:initial="initial"
                    v-bind:values="values"
                    v-on:change="handleChange"
                    v-on:replace="handleReplace"
                    v-on:remove="handleRemove"
                    v-on:export="handleExport"
                  />
                  <div class="d-flex">
                    <v-btn color="primary" text v-on:click="handleResetAll"
                      ><v-icon left>mdi-restore</v-icon> Reset all</v-btn
                    >
                    <v-btn
                      color="primary"
                      text
                      class="ml-auto"
                      style="margin-right: 1em"
                      v-on:click="panel = 0"
                      >Back</v-btn
                    >
                    <v-btn color="primary" depressed v-on:click="panel = 2"
                      >Next</v-btn
                    >
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <strong>3. Export</strong>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div
                    class="d-flex flex-column justify-center align-center"
                    style="padding-top: 40px; padding-bottom: 40px"
                  >
                    <v-btn
                      color="primary"
                      depressed
                      large
                      v-on:click="handleBuild"
                    >
                      <v-icon left>mdi-download</v-icon> Export
                    </v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <footer>Copyright &copy; 2020 MoKee Open Source Project</footer>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { saveAs } from "file-saver";
import { debounce } from "throttle-debounce";

import FileDrop from "./components/FileDrop.vue";
import Form from "./components/Form.vue";

import readFile from "./utils/readFile";
import parseImage, { IImageMeta, IImagePartName } from "./utils/parseImage";
import exportImage from "./utils/exportImage";
import buildImage from "./utils/buildImage";
import calculateImageId from "./utils/calculateImageId";
import calculatePosition from "./utils/calculatePosition";

type IMetaValue = string | number | File | null;

@Component({
  components: {
    FileDrop,
    Form,
  },
})
export default class App extends Vue {
  panel = 0;

  file: File | null = null;
  blob: ArrayBuffer | null = null;

  initial: Record<string, IMetaValue> = {};
  values: Record<string, IMetaValue> = {};

  constructor() {
    super();
    this.updateImageId = debounce(200, this.updateImageId).bind(this);
  }

  async handleFile(file: File): Promise<void> {
    this.file = file;
    if (!file) return;
    try {
      this.blob = await readFile(file);
      if (!this.blob) return;

      this.initial = parseImage(this.blob) as unknown as Record<
        string,
        string | number
      >;

      this.values = { ...this.initial };
      this.panel = 1;
    } catch (e) {
      console.error("Failed parsing image", e);
      this.file = null;
    }
  }

  handleChange(key: string, value: string | number): void {
    this.values = { ...this.values, [key]: value };
  }

  handleResetAll(): void {
    this.values = { ...this.initial };
  }

  updateRecoveryDtboOffset(): void {
    const part = calculatePosition(
      "recovery_dtbo",
      this.values as unknown as IImageMeta
    );
    if (!part) return;
    this.values = {
      ...this.values,
      recovery_dtbo_offset: part.size > 0 ? part.offset : 0,
    };
  }

  async updateImageId(): Promise<void> {
    if (!this.blob) return;
    const img_id = await calculateImageId(
      this.blob,
      this.values as unknown as IImageMeta
    );
    this.values = { ...this.values, img_id: img_id.toString("hex") };
  }

  handleReplace(part: IImagePartName, file: File): void {
    const size = `${part}_size`;
    if (file) {
      this.values = {
        ...this.values,
        [part]: file,
        [size]: file.size,
      };
    } else {
      this.values = {
        ...this.values,
        [part]: this.initial[part],
        [size]: this.initial[size],
      };
    }
    this.updateRecoveryDtboOffset();
    this.updateImageId();
  }

  handleRemove(part: IImagePartName): void {
    const size = `${part}_size`;
    this.values = {
      ...this.values,
      [part]: null,
      [size]: 0,
    };
    this.updateRecoveryDtboOffset();
    this.updateImageId();
  }

  handleExport(part: IImagePartName, name: string): void {
    if (!this.blob) return;
    const image = exportImage(
      this.blob,
      this.initial as unknown as IImageMeta,
      part
    );
    const blob = new Blob([image]);
    saveAs(blob, name);
  }

  async handleBuild(): Promise<void> {
    if (!this.file || !this.blob) return;
    const image = await buildImage(
      this.blob,
      this.values as unknown as IImageMeta
    );
    const blob = new Blob([image]);
    saveAs(blob, `${this.file.name}-rebuilt.img`);
  }
}
</script>

<style>
header {
  text-align: center;
  margin: 0 0 20px;
}

header h1 {
  font-size: 24px;
  font-weight: normal;
}

footer {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 10px 0 0;
}
</style>
