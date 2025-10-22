import dbConnect from "@/lib/mongoose";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";
import { checkPermission } from '@/middleware/adminAuth';
export async function GET(_, { params }) {
  try {
    const auth = await checkPermission(request, "view_patients");

    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }
    await dbConnect();
    const alerts = await Alert.find({ patient_id: params.patientId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
