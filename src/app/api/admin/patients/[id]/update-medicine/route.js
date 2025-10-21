// app/api/admin/patients/[id]/update-medicine/route.js
// Admin API to update medicine status (activate/deactivate)
export async function PUT(request, { params }) {
  try {
    const auth = await checkPermission(request, 'edit_patients');
    
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await dbConnect();
    
    const { id } = params;
    const { history_id, medicine_id, is_active } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const patient = await Patient.findOneAndUpdate(
      {
        _id: id,
        'med_history._id': history_id,
        'med_history.prescription._id': medicine_id,
      },
      {
        $set: {
          'med_history.$[history].prescription.$[medicine].is_active': is_active,
        },
      },
      {
        arrayFilters: [
          { 'history._id': history_id },
          { 'medicine._id': medicine_id },
        ],
        new: true,
      }
    ).select('-password');

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient or medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: patient,
        message: `Medicine ${is_active ? 'activated' : 'deactivated'} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update medicine error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update medicine' },
      { status: 500 }
    );
  }
}