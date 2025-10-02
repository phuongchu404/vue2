import type { Identity } from "@/i18n/type";

const identity: Identity = {
  // Titles
  createTitle: "Create New Identity Record",
  editTitle: "Edit Identity Record",
  infoSection: "Identity Information",
  photoSection: "Identity Photos",
  anthropometry: "Anthropometric Features",
  text: "Identity",

  // Search Section
  detaineeId: "Prisoner ID",
  detaineeName: "Prisoner Name",
  arrestUnit: "Arresting Unit",

  placeholder: {
    detaineeId: "Enter prisoner ID...",
    detaineeName: "Enter prisoner name...",
    arrestUnit: "Enter arresting unit...",
    createdPlace: "Enter place of identity record creation...",
    arrestDate: "Select arrest date...",
    fpClassification: "Enter fingerprint classification...",
    dp: "Enter DP...",
    tw: "Enter TW...",
    akFileNo: "Enter AK file number...",
    notes: "Enter notes...",
    reasonNote: "Enter reason for creating the identity record...",
    faceShape: "Describe face shape...",
    noseBridge: "Describe nose bridge...",
    earLowerFold: "Describe lower ear fold...",
    earLobe: "Describe ear lobe...",
    distinctiveMarks: "Describe distinctive marks, scars, tattoos...",
  },

  validation: {
    required: {
      detaineeCode: "Please enter detainee",
    },
    image: {
      notImage: "Only image files are allowed!",
      overSize: "Image size must be smaller than 2MB!",
      successUpload1: "Upload image",
      successUpload2: "successful!",
    }
  },

  // Form Labels
  createdPlace: "Created At",
  arrestDate: "Arrest Date",
  fpClassification: "Fingerprint Classification",
  dp: "DP",
  tw: "TW",
  akFileNo: "AK File No.",
  notes: "Notes",
  reasonNote: "Reason for Creation",
  faceShape: "Face Shape",
  height: "Height (cm)",
  noseBridge: "Nose Bridge",
  earLowerFold: "Lower Ear Fold",
  earLobe: "Ear Lobe",
  distinctiveMarks: "Distinctive Marks",
  photoFront: "Front Photo",
  photoLeft: "Left Profile Photo",
  photoRight: "Right Profile Photo",

  // Data Table
  id: "ID",
  arrestDateTable: "Arrest Date",
  fpClassificationTable: "FP Classification",
  photoTable: "Photos",

  // Detail Dialog
  detailTitle: "Identity Record Details",
  noPhoto: "No photo available",
};

export default identity;
