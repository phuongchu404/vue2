import { defineStore } from "pinia";
import { ref } from "vue";
export const useAppStore = defineStore("app", {
  state: () => ({
    buttons: new Set<string>(),
    fingerData: {} as Record<string, any>,
    faceData: {} as Record<string, any>,
    idCardData: {} as Record<string, any>,
    subjectDetailDialog: false,
    image: "",
    template: "",
    titleRegister: "",
  }),
  getters: {
    getFingerData: (state) => state.fingerData,
    getFaceData: (state) => state.faceData,
    getSubjectDetailDialogStatus: (state) => state.subjectDetailDialog,
    getIdCardData: (state) => state.idCardData,
    getImageData: (state) => state.image,
    getTemplateData: (state) => state.template,
    getTitleRegister: (state) => state.titleRegister,
  },
  actions: {
    setButtons(buttons: Set<string>) {
      this.buttons = buttons;
    },
    setImage(image: string) {
      this.image = image;
    },
    setTemplate(template: string) {
      this.template = template;
    },
    setTitleRegister(titleRegister: string) {
      this.titleRegister = titleRegister;
    },
    setFingerData(fingerData: Record<string, any>) {
      this.fingerData = fingerData;
    },
    setFaceData(faceData: Record<string, any>) {
      this.faceData = faceData;
    },
    toggleSubjectDetailDialog(value: boolean) {
      this.subjectDetailDialog = value;
    },
    setIdCardData(idCardData: Record<string, any>) {
      this.idCardData = idCardData;
    },
    clearBioData() {
      this.idCardData = {};
      this.faceData = {};
      this.fingerData = {};
    },
  },
});
