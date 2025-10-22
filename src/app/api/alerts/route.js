import { dbConnect } from "@/lib/dbConnect";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

// GET all alerts (with filters)
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const filter = {};
  if (searchParams.get("status")) filter.status = searchParams.get("status");
  if (searchParams.get("category")) filter.category = searchParams.get("category");
  if (searchParams.get("patient_id")) filter.patient_id = searchParams.get("patient_id");

  const alerts = await Alert.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(alerts);
}
