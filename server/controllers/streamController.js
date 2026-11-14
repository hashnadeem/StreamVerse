import fs from 'fs';
import path from 'path';

/**
 * Streams a local video file using HTTP 206 Partial Content Range requests,
 * or redirects to CDN MP4 stream when hosted externally.
 */
export const streamVideoChunk = (req, res) => {
  const { videoPath } = req.query;
  if (!videoPath) {
    return res.status(400).json({ message: 'Missing videoPath query parameter' });
  }

  if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
    return res.redirect(videoPath);
  }

  const resolvedPath = path.resolve(videoPath);
  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).json({ message: 'Requested video file not found on server' });
  }

  const stat = fs.statSync(resolvedPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(resolvedPath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const CHUNK_SIZE = 10 ** 6; // 1MB chunk
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : Math.min(start + CHUNK_SIZE, fileSize - 1);

  const contentLength = end - start + 1;
  const fileStream = fs.createReadStream(resolvedPath, { start, end });

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  });

  fileStream.pipe(res);
};

