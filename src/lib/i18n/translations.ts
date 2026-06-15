export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      liveMonitoring: 'Live Monitoring',
      cameraMonitoring: 'Camera Monitoring',
      parkingViolations: 'Parking Violations',
      vehicleSessions: 'Vehicle Sessions',
      gateMonitoring: 'Gate Monitoring',
      analytics: 'Analytics',
      users: 'Users',
      settings: 'Settings',
      menu: 'MENU',
      collapse: 'Collapse',
    },
    // Header
    header: {
      search: 'Search plate numbers, sessions...',
      online: 'Online',
    },
    // Dashboard Page
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Campus parking monitoring system summary for today',
      kpi: {
        activeVehicles: 'Active Vehicles',
        inCampus: 'In campus',
        vsYesterday: 'vs yesterday',
        todaysViolations: 'Today\'s Violations',
        violationsToday: 'Violations today',
        vehiclesEntered: 'Vehicles Entered',
        enteredToday: 'Entered today',
        vehiclesExited: 'Vehicles Exited',
        exitedToday: 'Exited today',
        faceMismatch: 'Face Mismatch',
        plateMismatch: 'Plate Mismatch',
        alertsToday: 'Alerts today',
      },
      charts: {
        trafficTrend: 'Vehicle Traffic Trend',
        trafficDesc: 'Hourly vehicles entering & exiting',
        today: 'Today',
        masuk: 'Entry',
        keluar: 'Exit',
        violationStats: 'Violation Statistics',
        last7Days: 'Last 7 days',
        pelanggaran: 'Violations',
        zoneDistribution: 'Parking Zone Distribution',
        zoneDesc: 'Vehicle distribution per zone',
      },
      recentActivities: {
        title: 'Recent Activities',
        desc: 'Latest system activities',
        live: 'Live',
      },
      liveCamera: {
        title: 'Live Video Feed',
        otherFeeds: 'OTHER FEEDS',
        viewAll: 'View All Cameras',
        live: 'Live',
        offline: 'Camera Offline',
      }
    }
  },
  id: {
    // Navigation
    nav: {
      dashboard: 'Beranda',
      liveMonitoring: 'Pemantauan Langsung',
      cameraMonitoring: 'Pemantauan Kamera',
      parkingViolations: 'Pelanggaran Parkir',
      vehicleSessions: 'Sesi Kendaraan',
      gateMonitoring: 'Pemantauan Gerbang',
      analytics: 'Analitik',
      users: 'Pengguna',
      settings: 'Pengaturan',
      menu: 'MENU',
      collapse: 'Tutup',
    },
    // Header
    header: {
      search: 'Cari plat nomor, sesi...',
      online: 'Aktif',
    },
    // Dashboard Page
    dashboard: {
      title: 'Ringkasan Beranda',
      subtitle: 'Ringkasan sistem monitoring parkir kampus hari ini',
      kpi: {
        activeVehicles: 'Kendaraan Aktif',
        inCampus: 'Dalam kampus',
        vsYesterday: 'vs kemarin',
        todaysViolations: 'Pelanggaran Hari Ini',
        violationsToday: 'Pelanggaran hari ini',
        vehiclesEntered: 'Kendaraan Masuk',
        enteredToday: 'Masuk hari ini',
        vehiclesExited: 'Kendaraan Keluar',
        exitedToday: 'Keluar hari ini',
        faceMismatch: 'Wajah Tidak Cocok',
        plateMismatch: 'Plat Tidak Cocok',
        alertsToday: 'Peringatan hari ini',
      },
      charts: {
        trafficTrend: 'Tren Lalu Lintas Kendaraan',
        trafficDesc: 'Kendaraan masuk & keluar per jam',
        today: 'Hari Ini',
        masuk: 'Masuk',
        keluar: 'Keluar',
        violationStats: 'Statistik Pelanggaran',
        last7Days: '7 hari terakhir',
        pelanggaran: 'Pelanggaran',
        zoneDistribution: 'Distribusi Zona Parkir',
        zoneDesc: 'Distribusi kendaraan per zona',
      },
      recentActivities: {
        title: 'Aktivitas Terbaru',
        desc: 'Aktivitas sistem terkini',
        live: 'Langsung',
      },
      liveCamera: {
        title: 'Tayangan Video Langsung',
        otherFeeds: 'FEED LAINNYA',
        viewAll: 'Lihat Semua Kamera',
        live: 'Langsung',
        offline: 'Kamera Nonaktif',
      }
    }
  }
};

export type Language = 'en' | 'id';
export type TranslationKey = typeof translations.en;
