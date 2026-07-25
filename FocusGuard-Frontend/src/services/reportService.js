import api from "../api/axios";

export const getDailyReport = async (date = null) => {
  const response = await api.get("/api/reports/daily/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const getWeeklyReport = async (date = null) => {
  const response = await api.get("/api/reports/weekly/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const getMonthlyReport = async (date = null) => {
  const response = await api.get("/api/reports/monthly/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const downloadPDFReport = async (
  reportType,
  date = null
) => {
  const response = await api.get(
    "/api/reports/download/pdf/",
    {
      params: {
        type: reportType,
        ...(date ? { date } : {}),
      },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = `${reportType}_report.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const downloadCSVReport = async (
  reportType,
  date = null
) => {
  const response = await api.get(
    "/api/reports/download/csv/",
    {
      params: {
        type: reportType,
        ...(date ? { date } : {}),
      },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = `${reportType}_report.csv`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};