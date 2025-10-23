import dbConnect from "@/lib/mongoose";
import Alert from "@/models/alert";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { authenticate } from "@/middleware/auth";

function genId() {
  const d = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `ALERT-${d}-${uuidv4().slice(0, 4).toUpperCase()}`;
}

export async function POST(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }
    await dbConnect();
    const body = await req.json();
    const alert = await Alert.create({
      alert_id: genId(),
      category: "sos",
      patient_id: auth.patient._id,
        patient_name: auth.patient.name,
        patient_phone: auth.patient.phone,
        patient_age: auth.patient.age,

      ...body,
    });
    return NextResponse.json({success:true, alert}, { status: 201 });
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
