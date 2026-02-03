import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    // Try MongoDB first if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDb();
        const profile = await db.collection('profile')
          .findOne({});
        
        if (profile) {
          return NextResponse.json({ 
            profileImage: profile.profileImage || null,
            name: profile.name || "Roop",
            title: profile.title || "Professional Photographer & Visual Storyteller",
            bio: profile.bio || []
          });
        }
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        // Fall through to default
      }
    }

    // Return default values if no profile found
    return NextResponse.json({ 
      profileImage: null,
      name: "Roop",
      title: "Professional Photographer & Visual Storyteller",
      bio: []
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ 
      profileImage: null,
      name: "Roop",
      title: "Professional Photographer & Visual Storyteller",
      bio: []
    });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    
    // Handle JSON upload (from admin dashboard with base64 data URL)
    if (contentType?.includes("application/json")) {
      const body = await req.json();
      const { profileImage, name, title, bio } = body;

      if (!process.env.MONGODB_URI) {
        return NextResponse.json({ 
          error: "MongoDB not configured",
          details: "Please set MONGODB_URI environment variable."
        }, { status: 500 });
      }

      try {
        const db = await getDb();
        
        // Update or insert profile
        const profileData: any = {};
        if (profileImage !== undefined) profileData.profileImage = profileImage;
        if (name !== undefined) profileData.name = name;
        if (title !== undefined) profileData.title = title;
        if (bio !== undefined) profileData.bio = bio;
        profileData.updated_at = new Date().toISOString();
        
        const result = await db.collection('profile').updateOne(
          {},
          { $set: profileData },
          { upsert: true }
        );
        
        return NextResponse.json({ success: true, message: "Profile updated successfully" });
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        const errorMessage = mongoError instanceof Error ? mongoError.message : "Failed to save to MongoDB";
        
        return NextResponse.json({ 
          error: "Database error",
          details: errorMessage
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  } catch (err) {
    console.error("Profile update error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    
    return NextResponse.json({ 
      error: "Server error", 
      details: errorMessage
    }, { status: 500 });
  }
}
