import { PrismaClient } from '@prisma/client';
import { mockSessions, mockViolations, mockUsers } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Users
  for (const user of mockUsers) {
    await prisma.userAccount.upsert({
      where: { email: user.email },
      update: {},
      create: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        last_login: user.last_login ? new Date(user.last_login) : null,
        avatar_url: user.avatar_url,
        email: user.email,
      },
    });
  }

  // 2. Seed Sessions
  for (const session of mockSessions) {
    await prisma.sesiParkir.upsert({
      where: { session_id: session.session_id },
      update: {},
      create: {
        session_id: session.session_id,
        plat_nomor: session.plat_nomor,
        waktu_masuk: new Date(session.waktu_masuk),
        waktu_keluar: session.waktu_keluar ? new Date(session.waktu_keluar) : null,
        status_sesi: session.status_sesi,
        status_keputusan: session.status_keputusan,
        lokasi_gate_masuk: session.lokasi_gate_masuk,
        lokasi_gate_keluar: session.lokasi_gate_keluar,
        zona_parkir: session.zona_parkir,
      },
    });
  }

  // 3. Seed Violations
  for (const violation of mockViolations) {
    await prisma.logPelanggaran.upsert({
      where: { log_id: violation.log_id },
      update: {},
      create: {
        log_id: violation.log_id,
        session_id: violation.session_id,
        plat_nomor: violation.plat_nomor,
        waktu_pelanggaran: new Date(violation.waktu_pelanggaran),
        lokasi_parkir: violation.lokasi_parkir,
        jenis_pelanggaran: violation.jenis_pelanggaran,
        foto_bukti_url: violation.foto_bukti_url,
        status_notifikasi: violation.status_notifikasi,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
