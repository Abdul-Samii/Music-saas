// apps/worker/src/processors/video.processor.ts
import { Worker, Job } from 'bullmq'
import ffmpeg from 'fluent-ffmpeg'

const videoWorker = new Worker('video-render', async (job: Job) => {
  const { videoTemplatePath, audioPath, lyrics, outputPath } = job.data
  // 1. Overlay lyrics using FFmpeg drawtext filter
  // 2. Upload to storage
  // 3. Update DB record via internal API call
})