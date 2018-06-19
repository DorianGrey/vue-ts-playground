<template>
  <!--
  <select v-model="currentLanguage" class="select" @change="langChanged">
    <option v-for="lang in languages" v-bind:value="lang.key" v-t="lang.value"></option>
  </select>
  -->

  <v-menu bottom left>
    <v-btn color="secondary" icon slot="activator" dark>
      <v-icon>language</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile v-for="lang in languages" :key="lang.key" @click="langChanged(lang.key)">
        <v-list-tile-title v-t="lang.value" />
      </v-list-tile>
    </v-list>
  </v-menu>

</template>

<script lang="ts">
  import { Component, Lifecycle, Vue } from "av-ts";
  import { LanguagePack, loadLanguagePack } from "../i18n/languagePack";
  import { I18N_MODULE_ACTIONS } from "../i18n/state/i18n.state";

  @Component
  export default class LanguageSelector extends Vue {
    currentLanguage: string;
    languages = [
      {
        key: "de",
        value: "languages.de"
      },
      {
        key: "en",
        value: "languages.en"
      }
    ];

    @Lifecycle
    created(): void {
      this.currentLanguage = (this.$store.getters[
        I18N_MODULE_ACTIONS.GET
        ] as LanguagePack).language;
    }

    langChanged(newLang: string): void {
      if (newLang !== this.currentLanguage) {
        this.currentLanguage = newLang;
        loadLanguagePack(this.currentLanguage).then(langPack => {
          this.$i18n.setDateTimeFormat(
            langPack.language,
            langPack.dateTimeFormat
          );
          this.$i18n.setLocaleMessage(langPack.language, langPack.messages);

          // These two calls will trigger the actual UI update.
          this.$store.commit(I18N_MODULE_ACTIONS.SET, langPack);
          this.$i18n.locale = langPack.language;
        });
      }
    }
  }

</script>

<style lang="scss">
  @import "../styles/colors";
  @import "../styles/typography";

  select {
    height: $side-nav-width;
  }

  option {
    background-color: rgb(54, 54, 54);
  }
</style>