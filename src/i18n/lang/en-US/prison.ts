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

  notFound: "Prison information not found!",

  validation: {
    required: {
      name: "Please enter prison name",
      address: "Please enter address",
      province: "Please select province/city",
      ward: "Please select ward/commune",
      director: "Please enter director's name",
      deputyDirector: "Please enter deputy director's name",
      phone: "Please enter phone number",
      capacity: "Please enter capacity",
      currentPopulation: "Please enter current number of detainees",
      isActive: "Please select status",
    },
    invalid: {
      name: "Prison name must be between 5 and 255 characters",
      phone: "Invalid phone number",
      capacity: "Capacity must be greater than 0",
      currentPopulation: "Number of detainees cannot be negative",
      currentPopulationOver: "Current number of detainees cannot exceed capacity!",
    }
  }
};

export default prison;
