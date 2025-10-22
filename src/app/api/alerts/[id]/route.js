import dbConnect from "@/lib/mongoose";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";
import { checkPermission } from '@/middleware/adminAuth';
export async function GET(_, { params }) {
  await dbConnect();
  const alert = await Alert.findById(params.id);
  if (!alert)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(alert);
}

export async function PUT(req, { params }) {
  try {
    const auth = await checkPermission(req, "view_patients");

    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }
    await dbConnect();
    const body = await req.json();
    const alert = await Alert.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(alert);
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
