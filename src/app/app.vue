<template>
  <v-app id="app" dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="isMenuOpen"
      app
    >
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>perm_contact_calendar</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link class="nav-item" to="/input-test">
                <span v-t="'header.input-test'"></span>
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link class="nav-item" to="/todo-list/42">
                <span v-t="'header.todo-list'"></span>
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>question_answer</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link class="nav-item" to="/gallery">
                <span v-t="'header.gallery'"></span>
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="isMenuOpen = !isMenuOpen"/>
      <v-toolbar-title v-t="'header.demo-app'" />
      <v-spacer />
      <language-selector />
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <!-- TODO: Maybe re-add "align-center" here.-->
        <v-layout justify-center>

          <router-view />

        </v-layout>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2018</span>
    </v-footer>

    <v-snackbar
      :bottom="true"
      v-model="snackbarOptions.show"
    >
      {{ snackbarOptions.text }}
      <v-btn flat color="pink" @click.native="hideSnackbar()">{{snackbarOptions.buttonText}}</v-btn>
    </v-snackbar>

  </v-app>

</template>

<script lang="ts">
  import { Component, Lifecycle, Vue } from "av-ts";
  import noop from "lodash-es/noop";
  import onceEventHelper from "../utility/onceEvent";
  import LanguageSelector from "../languageSelector/languageSelector.vue";
  import registerServiceWorker from "../registerServiceWorker";

  @Component({
    components: {
      languageSelector: LanguageSelector
    } as any // work around typing problems with TS 2.6.1
  })
  export default class App extends Vue {
    // a: string = 6;
    isMenuOpen = false;

    snackbarOptions = {
      show: false,
      text: "",
      buttonText: "",
      onClick: noop as (() => void)
    };

    @Lifecycle
    mounted() {
      if (process.env.NODE_ENV === "production") {
        registerServiceWorker(
          this.showSnackbar.bind(this),
          this.$t.bind(this.$t)
        );
      }
    }

    openMenu($event: Event): void {
      if (!this.isMenuOpen) {
        $event.preventDefault();
        $event.stopPropagation();
        this.isMenuOpen = true;
        onceEventHelper(document, "click", () => (this.isMenuOpen = false));
      }
    }

    showSnackbar(text: string, buttonText: string, callback?: () => void) {
      this.snackbarOptions.text = text;
      this.snackbarOptions.buttonText = buttonText;
      if (callback) {
        this.snackbarOptions.onClick = callback;
      }
      this.snackbarOptions.show = true;
    }

    hideSnackbar() {
      if (this.snackbarOptions.onClick) {
        this.snackbarOptions.onClick();
      }
      this.snackbarOptions.show = false;
      this.snackbarOptions.onClick = noop;
      this.snackbarOptions.text = "";
      this.snackbarOptions.buttonText = "";
    }
  }

</script>

<style lang="scss">
  @import "../styles/colors";
  @import "../styles/typography";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100%;

    .footer {
      justify-content: space-between;
    }
  }

</style>
