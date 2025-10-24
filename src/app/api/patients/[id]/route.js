// app/api/mongoose-patients/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Patient from '@/models/patient';
// GET single patient
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const patient = await Patient.findById(params.id);
    if (!patient) {
      return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}