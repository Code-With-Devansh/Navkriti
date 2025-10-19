import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import patient from '@/models/patient';
export async function GET() {
  try {
    await dbConnect();
    const patients = await patient.find({}).sort({ createdAt: -1 }).limit(100);
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
    const patient = await patient.create(body);
    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// app/api/mongoose-patients/[id]/route.js

// GET single patient
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const patient = await patient.findById(params.id);
    if (!patient) {
      return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT update patient
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const patient = await patient.findByIdAndUpdate(params.id, body, {
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
    const deletedpatient = await patient.findByIdAndDelete(params.id);
    if (!deletedpatient) {
      return NextResponse.json({ success: false, error: 'patient not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}