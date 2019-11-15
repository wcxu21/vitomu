import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg-corrected';
import { Logger } from '../../core/logger';
import { VideoDetails } from './video-details';
import { Readable } from 'stream';
import * as progress from 'progress-stream';
import * as path from 'path';
import * as sanitize from 'sanitize-filename';
import { Injectable } from '@angular/core';
import { FFmpegChecker } from './ffmpeg-checker';
import { FileSystem } from '../../core/file-system';

@Injectable({
    providedIn: 'root',
})
export class ConvertService {
    private youtubeBaseUrl: string = "https://www.youtube.com/watch?v=";
    private youtubeVideoQuality: string = "highest";
    private requestOptions: any = { maxRedirects: 5 }; // TODO: shouldn't this be typed?
    private progressTimeoutMilliseconds: number = 100;
    private outputPath = path.join(this.fileSystem.musicDirectory(), "Vitomu");

    constructor(private logger: Logger, private ffmpegChecker: FFmpegChecker, private fileSystem: FileSystem) {
    }

    public async convertAsync(videoId: string): Promise<void> {
        try {
            await this.ffmpegChecker.ensureFFmpegIsAvailableAsync();
        } catch (error) {
            this.logger.error(`Could not ensure that FFmpeg is available. Error: ${error}`, "ConvertService", "downloadAsync");
            // TODO: make sure the user sees when this fails.
            return;
        }

        if (!this.ffmpegChecker.isFfmpegInPath && !this.ffmpegChecker.ffmpegPath) {
            this.logger.error("FFmpeg is not available.", "ConvertService", "downloadAsync");
            // TODO: make sure the user sees when this fails.
            return;
        }

        try {
            // Get info
            let videoUrl: string = this.youtubeBaseUrl + videoId;
            let videoInfo: ytdl.videoInfo = await ytdl.getInfo(videoUrl);
            let videoDetails: VideoDetails = new VideoDetails(videoInfo);
            let fileName: string = path.join(this.outputPath, sanitize(videoDetails.videoTitle) + ".mp3");

            this.logger.info(`File name: ${fileName}`, "ConvertService", "downloadAsync");

            // Make sure outputPath exists
            await this.fileSystem.ensureDirectoryAsync(this.outputPath);

            // Download
            let videoStream: Readable = ytdl.downloadFromInfo(videoInfo, { quality: this.youtubeVideoQuality, requestOptions: this.requestOptions });

            videoStream.on("response", (httpResponse) => {
                // Setup of progress module
                let str: any = progress({
                    length: parseInt(httpResponse.headers["content-length"]),
                    time: this.progressTimeoutMilliseconds
                });

                // Add progress event listener
                str.on("progress", (progress) => {
                    this.logger.info(`Progress: ${progress.percentage.toString()}`, "ConvertService", "downloadAsync");
                    // TODO
                });

                let outputOptions = [
                    "-id3v2_version", "4",
                    "-metadata", "title=" + videoDetails.title,
                    "-metadata", "artist=" + videoDetails.artist
                ];

                if (!this.ffmpegChecker.isFfmpegInPath) {
                    ffmpeg.setFfmpegPath(this.ffmpegChecker.ffmpegPath);
                }

                // Start encoding
                let proc: any = new ffmpeg({
                    source: videoStream.pipe(str)
                })
                    .audioBitrate(videoInfo.formats[0].audioBitrate)
                    .withAudioCodec("libmp3lame")
                    .toFormat("mp3")
                    .outputOptions(outputOptions)
                    .on("error", (error) => {
                        // TODO
                        this.logger.info(`An error occurred while encoding. Error: ${error}`, "ConvertService", "downloadAsync");
                    })
                    .on("end", () => {
                        // TODO
                    })
                    .saveToFile(fileName);
            });
        } catch (error) {
            this.logger.error(`Could not download video. Error: ${error}`, "ConvertService", "downloadAsync");
        }
    }
}