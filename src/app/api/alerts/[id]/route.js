import dbConnect from '@/lib/mongoose';
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await dbConnect();
  const alert = await Alert.findById(params.id);
  if (!alert) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(alert);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const alert = await Alert.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(alert);
}
