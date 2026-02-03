import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPhotos, savePhotos } from "@/lib/storage";

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
    const contentType = req.headers.get("content-type");
    
    // Handle JSON upload (from admin dashboard with base64 data URL)
    if (contentType?.includes("application/json")) {
      const body = await req.json();
      const { url, category, created_at } = body;

      if (!url) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
      }

      // Try Supabase first if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data, error } = await supabase
            .from("photos")
            .insert([{
              url,
              category: category || "Portrait",
              created_at: created_at || new Date().toISOString()
            }])
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json({ success: true, data });
          }
        } catch (supabaseError) {
          console.error("Supabase error:", supabaseError);
          // Fall through to local storage
        }
      }

      // Fall back to local file storage
      const photos = getPhotos();
      const newPhoto = {
        id: photos.length > 0 ? Math.max(...photos.map((p: any) => p.id || 0)) + 1 : 1,
        url,
        category: category || "Portrait",
        created_at: created_at || new Date().toISOString()
      };
      photos.push(newPhoto);
      savePhotos(photos);

      return NextResponse.json({ success: true, data: newPhoto });
    }

    // Handle FormData upload (file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const fileName = `uploads/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from("photos")
          .upload(fileName, file, {
            upsert: true,
          });

        if (error) {
          console.error("Supabase upload error:", error);
          // Fall through to local storage
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from("photos")
            .getPublicUrl(fileName);

          // Save to photos table
          const { data: photoData, error: photoError } = await supabase
            .from("photos")
            .insert([{
              url: urlData.publicUrl,
              category: formData.get("category") as string || "Portrait",
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (!photoError && photoData) {
            return NextResponse.json({ success: true, data: photoData });
          }
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
        // Fall through to local storage
      }
    }

    // Fall back: convert file to base64 and save to local storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const photos = getPhotos();
    const newPhoto = {
      id: photos.length > 0 ? Math.max(...photos.map((p: any) => p.id || 0)) + 1 : 1,
      url: dataUrl,
      category: (formData.get("category") as string) || "Portrait",
      created_at: new Date().toISOString()
    };
    photos.push(newPhoto);
    savePhotos(photos);

    return NextResponse.json({ success: true, data: newPhoto });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Try Supabase first if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase
          .from("photos")
          .delete()
          .eq("id", id);

        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
        // Fall through to local storage
      }
    }

    // Fall back to local file storage
    const photos = getPhotos();
    const filteredPhotos = photos.filter((p: any) => p.id !== id);
    savePhotos(filteredPhotos);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
