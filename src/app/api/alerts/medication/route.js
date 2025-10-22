import { dbConnect } from "@/lib/dbConnect";
import Alert from "@/models/alert";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

function genId() {
  const d = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `ALERT-${d}-${uuidv4().slice(0, 4).toUpperCase()}`;
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const exists = await Alert.findOne({
    patient_id: body.patient_id,
    category: "medication",
    createdAt: { $gte: since },
  });
  if (exists) return NextResponse.json({ message: "Alert already exists" });

  const alert = await Alert.create({
    alert_id: genId(),
    category: "medication",
    ...body,
  });
  return NextResponse.json(alert, { status: 201 });
}
