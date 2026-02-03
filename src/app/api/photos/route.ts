import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getPhotos } from "@/lib/storage";

export async function GET() {
  try {
    // Try MongoDB first if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDb();
        const photos = await db.collection('photos')
          .find({})
          .sort({ created_at: -1 })
          .toArray();
        
        // Convert MongoDB _id to id for compatibility
        const formattedPhotos = photos.map((photo: any) => ({
          id: photo._id.toString(),
          url: photo.url,
          category: photo.category,
          created_at: photo.created_at
        }));
        
        return NextResponse.json(formattedPhotos);
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        // Fall through to local storage
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
    console.log("Upload request - Content-Type:", contentType);
    
    // Handle JSON upload (from admin dashboard with base64 data URL)
    if (contentType?.includes("application/json")) {
      const body = await req.json();
      const { url, category, created_at } = body;

      console.log("JSON upload - URL length:", url?.length, "Category:", category);

      if (!url) {
        console.error("No URL provided in request");
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
      }

      // Try MongoDB first if configured
      if (process.env.MONGODB_URI) {
        try {
          const db = await getDb();
          const newPhoto = {
            url,
            category: category || "Portrait",
            created_at: created_at || new Date().toISOString()
          };
          
          const result = await db.collection('photos').insertOne(newPhoto);
          
          const savedPhoto = {
            id: result.insertedId.toString(),
            ...newPhoto
          };
          
          console.log("Photo saved to MongoDB successfully, ID:", savedPhoto.id);
          return NextResponse.json({ success: true, data: savedPhoto });
        } catch (mongoError) {
          console.error("MongoDB error:", mongoError);
          const errorMessage = mongoError instanceof Error ? mongoError.message : "Failed to save to MongoDB";
          
          // Check if it's a connection error
          if (errorMessage.includes("connection") || errorMessage.includes("MongoServerError") || errorMessage.includes("MongoNetworkError")) {
            return NextResponse.json({ 
              error: "Database connection error",
              details: "Unable to connect to MongoDB. Please check your MONGODB_URI environment variable."
            }, { status: 500 });
          }
          
          return NextResponse.json({ 
            error: "Database error",
            details: errorMessage
          }, { status: 500 });
        }
      }

      // Fall back to local file storage (only works in development, not on Vercel)
      try {
        const { savePhotos } = await import("@/lib/storage");
        const photos = getPhotos();
        const newPhoto = {
          id: photos.length > 0 ? Math.max(...photos.map((p: any) => p.id || 0)) + 1 : 1,
          url,
          category: category || "Portrait",
          created_at: created_at || new Date().toISOString()
        };
        photos.push(newPhoto);
        const saved = savePhotos(photos);
        
        if (!saved) {
          console.error("Failed to save photos to local storage - this is expected on Vercel");
          return NextResponse.json({ 
            error: "File storage not available. Please configure MongoDB for production deployment.",
            details: "Vercel's file system is read-only. Set MONGODB_URI environment variable in Vercel project settings."
          }, { status: 500 });
        }

        console.log("Photo saved to local storage successfully, ID:", newPhoto.id);
        return NextResponse.json({ success: true, data: newPhoto });
      } catch (storageError) {
        console.error("Storage error:", storageError);
        return NextResponse.json({ 
          error: "Storage not configured",
          details: "Please configure MONGODB_URI environment variable in Vercel project settings."
        }, { status: 500 });
      }
    }

    // Handle FormData upload (file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 for storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Try MongoDB first if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDb();
        const newPhoto = {
          url: dataUrl,
          category: (formData.get("category") as string) || "Portrait",
          created_at: new Date().toISOString()
        };
        
        const result = await db.collection('photos').insertOne(newPhoto);
        
        const savedPhoto = {
          id: result.insertedId.toString(),
          ...newPhoto
        };
        
        return NextResponse.json({ success: true, data: savedPhoto });
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        return NextResponse.json({ 
          error: "Database error",
          details: mongoError instanceof Error ? mongoError.message : "Failed to save to MongoDB"
        }, { status: 500 });
      }
    }

    // Fall back: save to local storage
    const { savePhotos } = await import("@/lib/storage");
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
    // Always return JSON, never HTML - this prevents the "Request Error" HTML page
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : String(err);
    console.error("Full error:", errorStack);
    
    return NextResponse.json({ 
      error: "Server error", 
      details: errorMessage,
      type: err instanceof Error ? err.constructor.name : typeof err
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Try MongoDB first if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDb();
        const { ObjectId } = await import('mongodb');
        
        // Handle both MongoDB ObjectId and string IDs
        let queryId;
        try {
          queryId = new ObjectId(id);
        } catch {
          queryId = id; // If not a valid ObjectId, use as string
        }
        
        const result = await db.collection('photos').deleteOne({ _id: queryId });
        
        if (result.deletedCount === 0) {
          // Try deleting by string ID if ObjectId didn't work
          const stringResult = await db.collection('photos').deleteOne({ _id: id });
          if (stringResult.deletedCount === 0) {
            return NextResponse.json({ error: "Photo not found" }, { status: 404 });
          }
        }
        
        return NextResponse.json({ success: true });
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    // Fall back to local file storage
    const { savePhotos } = await import("@/lib/storage");
    const photos = getPhotos();
    const filteredPhotos = photos.filter((p: any) => p.id !== id);
    savePhotos(filteredPhotos);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
