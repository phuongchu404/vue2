export default {
    overview: "Thống Kê Tổng Quan",
    totalDetainee: "Tổng Số Phạm Nhân",
    totalStaff: "Tổng Số Cán Bộ",
    totalIdentity: "Danh Bản Đã Lập",
    totalFingerprint: "Chỉ Bản Đã Lập",

    notChange: "Không thay đổi",
    compareWith: "so với tháng trước",

    createReportDetail: "Tạo Báo Cáo Chi Tiết",
    type: "Loại báo cáo",
    typePlaceHolder: "Chọn loại báo cáo",
    fromDate: "Từ ngày",
    fromDatePlace: "Chọn ngày bắt đầu",
    toDate: "Đến ngày",
    toDatePlace: "Chọn ngày kết thúc",

    exportFormat: "Định dạng xuất",
    exportFormatPlace: "Chọn định dạng",
    table: "Bảng",
    chart: "Biểu đồ",
    both: "Cả hai",

    creating: "Đang tạo...",
    create: "Tạo Báo Cáo",

    excel: "Xuất Excel",
    pdf: "Xuất PDF",
    print: "In Báo Cáo",

    createAt: "Tạo lúc:",
    from: "Từ",
    to: "đến",

    summary: "Tổng kết:",
    insight: "Tóm Tắt & Phân Tích",

    unknown: "Báo cáo không xác định",
    error: {
        loadStatistics: "Lỗi khi tải thống kê!",
        chooseType: "Vui lòng chọn loại báo cáo!",
        create: "Lỗi khi tạo báo cáo!",
        createQuick: "Lỗi khi tạo báo cáo nhanh!",
        excel: "Lỗi khi xuất Excel!",
        pdf: "Lỗi khi xuất PDF!",
        print: "Không thể mở cửa sổ in!"
    },

    success: {
        create: "Tạo báo cáo thành công!",
        excel: "Xuất Excel thành công!",
        pdf: "Xuất PDF thành công!",
    },

    detaineeByStatus: {
        text: "Phạm Nhân Theo Trạng Thái",
        fullText: "Báo Cáo Phạm Nhân Theo Trạng Thái",
        status: "Trạng Thái",
        count: "Số Lượng",
        percent: "Tỷ Lệ (%)",
        summary: "Tổng cộng",
        statusLabel: {
            detained: "Đang giam giữ",
            released: "Đã thả",
            transfer: "Chuyển trại"
        }
    },

    detaineeByMonth: {
        text: "Phạm Nhân Theo Tháng",
        fullText: "Báo Cáo Phạm Nhân Theo Tháng",
        column: {
            month: "Tháng",
            newDetainees: "Phạm nhân mới",
            released: "Đã thả",
            total: "Tổng cuối tháng"
        },
        insight: {
            title: "Tháng cao nhất",
            description: "có số phạm nhân mới cao nhất",
            people: "người"
        }
    },

    staffByDepartment: {
        text: "Cán Bộ Theo Phòng Ban",
        fullText: "Báo Cáo Cán Bộ Theo Phòng Ban",
        column: {
            department: "Phòng Ban",
            count: "Số Lượng",
            active: "Đang làm việc",
        },
        insight: {
            title: "Phòng ban lớn nhất",
            description: "có số cán bộ đông nhất",
            people: "người"
        }
    },

    identityRecord: {
        text: "Danh Bản Đã Lập",
        fulltext: "Báo Cáo Danh Bản Đã Lập",
        id: "ID",
        detaineeId: "Mã phạm nhân",
        detaineeName: "Tên phạm nhân",
        createdDate: "Ngày tạo",
    },

    fingerprintCard: {
        text: "Chỉ Bản Đã Lập",
        fullText: "Báo Cáo Chỉ Bản Đã Lập",
        column: {
            id: "ID",
            personId: "Mã phạm nhân",
            detaineeName: "Tên phạm nhân",
            createdDate: "Ngày tạo",
            completeness: "Độ hoàn thiện",
        }
    }
}