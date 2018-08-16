import transitions from "vuetify/es5/components/transitions";
import directives from "vuetify/es5/directives";
import VApp from "vuetify/es5/components/VApp";
import VBtn from "vuetify/es5/components/VBtn";
import VCard from "vuetify/es5/components/VCard";
import VChip from "vuetify/es5/components/VChip";
import VDatePicker from "vuetify/es5/components/VDatePicker";
import VDialog from "vuetify/es5/components/VDialog";
import VFooter from "vuetify/es5/components/VFooter";
import VForm from "vuetify/es5/components/VForm";
import VGrid from "vuetify/es5/components/VGrid";
import VIcon from "vuetify/es5/components/VIcon";
import VList from "vuetify/es5/components/VList";
import VMenu from "vuetify/es5/components/VMenu";
import VNavigationDrawer from "vuetify/es5/components/VNavigationDrawer";
import VTabs from "vuetify/es5/components/VTabs";
import VTextarea from "vuetify/es5/components/VTextarea";
import VTextField from "vuetify/es5/components/VTextField";
import VTimePicker from "vuetify/es5/components/VTimePicker";
import VToolbar from "vuetify/es5/components/VToolbar";
import VSnackbar from "vuetify/es5/components/VSnackbar";
import colors from "vuetify/es5/util/colors";
import VueI18n from "vue-i18n";

export default function createVuetifyConfig(i18n: VueI18n) {
  return {
    lang: {
      t: (key: string, ...params: any[]) => i18n.t(key, params)
    },
    components: {
      VApp,
      VBtn,
      VCard,
      VChip,
      VDatePicker,
      VDialog,
      VFooter,
      VForm,
      VGrid,
      VIcon,
      VList,
      VMenu,
      VNavigationDrawer,
      VSnackbar,
      VTabs,
      VTextarea,
      VTextField,
      VTimePicker,
      VToolbar
    },
    directives,
    transitions,
    theme: {
      primary: colors.green.accent4,
      secondary: colors.red.lighten2,
      accent: colors.purple.base,
      error: colors.red.base,
      warning: colors.yellow.base,
      info: colors.blue.base,
      success: colors.green.base
    }
  };
}
