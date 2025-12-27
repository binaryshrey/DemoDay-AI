import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export async function POST(req: Request) {
  try {
    const { filename, contentType, folder = "uploads" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType required" },
        { status: 400 }
      );
    }

    // Initialize Storage client
    // This will automatically use Application Default Credentials (ADC)
    // which includes: gcloud auth application-default login credentials,
    // service account keys, or Workload Identity Federation on Vercel
    const storageOptions: any = {
      projectId: process.env.GCP_PROJECT_ID,
    };

    // For local dev: use the credentials file if specified
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      storageOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    const storage = new Storage(storageOptions);

    const bucketName = process.env.GCS_BUCKET_NAME!;
    const safeName = filename.replace(/\\/g, "/").split("/").pop()!;
    const objectPath = `${folder}/${Date.now()}-${safeName}`;

    const file = storage.bucket(bucketName).file(objectPath);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    return NextResponse.json({
      uploadUrl,
      gcs_bucket: bucketName,
      gcs_object_path: objectPath,
    });
  } catch (err: any) {
    console.error("Error creating signed upload URL:", err);

    // Provide helpful error message
    let errorMessage = err?.message ?? "Failed to create upload URL";

    if (
      err.message?.includes("client_email") ||
      err.message?.includes("Could not load the default credentials")
    ) {
      errorMessage =
        "Missing GCS credentials. Run: gcloud auth application-default login";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
