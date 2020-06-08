<template>
  <v-container>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Magic"
          v-bind:value="initial.magic"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Page size"
          v-bind:dec="true"
          v-bind:initial="initial.page_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <v-select
          label="Header version"
          v-bind:items="['v0', 'v1', 'v2']"
          v-bind:value="`v${initial.header_version}`"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Header size"
          v-bind:value="initial.header_size"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ValuePresenter
          label="Image ID"
          v-bind:value="initial.img_id"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Kernel size"
          v-bind:value="initial.kernel_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Kernel address"
          v-bind:hex="4"
          v-bind:initial="initial.kernel_addr"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Kernel image"
          value="kernel.img"
          v-bind:allow-export="initial.kernel_size > 0"
          v-on:export="()=> handleExport('kernel', 'kernel.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Ramdisk size"
          v-bind:value="initial.ramdisk_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Ramdisk address"
          v-bind:hex="4"
          v-bind:initial="initial.ramdisk_addr"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Ramdisk image"
          value="ramdisk.img"
          v-bind:allow-export="initial.ramdisk_size > 0"
          v-on:export="()=> handleExport('ramdisk', 'ramdisk.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="2nd-stage BL size"
          v-bind:value="initial.second_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="2nd-stage BL address"
          v-bind:hex="4"
          v-bind:initial="initial.second_addr"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="2nd-stage BL image"
          value="second.img"
          v-bind:allow-export="initial.second_size > 0"
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
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="DT size"
          v-bind:value="initial.dt_size"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="DT image"
          value="dt.img"
          v-bind:allow-export="initial.dt_size > 0"
          v-on:export="()=> handleExport('dt', 'dt.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO size"
          v-bind:value="initial.recovery_dtbo_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO offset"
          v-bind:value="initial.recovery_dtbo_offset"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Recovery DTBO image"
          value="recovery_dtbo.img"
          v-bind:allow-export="initial.recovery_dtbo_size > 0"
          v-on:export="()=> handleExport('recovery_dtbo', 'recovery_dtbo.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="DTB size"
          v-bind:value="initial.dtb_size"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="DTB address"
          v-bind:hex="4"
          v-bind:initial="initial.dtb_addr"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="DTB image"
          value="dtb.img"
          v-bind:allow-export="initial.dtb_size > 0"
          v-on:export="()=> handleExport('dtb', 'dtb.img')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS patch level"
          v-bind:initial="initial.os_patch_level"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS version"
          v-bind:initial="initial.os_version"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ValueEditor
          label="Board"
          v-bind:initial="initial.board"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          class="monospace"
          label="cmdline"
          rows="3"
          no-resize
          counter
          v-bind:value="initial.cmdline"
        />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import ValuePresenter from './ValuePresenter';
import ValueEditor from './ValueEditor';
import ImageReplacer from './ImageReplacer';

export default {
  name: 'Form',
  components: {
    ValuePresenter,
    ValueEditor,
    ImageReplacer,
  },
  props: {
    initial: Object,
  },
  methods: {
    handleExport(part, name) {
      this.$emit('export', part, name);
    },
  },
};
</script>

<style>
.monospace .v-text-field__slot .v-text-field__prefix,
.monospace .v-text-field__slot input,
.monospace .v-text-field__slot textarea {
  font-family: monospace;
}
</style>
