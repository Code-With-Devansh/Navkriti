import { dbConnect } from "@/lib/dbConnect";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await dbConnect();
  const alerts = await Alert.find({ patient_id: params.patientId }).sort({ createdAt: -1 });
  return NextResponse.json(alerts);
}
