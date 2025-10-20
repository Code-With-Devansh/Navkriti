import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Patient from '@/models/patient';
export async function GET() {
  try {
    await dbConnect();
    const patients = await Patient.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST create patient
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const patient = await Patient.create(body);
    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// app/api/mongoose-patients/[id]/route.js

// GET single patient
// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
//     const patient = await Patient.findById(params.id);
//     if (!patient) {
//       return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
//     }
//     return NextResponse.json({ success: true, data: patient });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//   }
// }

// PUT update patient
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const patient = await Patient.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE patient
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deletedpatient = await Patient.findByIdAndDelete(params.id);
    if (!deletedpatient) {
      return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}