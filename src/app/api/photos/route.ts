import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPhotos } from "@/lib/storage";

export async function GET() {
  try {
    // Try to get photos from Supabase first if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    // Fall back to local file storage
    const photos = getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    // Return empty array on error to prevent JSON parsing issues
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!   // IMPORTANT
    );

    const fileName = `uploads/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("photos")  // make sure this matches your bucket name
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      path: data.path,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
