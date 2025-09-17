<template>
  <div class="reports-statistics">
    <!-- Thống kê tổng quan -->
    <div class="statistics-overview">
      <h3>📈 Thống Kê Tổng Quan</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h4>Tổng Số Phạm Nhân</h4>
            <div class="stat-number">{{ statistics.totalDetainees }}</div>
            <div
              class="stat-change"
              :class="getChangeClass(statistics.detaineeChange)"
            >
              {{ formatChange(statistics.detaineeChange) }} so với tháng trước
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👮</div>
          <div class="stat-content">
            <h4>Tổng Số Cán Bộ</h4>
            <div class="stat-number">{{ statistics.totalStaff }}</div>
            <div
              class="stat-change"
              :class="getChangeClass(statistics.staffChange)"
            >
              {{ formatChange(statistics.staffChange) }} so với tháng trước
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h4>Danh Bản Đã Lập</h4>
            <div class="stat-number">{{ statistics.totalIdentity }}</div>
            <div
              class="stat-change"
              :class="getChangeClass(statistics.identityChange)"
            >
              {{ formatChange(statistics.identityChange) }} so với tháng trước
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👆</div>
          <div class="stat-content">
            <h4>Chỉ Bản Đã Lập</h4>
            <div class="stat-number">{{ statistics.totalFingerprint }}</div>
            <div
              class="stat-change"
              :class="getChangeClass(statistics.fingerprintChange)"
            >
              {{ formatChange(statistics.fingerprintChange) }} so với tháng
              trước
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
          <select v-model="reportForm.type" @change="handleReportTypeChange">
            <option value="">Chọn loại báo cáo</option>
            <option value="detainees-by-status">
              Phạm nhân theo trạng thái
            </option>
            <option value="detainees-by-month">Phạm nhân theo tháng</option>
            <option value="detainees-by-crime">Phạm nhân theo tội danh</option>
            <option value="staff-by-department">Cán bộ theo phòng ban</option>
            <option value="staff-by-rank">Cán bộ theo cấp bậc</option>
            <option value="identity-records">Danh bản đã lập</option>
            <option value="fingerprint-cards">Chỉ bản đã lập</option>
            <option value="monthly-summary">Tổng hợp theo tháng</option>
          </select>
        </div>

        <div class="form-group">
          <label>Từ ngày</label>
          <input
            type="date"
            v-model="reportForm.fromDate"
            :disabled="!reportForm.type"
          />
        </div>

        <div class="form-group">
          <label>Đến ngày</label>
          <input
            type="date"
            v-model="reportForm.toDate"
            :disabled="!reportForm.type"
          />
        </div>

        <div class="form-group">
          <label>Định dạng xuất</label>
          <select v-model="reportForm.format">
            <option value="table">Bảng</option>
            <option value="chart">Biểu đồ</option>
            <option value="both">Cả hai</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <button
          class="btn btn-primary"
          @click="generateReport"
          :disabled="!reportForm.type || loading"
        >
          <span v-if="loading">⏳</span>
          <span v-else>📊</span>
          {{ loading ? "Đang tạo..." : "Tạo Báo Cáo" }}
        </button>

        <button
          class="btn btn-success"
          @click="exportReport"
          :disabled="!currentReport || loading"
        >
          📤 Xuất Excel
        </button>

        <button
          class="btn btn-secondary"
          @click="exportToPDF"
          :disabled="!currentReport || loading"
        >
          📄 Xuất PDF
        </button>

        <button
          class="btn btn-info"
          @click="printReport"
          :disabled="!currentReport"
        >
          🖨️ In Báo Cáo
        </button>
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
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="column in currentReport.columns" :key="column.key">
                {{ column.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in currentReport.data" :key="index">
              <td v-for="column in currentReport.columns" :key="column.key">
                {{ formatCellValue(row[column.key], column.type) }}
              </td>
            </tr>
          </tbody>
          <tfoot v-if="currentReport.summary">
            <tr class="summary-row">
              <td v-for="column in currentReport.columns" :key="column.key">
                {{ currentReport.summary[column.key] || "" }}
              </td>
            </tr>
          </tfoot>
        </table>
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
    <div class="quick-reports">
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
    </div>

    <!-- Thông báo -->
    <div
      v-if="notification.show"
      :class="['alert', `alert-${notification.type}`]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
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

const notification = reactive({
  show: false,
  message: "",
  type: "success",
});

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
    showNotification("Lỗi khi tải thống kê!", "error");
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
      showNotification("Vui lòng chọn loại báo cáo!", "error");
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

    showNotification("Tạo báo cáo thành công!", "success");
  } catch (error) {
    showNotification(error.message || "Lỗi khi tạo báo cáo!", "error");
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

  // Import Chart.js dynamically (since it's not available in this environment)
  // In real implementation, you would use Chart.js library
  try {
    const ctx = chartCanvas.value.getContext("2d");

    // This is a placeholder for Chart.js implementation
    // chartInstance.value = new Chart(ctx, {
    //   type: reportData.chartData.type,
    //   data: reportData.chartData.data,
    //   options: reportData.chartData.options
    // })

    // For demonstration, draw a simple chart
    drawSimpleChart(ctx, reportData.chartData);
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
};

const drawSimpleChart = (ctx, chartData) => {
  // Simple bar chart implementation
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

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
    showNotification("Lỗi khi tạo báo cáo nhanh!", "error");
  } finally {
    loading.value = false;
  }
};

const exportReport = async () => {
  try {
    if (!currentReport.value) return;

    // In real implementation, this would generate and download Excel file
    const data = {
      title: currentReport.value.title,
      data: currentReport.value.data,
      columns: currentReport.value.columns,
    };

    // Simulate export
    await reportStore.exportToExcel(data);
    showNotification("Xuất Excel thành công!", "success");
  } catch (error) {
    showNotification("Lỗi khi xuất Excel!", "error");
  }
};

const exportToPDF = async () => {
  try {
    if (!currentReport.value) return;

    // In real implementation, this would generate and download PDF file
    await reportStore.exportToPDF(currentReport.value);
    showNotification("Xuất PDF thành công!", "success");
  } catch (error) {
    showNotification("Lỗi khi xuất PDF!", "error");
  }
};

const printReport = () => {
  if (!currentReport.value) return;

  // Create print window
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

const showNotification = (message, type = "success") => {
  notification.message = message;
  notification.type = type;
  notification.show = true;

  setTimeout(() => {
    notification.show = false;
  }, 3000);
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.header h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.statistics-overview {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f8f9fa;
  color: #6c757d;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #95e1d3 0%, #fce38a 100%);
  color: #2c3e50;
}

.btn-info {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
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
  width: 100%;
  border-collapse: collapse;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.data-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.data-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.summary-row {
  background: rgba(102, 126, 234, 0.1) !important;
  font-weight: bold;
}

.report-insights {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #ecf0f1;
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
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 10px;
  font-weight: 500;
  z-index: 1001;
  animation: slideIn 0.3s ease-out;
}

.alert-success {
  background: rgba(81, 207, 102, 0.9);
  color: white;
  border: 1px solid rgba(81, 207, 102, 0.2);
}

.alert-error {
  background: rgba(255, 107, 107, 0.9);
  color: white;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.alert-info {
  background: rgba(52, 152, 219, 0.9);
  color: white;
  border: 1px solid rgba(52, 152, 219, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
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

  .header h2 {
    font-size: 2rem;
  }

  .quick-report-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
