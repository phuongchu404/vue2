<template>
  <div class="reports-statistics">
    <!-- Thống kê tổng quan -->
    <div class="statistics-overview">
      <h3>📈 Thống Kê Tổng Quan</h3>
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in statisticsCards" :key="stat.key">
          <div class="stat-icon">
            <el-icon :size="40"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-content">
            <h4>{{ stat.title }}</h4>
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-change" :class="getChangeClass(stat.change)">
              {{ formatChange(stat.change) }} so với tháng trước
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bộ lọc báo cáo -->
    <div class="report-filters">
      <h3>🔍 Tạo Báo Cáo Chi Tiết</h3>
      <div class="filter-grid">
        <div class="form-group">
          <label>Loại báo cáo</label>
          <el-select
            v-model="reportForm.type"
            placeholder="Chọn loại báo cáo"
            @change="handleReportTypeChange"
            clearable
          >
            <el-option
              v-for="option in reportTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="form-group">
          <label>Từ ngày</label>
          <el-date-picker
            v-model="reportForm.fromDate"
            type="date"
            placeholder="Chọn ngày bắt đầu"
            :disabled="!reportForm.type"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </div>

        <div class="form-group">
          <label>Đến ngày</label>
          <el-date-picker
            v-model="reportForm.toDate"
            type="date"
            placeholder="Chọn ngày kết thúc"
            :disabled="!reportForm.type"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </div>

        <div class="form-group">
          <label>Định dạng xuất</label>
          <el-select v-model="reportForm.format" placeholder="Chọn định dạng">
            <el-option label="Bảng" value="table" />
            <el-option label="Biểu đồ" value="chart" />
            <el-option label="Cả hai" value="both" />
          </el-select>
        </div>
      </div>

      <div class="filter-actions">
        <el-button
          class="btn btn-primary"
          type="primary"
          @click="generateReport"
          :disabled="!reportForm.type"
          :loading="loading"
        >
          <span v-if="loading">⏳</span>
          <span v-else>📊</span>
          {{ loading ? "Đang tạo..." : "Tạo Báo Cáo" }}
        </el-button>

        <el-button
          class="btn btn-success"
          type="success"
          @click="exportReport"
          :disabled="!currentReport || loading"
        >
          📤 Xuất Excel
        </el-button>

        <el-button
          class="btn btn-secondary"
          @click="exportToPDF"
          :disabled="!currentReport || loading"
        >
          📄 Xuất PDF
        </el-button>

        <el-button
          class="btn btn-info"
          type="info"
          @click="printReport"
          :disabled="!currentReport"
        >
          🖨️ In Báo Cáo
        </el-button>
      </div>
    </div>

    <!-- Kết quả báo cáo -->
    <div v-if="currentReport" class="report-results">
      <div class="report-header">
        <h3>{{ currentReport.title }}</h3>
        <div class="report-meta">
          <span>Tạo lúc: {{ formatDateTime(currentReport.createdAt) }}</span>
          <span v-if="reportForm.fromDate && reportForm.toDate">
            Từ {{ formatDate(reportForm.fromDate) }} đến
            {{ formatDate(reportForm.toDate) }}
          </span>
        </div>
      </div>

      <!-- Biểu đồ -->
      <div v-if="showChart" class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Bảng dữ liệu -->
      <div v-if="showTable" class="table-container">
        <el-table
          :data="currentReport.data"
          stripe
          border
          class="data-table"
          :header-cell-style="{ background: '#667eea', color: 'white' }"
        >
          <el-table-column
            v-for="column in currentReport.columns"
            :key="column.key"
            :prop="column.key"
            :label="column.title"
            :min-width="120"
          >
            <template #default="{ row }">
              {{ formatCellValue(row[column.key], column.type) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- Tổng kết -->
        <div v-if="currentReport.summary" class="table-summary">
          <div class="summary-row">
            <strong>Tổng kết:</strong>
            <span v-for="column in currentReport.columns" :key="column.key">
              <span v-if="currentReport.summary[column.key]">
                {{ column.title }}: {{ currentReport.summary[column.key] }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Tóm tắt báo cáo -->
      <div v-if="currentReport.insights" class="report-insights">
        <h4>📋 Tóm Tắt & Phân Tích</h4>
        <div class="insights-grid">
          <div
            v-for="insight in currentReport.insights"
            :key="insight.title"
            class="insight-card"
          >
            <h5>{{ insight.title }}</h5>
            <p>{{ insight.description }}</p>
            <div v-if="insight.value" class="insight-value">
              {{ insight.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Báo cáo nhanh -->
    <!-- <div class="quick-reports">
      <h3>⚡ Báo Cáo Nhanh</h3>
      <div class="quick-report-grid">
        <div
          v-for="quickReport in quickReports"
          :key="quickReport.id"
          class="quick-report-card"
          @click="runQuickReport(quickReport)"
        >
          <div class="quick-report-icon">{{ quickReport.icon }}</div>
          <h4>{{ quickReport.title }}</h4>
          <p>{{ quickReport.description }}</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import {
  TrendCharts,
  User,
  Avatar,
  Document,
  Pointer,
} from "@element-plus/icons-vue";

// Stores (assuming these are already set up)
import { useReportStore } from "@/stores/report";
import { useDetaineeStore } from "@/stores";
import { useStaffStore } from "@/stores";
import { useIdentityStore } from "@/stores";
import { useFingerprintStore } from "@/stores/fingerprint";

// Stores
const reportStore = useReportStore();
const detaineeStore = useDetaineeStore();
const staffStore = useStaffStore();
const identityStore = useIdentityStore();
const fingerprintStore = useFingerprintStore();

// Reactive data
const loading = ref(false);
const currentReport = ref(null);
const chartCanvas = ref(null);
const chartInstance = ref(null);

const reportForm = reactive({
  type: "",
  fromDate: "",
  toDate: "",
  format: "both",
});

const statistics = reactive({
  totalDetainees: 0,
  totalStaff: 0,
  totalIdentity: 0,
  totalFingerprint: 0,
  detaineeChange: 0,
  staffChange: 0,
  identityChange: 0,
  fingerprintChange: 0,
});

// Report type options
const reportTypeOptions = [
  { value: "detainees-by-status", label: "Phạm nhân theo trạng thái" },
  { value: "detainees-by-month", label: "Phạm nhân theo tháng" },
  { value: "detainees-by-crime", label: "Phạm nhân theo tội danh" },
  { value: "staff-by-department", label: "Cán bộ theo phòng ban" },
  { value: "staff-by-rank", label: "Cán bộ theo cấp bậc" },
  { value: "identity-records", label: "Danh bản đã lập" },
  { value: "fingerprint-cards", label: "Chỉ bản đã lập" },
  { value: "monthly-summary", label: "Tổng hợp theo tháng" },
];

// Statistics cards computed
const statisticsCards = computed(() => [
  {
    key: "detainees",
    title: "Tổng Số Phạm Nhân",
    value: statistics.totalDetainees,
    change: statistics.detaineeChange,
    icon: User,
  },
  {
    key: "staff",
    title: "Tổng Số Cán Bộ",
    value: statistics.totalStaff,
    change: statistics.staffChange,
    icon: Avatar,
  },
  {
    key: "identity",
    title: "Danh Bản Đã Lập",
    value: statistics.totalIdentity,
    change: statistics.identityChange,
    icon: Document,
  },
  {
    key: "fingerprint",
    title: "Chỉ Bản Đã Lập",
    value: statistics.totalFingerprint,
    change: statistics.fingerprintChange,
    icon: Pointer,
  },
]);

// Quick reports configuration
const quickReports = [
  {
    id: "daily-summary",
    title: "Tổng Hợp Ngày",
    description: "Báo cáo tổng hợp hoạt động trong ngày",
    icon: "📅",
  },
  {
    id: "weekly-summary",
    title: "Tổng Hợp Tuần",
    description: "Báo cáo tổng hợp hoạt động trong tuần",
    icon: "📊",
  },
  {
    id: "new-detainees",
    title: "Phạm Nhân Mới",
    description: "Danh sách phạm nhân mới trong tháng",
    icon: "👥",
  },
  {
    id: "capacity-report",
    title: "Báo Cáo Công Suất",
    description: "Tình hình sử dụng buồng giam",
    icon: "🏢",
  },
];

// Computed properties
const showChart = computed(() => {
  return reportForm.format === "chart" || reportForm.format === "both";
});

const showTable = computed(() => {
  return reportForm.format === "table" || reportForm.format === "both";
});

// Methods
const loadStatistics = async () => {
  try {
    const stats = await reportStore.getOverviewStatistics();
    Object.assign(statistics, stats);
  } catch (error) {
    ElMessage.error("Lỗi khi tải thống kê!");
  }
};

const handleReportTypeChange = () => {
  currentReport.value = null;
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
};

const generateReport = async () => {
  try {
    loading.value = true;

    if (!reportForm.type) {
      ElMessage.error("Vui lòng chọn loại báo cáo!");
      return;
    }

    const reportData = await reportStore.generateReport({
      type: reportForm.type,
      fromDate: reportForm.fromDate,
      toDate: reportForm.toDate,
    });

    currentReport.value = {
      ...reportData,
      createdAt: new Date().toISOString(),
    };

    // Render chart if needed
    if (showChart.value) {
      await nextTick();
      renderChart(reportData);
    }

    ElMessage.success("Tạo báo cáo thành công!");
  } catch (error) {
    ElMessage.error(error.message || "Lỗi khi tạo báo cáo!");
  } finally {
    loading.value = false;
  }
};

const renderChart = async (reportData) => {
  if (!chartCanvas.value || !reportData.chartData) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  try {
    const ctx = chartCanvas.value.getContext("2d");
    drawSimpleChart(ctx, reportData.chartData);
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
};

const drawSimpleChart = (ctx, chartData) => {
  // Simple bar chart implementation
  const canvas = ctx.canvas;
  const width = (canvas.width = 800);
  const height = (canvas.height = 400);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#667eea";

  if (chartData && chartData.data && chartData.data.datasets) {
    const data = chartData.data.datasets[0].data;
    const labels = chartData.data.labels;
    const maxValue = Math.max(...data);

    const barWidth = (width / data.length) * 0.8;
    const barSpacing = (width / data.length) * 0.2;

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 50);
      const x = index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - barHeight - 30;

      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#2c3e50";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, height - 10);
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);

      ctx.fillStyle = "#667eea";
    });
  }
};

const runQuickReport = async (quickReport) => {
  try {
    loading.value = true;

    let reportType = "";
    let fromDate = "";
    let toDate = new Date().toISOString().split("T")[0];

    switch (quickReport.id) {
      case "daily-summary":
        reportType = "monthly-summary";
        fromDate = toDate;
        break;
      case "weekly-summary":
        reportType = "monthly-summary";
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        fromDate = weekAgo.toISOString().split("T")[0];
        break;
      case "new-detainees":
        reportType = "detainees-by-month";
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        fromDate = monthAgo.toISOString().split("T")[0];
        break;
      case "capacity-report":
        reportType = "detainees-by-status";
        break;
    }

    reportForm.type = reportType;
    reportForm.fromDate = fromDate;
    reportForm.toDate = toDate;

    await generateReport();
  } catch (error) {
    ElMessage.error("Lỗi khi tạo báo cáo nhanh!");
  } finally {
    loading.value = false;
  }
};

const exportReport = async () => {
  try {
    if (!currentReport.value) return;

    const data = {
      title: currentReport.value.title,
      data: currentReport.value.data,
      columns: currentReport.value.columns,
    };

    await reportStore.exportToExcel(data);
    ElMessage.success("Xuất Excel thành công!");
  } catch (error) {
    ElMessage.error("Lỗi khi xuất Excel!");
  }
};

const exportToPDF = async () => {
  try {
    if (!currentReport.value) return;
    await reportStore.exportToPDF(currentReport.value);
    ElMessage.success("Xuất PDF thành công!");
  } catch (error) {
    ElMessage.error("Lỗi khi xuất PDF!");
  }
};

const printReport = () => {
  if (!currentReport.value) return;

  const printWindow = window.open("", "_blank");
  const printContent = generatePrintContent(currentReport.value);

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const generatePrintContent = (report) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${report.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #667eea; color: white; }
        .summary-row { font-weight: bold; background-color: #f8f9fa; }
        .report-meta { text-align: center; margin: 20px 0; color: #666; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <div class="report-meta">
        Tạo lúc: ${formatDateTime(report.createdAt)}
        ${
          reportForm.fromDate && reportForm.toDate
            ? `<br>Từ ${formatDate(reportForm.fromDate)} đến ${formatDate(
                reportForm.toDate
              )}`
            : ""
        }
      </div>
      <table>
        <thead>
          <tr>
            ${report.columns.map((col) => `<th>${col.title}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${report.data
            .map(
              (row) =>
                `<tr>${report.columns
                  .map(
                    (col) =>
                      `<td>${formatCellValue(row[col.key], col.type)}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

const formatCellValue = (value, type) => {
  if (value === null || value === undefined) return "-";

  switch (type) {
    case "date":
      return formatDate(value);
    case "datetime":
      return formatDateTime(value);
    case "number":
      return typeof value === "number" ? value.toLocaleString("vi-VN") : value;
    case "currency":
      return typeof value === "number"
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value)
        : value;
    default:
      return value;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN");
};

const formatChange = (change) => {
  if (change === 0) return "Không thay đổi";
  const prefix = change > 0 ? "+" : "";
  return `${prefix}${change}`;
};

const getChangeClass = (change) => {
  if (change > 0) return "stat-increase";
  if (change < 0) return "stat-decrease";
  return "stat-neutral";
};

// Lifecycle
onMounted(() => {
  loadStatistics();

  // Set default date range (last month)
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  reportForm.fromDate = lastMonth.toISOString().split("T")[0];
  reportForm.toDate = lastMonthEnd.toISOString().split("T")[0];
});
</script>

<style scoped>
.reports-statistics {
  margin: 0 auto;
  padding: 20px;
}

.statistics-overview {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.statistics-overview h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
  margin-right: 20px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.9);
}

.stat-content h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 0.8rem;
  opacity: 0.8;
}

.stat-increase {
  color: #51cf66;
}
.stat-decrease {
  color: #ff6b6b;
}
.stat-neutral {
  color: #95e1d3;
}

.report-filters {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.report-filters h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group :deep(.el-select),
.form-group :deep(.el-date-editor) {
  width: 100%;
}

.form-group :deep(.el-input__wrapper) {
  padding: 12px 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%) !important;
  border: none !important;
}

.btn-secondary {
  background: linear-gradient(135deg, #95e1d3 0%, #fce38a 100%) !important;
  color: #2c3e50 !important;
  border: none !important;
}

.btn-info {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
  border: none !important;
}

.report-results {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.report-header {
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.report-header h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.report-meta {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.report-meta span {
  margin-right: 20px;
}

.chart-container {
  margin: 30px 0;
  text-align: center;
}

.chart-container canvas {
  max-width: 100%;
  height: 400px;
  border: 1px solid #ecf0f1;
  border-radius: 10px;
}

.table-container {
  overflow-x: auto;
  margin: 30px 0;
}

.data-table {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.table-summary {
  margin-top: 20px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
}

.summary-row {
  font-weight: bold;
  color: #2c3e50;
}

.report-insights {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #ecf0f1;
}

.report-insights h4 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.insight-card {
  background: rgba(102, 126, 234, 0.05);
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #667eea;
}

.insight-card h5 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.insight-card p {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.quick-reports {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.quick-reports h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.quick-report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.quick-report-card {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.quick-report-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.quick-report-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.quick-report-card h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.quick-report-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .reports-statistics {
    padding: 10px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .quick-report-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
