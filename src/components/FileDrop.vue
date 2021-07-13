<template>
  <Upload
    class="upload"
    ref="upload"
    accept=".img"
    v-model="files"
    v-bind:drop="true"
    v-bind:drop-directory="false"
    v-on:input-file="selectFile"
  >
    <div
      class="upload-hint active"
      v-if="uploader && uploader.dropActive"
      v-html="'Drop the image here'"
    />
    <div class="upload-hint selected" v-else-if="selected">
      {{ selected ? selected.name : null }}
    </div>
    <div class="upload-hint" v-else v-html="'Drop or <a>select</a> an image'" />
  </Upload>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Upload from "vue-upload-component";

@Component({
  components: {
    Upload,
  },
})
export default class FileDrop extends Vue {
  files: File[] = [];
  uploader: Upload | null = null;
  selected: File | null = null;

  mounted(): void {
    this.uploader = this.$refs.upload as Upload;
  }

  @Watch("selected")
  onSelectedChanged(file: File | null): void {
    this.$emit("change", file);
  }

  selectFile(file: { name: string; file: File } | null): void {
    if (!file) {
      this.selected = null;
    } else if (!file.name.endsWith(".img")) {
      this.selected = null;
    } else {
      this.selected = file.file;
    }
  }
}
</script>

<style>
.upload {
  display: block;
  width: 100%;
}

.upload * {
  cursor: pointer;
}

.upload-hint {
  text-align: center;
  padding: 40px 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 2px dotted #eee;
  border-radius: 8px;
  transition: background, border-color 300ms;
}

.upload-hint.active {
  background: #bbdefb;
  border-color: #64b5f6;
}

.upload-hint.selected {
  border-color: #1e88e5;
}
</style>
