<template>
  <v-container>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Magic"
          v-bind:initial="initial.magic"
          v-bind:value="initial.magic"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Page size"
          v-bind:dec="true"
          v-bind:initial="initial.page_size"
          v-bind:value="values.page_size"
          v-on:change="(value) => handleChange('page_size', value)"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <SelectEditor
          label="Header version"
          v-bind:items="header_versions"
          v-bind:initial="initial.header_version"
          v-bind:value="values.header_version"
          v-on:change="(value) => handleChange('header_version', value)"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Header size"
          v-bind:initial="initial.header_size"
          v-bind:value="values.header_size"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ValuePresenter
          label="Image ID"
          v-bind:initial="initial.img_id"
          v-bind:value="values.img_id"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Kernel size"
          v-bind:initial="initial.kernel_size"
          v-bind:value="values.kernel_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Kernel address"
          v-bind:hex="4"
          v-bind:initial="initial.kernel_addr"
          v-bind:value="values.kernel_addr"
          v-on:change="(value) => handleChange('kernel_addr', value)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Kernel image"
          default-name="kernel.img"
          v-bind:initial="initial.kernel"
          v-bind:value="values.kernel"
          v-on:replace="(file)=> handleReplace('kernel', file)"
          v-on:remove="()=> handleRemove('kernel')"
          v-on:export="()=> handleExport('kernel', 'kernel.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Ramdisk size"
          v-bind:initial="initial.ramdisk_size"
          v-bind:value="values.ramdisk_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Ramdisk address"
          v-bind:hex="4"
          v-bind:initial="initial.ramdisk_addr"
          v-bind:value="values.ramdisk_addr"
          v-on:change="(value) => handleChange('ramdisk_addr', value)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Ramdisk image"
          default-name="ramdisk.cpio.gz"
          v-bind:initial="initial.ramdisk"
          v-bind:value="values.ramdisk"
          v-on:replace="(file)=> handleReplace('ramdisk', file)"
          v-on:remove="()=> handleRemove('ramdisk')"
          v-on:export="()=> handleExport('ramdisk', 'ramdisk.cpio.gz')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="2nd-stage BL size"
          v-bind:initial="initial.second_size"
          v-bind:value="values.second_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="2nd-stage BL address"
          v-bind:hex="4"
          v-bind:initial="initial.second_addr"
          v-bind:value="values.second_addr"
          v-on:change="(value) => handleChange('second_addr', value)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="2nd-stage BL image"
          default-name="second.img"
          v-bind:initial="initial.second"
          v-bind:value="values.second"
          v-on:replace="(file)=> handleReplace('second', file)"
          v-on:remove="()=> handleRemove('second')"
          v-on:export="()=> handleExport('second', 'second.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Tags address"
          v-bind:hex="4"
          v-bind:initial="initial.tags_addr"
          v-bind:value="values.tags_addr"
          v-on:change="(value) => handleChange('tags_addr', value)"
        />
      </v-col>
      <v-col cols="6" lg="3" v-if="values.header_version == 0">
        <ValuePresenter
          label="DT size"
          v-bind:initial="initial.dt_size"
          v-bind:value="values.dt_size"
        />
      </v-col>
      <v-col cols="12" lg="6" v-if="values.header_version == 0">
        <ImageReplacer
          label="DT image"
          default-name="dt.img"
          v-bind:initial="initial.dt"
          v-bind:value="values.dt"
          v-on:replace="(file)=> handleReplace('dt', file)"
          v-on:remove="()=> handleRemove('dt')"
          v-on:export="()=> handleExport('dt', 'dt.img')"
        />
      </v-col>
    </v-row>

    <v-row v-if="values.header_version > 0">
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO size"
          v-bind:initial="initial.recovery_dtbo_size"
          v-bind:value="values.recovery_dtbo_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO offset"
          v-bind:initial="initial.recovery_dtbo_offset"
          v-bind:value="values.recovery_dtbo_offset"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Recovery DTBO image"
          default-name="recovery_dtbo.img"
          v-bind:initial="initial.recovery_dtbo"
          v-bind:value="values.recovery_dtbo"
          v-on:replace="(file)=> handleReplace('recovery_dtbo', file)"
          v-on:remove="()=> handleRemove('recovery_dtbo')"
          v-on:export="()=> handleExport('recovery_dtbo', 'recovery_dtbo.img')"
        />
      </v-col>
    </v-row>

    <v-row v-if="values.header_version > 1">
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="DTB size"
          v-bind:initial="initial.dtb_size"
          v-bind:value="values.dtb_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="DTB address"
          v-bind:hex="4"
          v-bind:initial="initial.dtb_addr"
          v-bind:value="values.dtb_addr"
          v-on:change="(value) => handleChange('dtb_addr', value)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="DTB image"
          default-name="dtb.img"
          v-bind:initial="initial.dtb"
          v-bind:value="values.dtb"
          v-on:replace="(file)=> handleReplace('dtb', file)"
          v-on:remove="()=> handleRemove('dtb')"
          v-on:export="()=> handleExport('dtb', 'dtb.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS patch level"
          v-bind:reg="/^\d{4}-\d{2}$/"
          v-bind:initial="initial.os_patch_level"
          v-bind:value="values.os_patch_level"
          v-on:change="(value) => handleChange('os_patch_level', value)"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS version"
          v-bind:reg="/^\d+\.\d+\.\d+$/"
          v-bind:initial="initial.os_version"
          v-bind:value="values.os_version"
          v-on:change="(value) => handleChange('os_version', value)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ValueEditor
          label="Board"
          v-bind:initial="initial.board"
          v-bind:value="values.board"
          v-on:change="(value) => handleChange('board', value)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <TextEditor
          label="cmdline"
          rows="3"
          v-bind:max-length="512 + 1024"
          v-bind:initial="initial.cmdline"
          v-bind:value="values.cmdline"
          v-on:change="(value) => handleChange('cmdline', value)"
        />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import ValuePresenter from './ValuePresenter';
import ValueEditor from './ValueEditor';
import SelectEditor from './SelectEditor';
import TextEditor from './TextEditor';
import ImageReplacer from './ImageReplacer';

export default {
  name: 'Form',
  components: {
    ValuePresenter,
    ValueEditor,
    SelectEditor,
    TextEditor,
    ImageReplacer,
  },
  props: {
    initial: Object,
    values: Object,
  },
  data() {
    return {
      header_versions: [
        { value: 0, text: 'v0', size: null },
        { value: 1, text: 'v1', size: 1648 },
        { value: 2, text: 'v2', size: 1660 },
      ],
    };
  },
  methods: {
    handleChange(key, value) {
      this.$emit('change', key, value);
      if (key == 'header_version') {
        const { size } = this.header_versions.find(i => i.value == value);
        this.$emit('change', 'header_size', size);
      }
    },
    handleReplace(part, file) {
      this.$emit('replace', part, file);
    },
    handleRemove(part) {
      this.$emit('remove', part);
    },
    handleExport(part, name) {
      this.$emit('export', part, name);
    },
  },
};
</script>

<style>
.monospace .v-text-field__slot .v-text-field__prefix,
.monospace .v-text-field__slot input,
.monospace .v-text-field__slot textarea,
.monospace .v-select__selections {
  font-family: monospace;
}
</style>
