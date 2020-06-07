<template>
  <upload
    class="upload"
    ref="upload"
    extensions="img"
    v-model="files"
    v-bind:drop="true"
    v-bind:drop-directory="false"
    v-on:input-file="selectFile"
  >
    <div class="upload-hint active" v-if="uploader && uploader.dropActive" v-html="'Drop the image here'" />
    <div class="upload-hint selected" v-else-if="selected">{{selected ? selected.name : null}}</div>
    <div class="upload-hint" v-else v-html="'Drop or <a>select</a> an image'" />
  </upload>
</template>

<script>
import upload from 'vue-upload-component';

export default {
  name: 'App',
  components: {
    upload,
  },
  data() {
    return {
      files: [],
      uploader: null,
      selected: null,
    };
  },
  mounted() {
    this.uploader = this.$refs.upload;
  },
  methods: {
    selectFile(file) {
      if (!file) {
        this.selected = null;
      } else if (!file.name.endsWith('.img')) {
        this.selected = null;
      } else {
        this.selected = file.file;
      }
    },
  },
};
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
  background: #BBDEFB;
  border-color: #64B5F6;
}

.upload-hint.selected {
  border-color: #1E88E5;
}
</style>
