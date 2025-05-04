import path from "path";

export const validateUploadedFiles = (files: { originalname: string }[]) => {
  // Danh sách các phần mở rộng file video/manifest được phép
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];

  if (!files || files.length === 0) {
    throw new Error("No files provided for validation.");
  }

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        `Unsupported file type: ${ext}. Allowed types are: ${allowedExtensions.join(
          ", "
        )}`
      );
    }
  }
  console.log("All uploaded files have supported extensions.");
};

export const getContentType = (filename: string): string => {
  const ext = path.extname(filename);

  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl"; // Hoặc 'application/x-mpegURL'
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    case ".jpg":
      return "image/jpg";
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};

export const handleAdvancedVideoUpload = async (
  s3: any,
  files: { originalname: string; buffer: Buffer }[],
  uniqueId: string,
  bucketName: string
): Promise<{ videoUrl: string; videoType: "hls" | "dash" } | null> => {
  // Kiểm tra xem có file manifest HLS/DASH không
  const manifestFile = files.find(
    (file) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );
  if (!manifestFile) {
    return null;
  }

  console.log(`Handling advanced video upload for ID: ${uniqueId}`);

  // Tải lên tất cả các tệp (manifest và segments)
  const uploadPromises = files.map((file) => {
    const s3Key = `videos/${uniqueId}/${file.originalname}`;
    console.log(
      `  Uploading ${file.originalname} to s3://${bucketName}/${s3Key}`
    );
    return s3
      .upload({
        Bucket: bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: getContentType(file.originalname),
      })
      .promise();
  });

  await Promise.all(uploadPromises);
  console.log(`  All files uploaded for ID: ${uniqueId}`);

  const manifestFileName = manifestFile.originalname;
  const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const manifestUrl = cloudfrontDomain
    ? `https://${cloudfrontDomain}/videos/${uniqueId}/${manifestFileName}`
    : `https://${bucketName}.s3.amazonaws.com/videos/${uniqueId}/${manifestFileName}`; // URL S3 cơ bản nếu không có CloudFront

  console.log(`  Manifest URL (${videoType}): ${manifestUrl}`);

  return {
    videoUrl: manifestUrl,
    videoType,
  };
};

export const calculatePercentage = (
  completedCount: number,
  totalCount: number
): number => {
  if (totalCount <= 0) {
    return 0;
  }

  const percentage = (completedCount / totalCount) * 100;

  return Math.round(percentage);
};
