import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Gunakan variabel lingkungan DATABASE_URL yang disediakan oleh integrasi Neon
    const sql = neon(process.env.DATABASE_URL!)

    // Coba jalankan query sederhana
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      connected: true,
      message: "Koneksi ke database Neon berhasil!",
      serverTime: result[0].time,
      databaseUrl: process.env.DATABASE_URL ? "Tersedia" : "Tidak tersedia",
    })
  } catch (error: any) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        connected: false,
        message: "Gagal terhubung ke database Neon",
        error: error.message,
        databaseUrl: process.env.DATABASE_URL ? "Tersedia" : "Tidak tersedia",
      },
      { status: 500 },
    )
  }
}
