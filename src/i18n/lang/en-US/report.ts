export default {
    overview: "Overview Statistics",
    totalDetainee: "Total Detainees",
    totalStaff: "Total Staff",
    totalIdentity: "Identity Records Created",
    totalFingerprint: "Fingerprint Records Created",

    notChange: "No change",
    compareWith: "compared to last month",

    createReportDetail: "Create Detailed Report",
    type: "Report Type",
    typePlaceHolder: "Select report type",
    fromDate: "From Date",
    fromDatePlace: "Select start date",
    toDate: "To Date",
    toDatePlace: "Select end date",

    exportFormat: "Export Format",
    exportFormatPlace: "Select format",
    table: "Table",
    chart: "Chart",
    both: "Both",

    creating: "Creating...",
    create: "Create Report",

    excel: "Export to Excel",
    pdf: "Export to PDF",
    print: "Print Report",

    createAt: "Created at:",
    from: "From",
    to: "to",

    summary: "Summary:",
    insight: "Summary & Analysis",

    unknown: "Unknown Report",
    error: {
        loadStatistics: "Error loading statistics!",
        chooseType: "Please select a report type!",
        create: "Error creating report!",
        createQuick: "Error creating quick report!",
        excel: "Error exporting to Excel!",
        pdf: "Error exporting to PDF!",
        print: "Unable to open print window!"
    },

    success: {
        create: "Report created successfully!",
        excel: "Export to Excel successful!",
        pdf: "Export to PDF successful!",
    },

    detaineeByStatus: {
        text: "Detainees by Status",
        fullText: "Report on Detainees by Status",
        status: "Status",
        count: "Count",
        percent: "Percentage (%)",
        summary: "Total",
        statusLabel: {
            detained: "Detained",
            released: "Released",
            transfer: "Transferred"
        }
    },

    detaineeByMonth: {
        text: "Detainees by Month",
        fullText: "Report on Detainees by Month",
        column: {
            month: "Month",
            newDetainees: "New Detainees",
            released: "Released",
            total: "End of Month Total"
        },
        insight: {
            title: "Peak Month",
            description: "had the highest number of new detainees",
            people: "people"
        }
    },

    staffByDepartment: {
        text: "Staff by Department",
        fullText: "Report on Staff by Department",
        column: {
            department: "Department",
            count: "Count",
            active: "Active",
        },
        insight: {
            title: "Largest Department",
            description: "had the highest number of staff",
            people: "people"
        }
    },

    identityRecord: {
        text: "Identity Records Created",
        fullText: "Report on Identity Records",
        id: "ID",
        detaineeId: "Detainee ID",
        detaineeName: "Detainee Name",
        createdDate: "Created Date",
    },

    fingerprintCard: {
        text: "Fingerprint Records Created",
        fullText: "Report on Fingerprint Records",
        column: {
            id: "ID",
            personId: "Detainee ID",
            detaineeName: "Detainee Name",
            createdDate: "Created Date",
            completeness: "Completeness",
        }
    }
}
