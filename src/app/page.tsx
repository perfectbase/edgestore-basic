"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { edgestore } = useEdgeStore();

  return (
    <div className="flex flex-col gap-2 items-start">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
        }}
      />
      <button
        className="bg-gray-200 text-black rounded-md p-1 px-3 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none"
        onClick={async () => {
          if (file) {
            const res = await edgestore.documents.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
            setUploadedUrl(res.url);
          }
        }}
        disabled={!file || !!uploadedUrl}
      >
        Upload
      </button>
      <button
        className="bg-gray-200 text-black rounded-md p-1 px-3 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none"
        disabled={!uploadedUrl}
        onClick={async () => {
          if (uploadedUrl) {
            await edgestore.documents.delete({
              url: uploadedUrl,
            });
            setUploadedUrl(null);
          }
        }}
      >
        Delete
      </button>
    </div>
  );
}
