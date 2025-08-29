import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
// Prison Store
export const usePrisonStore = defineStore("prison1", () => {
  const prisons = ref([
    {
      id: 1,
      name: "Trại giam số 1",
      code: "TG001",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      capacity: 500,
      current_inmates: 350,
      warden: "Đại tá Nguyễn Văn A",
      phone: "028-1234567",
      status: "ACTIVE",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "Trại giam số 2",
      code: "TG002",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      capacity: 300,
      current_inmates: 280,
      warden: "Đại tá Trần Thị B",
      phone: "028-2345678",
      status: "ACTIVE",
      created_at: "2024-02-01",
    },
  ]);

  const addPrison = (prison: any) => {
    prison.id = prisons.value.length + 1;
    prison.created_at = new Date().toISOString();
    prisons.value.push(prison);
  };

  const updatePrison = (id: any, updatedPrison: any) => {
    const index = prisons.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      prisons.value[index] = { ...prisons.value[index], ...updatedPrison };
    }
  };

  const deletePrison = (id: any) => {
    const index = prisons.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      prisons.value.splice(index, 1);
    }
  };

  const getPrisonById = (id: any) => {
    return prisons.value.find((p) => p.id === parseInt(id));
  };

  return {
    prisons,
    addPrison,
    updatePrison,
    deletePrison,
    getPrisonById,
  };
});

// Detainee Store
export const useDetaineeStore = defineStore("detainee", () => {
  const detainees = ref([
    {
      id: 1,
      detainee_code: "PN001",
      full_name: "Nguyễn Văn A",
      gender: "Nam",
      date_of_birth: "1985-03-15",
      id_number: "001234567890",
      detention_date: "2024-01-15",
      status: "DETAINED",
      cell_number: "B01",
      charges: "Trộm cắp tài sản",
      prison_id: 1,
    },
    {
      id: 2,
      detainee_code: "PN002",
      full_name: "Trần Thị B",
      gender: "Nữ",
      date_of_birth: "1990-07-22",
      id_number: "002345678901",
      detention_date: "2024-02-20",
      status: "DETAINED",
      cell_number: "A05",
      charges: "Lừa đảo chiếm đoạt tài sản",
      prison_id: 1,
    },
  ]);

  const addDetainee = (detainee: any) => {
    detainee.id = detainees.value.length + 1;
    detainee.created_at = new Date().toISOString();
    detainees.value.push(detainee);
  };

  const updateDetainee = (id: any, updatedDetainee: any) => {
    const index = detainees.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      detainees.value[index] = {
        ...detainees.value[index],
        ...updatedDetainee,
      };
    }
  };

  const deleteDetainee = (id) => {
    const index = detainees.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      detainees.value.splice(index, 1);
    }
  };

  const getDetaineeById = (id) => {
    return detainees.value.find((d) => d.id === parseInt(id));
  };

  const getDetaineesByPrison = (prisonId) => {
    return detainees.value.filter((d) => d.prison_id === prisonId);
  };

  return {
    detainees,
    addDetainee,
    updateDetainee,
    deleteDetainee,
    getDetaineeById,
    getDetaineesByPrison,
  };
});

// Staff Store
export const useStaffStore = defineStore("staff1", () => {
  const staff = ref([
    {
      id: 1,
      staff_code: "CB001",
      full_name: "Đại úy Lê Văn C",
      gender: "Nam",
      phone: "0901234567",
      rank: "Đại úy",
      status: "ACTIVE",
      prison_id: 1,
    },
    {
      id: 2,
      staff_code: "CB002",
      full_name: "Trung úy Phạm Thị D",
      gender: "Nữ",
      phone: "0912345678",
      rank: "Trung úy",
      status: "ACTIVE",
      prison_id: 1,
    },
  ]);

  const addStaff = (member: any) => {
    member.id = staff.value.length + 1;
    member.created_at = new Date().toISOString();
    staff.value.push(member);
  };

  const updateStaff = (id: any, updatedStaff: any) => {
    const index = staff.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      staff.value[index] = { ...staff.value[index], ...updatedStaff };
    }
  };

  const deleteStaff = (id: any) => {
    const index = staff.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      staff.value.splice(index, 1);
    }
  };

  const getStaffById = (id: any) => {
    return staff.value.find((s) => s.id === parseInt(id));
  };

  const getStaffByPrison = (prisonId: any) => {
    return staff.value.filter((s) => s.prison_id === prisonId);
  };

  return {
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
    getStaffByPrison,
  };
});

// Identity Store
export const useIdentityStore = defineStore("identity", () => {
  const identityRecords = ref([]);

  const addIdentityRecord = (record: any) => {
    record.id = identityRecords.value.length + 1;
    record.created_at = new Date().toISOString();
    identityRecords.value.push(record);
  };

  const updateIdentityRecord = (id: any, updatedRecord: any) => {
    const index = identityRecords.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      identityRecords.value[index] = {
        ...identityRecords.value[index],
        ...updatedRecord,
      };
    }
  };

  const deleteIdentityRecord = (id) => {
    const index = identityRecords.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      identityRecords.value.splice(index, 1);
    }
  };

  const getIdentityRecordById = (id) => {
    return identityRecords.value.find((r) => r.id === parseInt(id));
  };

  return {
    identityRecords,
    addIdentityRecord,
    updateIdentityRecord,
    deleteIdentityRecord,
    getIdentityRecordById,
  };
});

// Fingerprint Store
export const useFingerprintStore = defineStore("fingerprint", () => {
  const fingerprintCards = ref([]);

  const addFingerprintCard = (card) => {
    card.id = fingerprintCards.value.length + 1;
    card.created_at = new Date().toISOString();
    fingerprintCards.value.push(card);
  };

  const updateFingerprintCard = (id, updatedCard) => {
    const index = fingerprintCards.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      fingerprintCards.value[index] = {
        ...fingerprintCards.value[index],
        ...updatedCard,
      };
    }
  };

  const deleteFingerprintCard = (id) => {
    const index = fingerprintCards.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      fingerprintCards.value.splice(index, 1);
    }
  };

  const getFingerprintCardById = (id) => {
    return fingerprintCards.value.find((c) => c.id === parseInt(id));
  };

  return {
    fingerprintCards,
    addFingerprintCard,
    updateFingerprintCard,
    deleteFingerprintCard,
    getFingerprintCardById,
  };
});
