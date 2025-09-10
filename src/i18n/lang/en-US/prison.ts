import type { Prison } from "@/i18n/type";

const prison: Prison = {
  editTitle: "Edit Prison",
  detailTitle: "Prison Details",
  code: "Prison Code",
  name: "Prison Name",
  phone: "Phone Number",
  province: "Province/City",
  ward: "Ward/Commune",
  address: "Address",
  director: "Director",
  deputyDirector: "Deputy Director",
  capacity: "Maximum Capacity",
  currentPopulation: "Current Prisoner Count",
  status: "Status",
  active: "Active",
  inactive: "Inactive",
  occupancyRate: "Occupancy Rate",
  people: "prisoners",
  unit: "prison unit",

  placeholder: {
    code: "Enter prison code...",
    name: "Enter prison name...",
    phone: "Enter phone number...",
    province: "Select province/city",
    ward: "Select ward/commune",
    address: "House number, street, village...",
    director: "Enter director's name...",
    deputyDirector: "Enter deputy director's name...",
    capacity: "Enter capacity...",
    currentPopulation: "Enter current prisoner count...",
    description: "Enter prison description...",
    status: "Select status...",
  },
};

export default prison;
