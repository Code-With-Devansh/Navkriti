import { dbConnect } from "@/lib/dbConnect";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const stats = await Alert.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  return NextResponse.json(stats);
}
