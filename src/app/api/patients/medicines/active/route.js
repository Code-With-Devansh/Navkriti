// app/api/patient/medicines/active/route.js
// Get all active medicines for logged-in patient
import { NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';
import Patient from '@/models/patient';
import dbConnect from '@/lib/mongoose';

export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await dbConnect();
    const patient = await Patient.findById(auth.user._id);
    
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    const activeMedicines = patient.getActivePrescriptions();

    return NextResponse.json({
      success: true,
      data: activeMedicines,
    });
  } catch (error) {
    console.error('Get active medicines error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}


