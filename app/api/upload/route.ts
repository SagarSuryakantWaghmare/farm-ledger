import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { validateImageFile } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const validation = validateImageFile(file);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result: any = await uploadImage(file);

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
