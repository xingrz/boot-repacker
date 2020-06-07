<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8">
            <v-expansion-panels accordion mandatory>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>1. Open an existing image</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <FileDrop />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header><strong>2. Customize</strong></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <Form />
                  <div class="d-flex">
                    <v-btn color="primary" text><v-icon left>mdi-restore</v-icon> Reset all</v-btn>
                    <v-btn color="primary" text class="ml-auto" style="margin-right: 1em;">Back</v-btn>
                    <v-btn color="primary" depressed>Next</v-btn>
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
import FileDrop from './components/FileDrop';
import Form from './components/Form';

export default {
  name: 'App',
  components: {
    FileDrop,
    Form,
  },
};
</script>
