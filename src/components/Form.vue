<template>
  <v-container>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Magic"
          value="ANDROID!"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Page size"
          value="4096"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <v-select
          label="Header version"
          v-bind:items="['v0', 'v1', 'v2']"
          value="v2"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Header size"
          value="1660"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Kernel size"
          value="35256332"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Kernel address"
          hex value="00008000"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Kernel image"
          value="kernel.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Ramdisk size"
          value="812535"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Ramdisk address"
          hex value="01000000"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Ramdisk image"
          value="ramdisk.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="2nd-stage BL size"
          value="812535"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="2nd-stage BL address"
          hex value="00f00000"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="2nd-stage BL image"
          value="second.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="Tags address"
          hex value="00000100"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="DT size"
          value="0"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="DT image"
          value="dt.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO size"
          value="0"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="Recovery DTBO offset"
          value="0"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="Recovery DTBO image"
          value="recovery_dtbo.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValuePresenter
          label="DTB size"
          value="1541488"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="DTB address"
          hex value="01f00000"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ImageReplacer
          label="DTB image"
          value="dtb.img"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS patch level"
          value="2020-03"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <ValueEditor
          label="OS version"
          value="10.0.0"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <ValueEditor
          label="Board"
          value=""
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
          value="console=ttyMSM0,115200n8 earlycon=msm_geni_serial,0xa90000 androidboot.hardware=qcom androidboot.console=ttyMSM0 androidboot.memcg=1 lpm_levels.sleep_disabled=1 video=vfb:640x400,bpp=32,memsize=3072000 msm_rtb.filter=0x237 service_locator.enable=1 androidboot.usbcontroller=a600000.dwc3 swiotlb=2048 loop.max_part=7 cgroup.memory=nokmem,nosocket reboot=panic_warm no_console_suspend buildvariant=user"
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
};
</script>

<style>
.monospace .v-text-field__slot .v-text-field__prefix,
.monospace .v-text-field__slot input,
.monospace .v-text-field__slot textarea {
  font-family: monospace;
}
</style>
