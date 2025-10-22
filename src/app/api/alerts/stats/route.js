import dbConnect from "@/lib/mongoose";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = await checkPermission(request, "view_patients");

    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }
    await dbConnect();
    const stats = await Alert.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
