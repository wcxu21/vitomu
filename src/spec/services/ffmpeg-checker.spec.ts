import * as assert from 'assert';
import * as path from 'path';
import { Mock } from 'typemoq';
import { FileSystem } from '../../app/core/file-system';
import { Logger } from '../../app/core/logger';
import { FFmpegChecker } from '../../app/services/convert/ffmpeg-checker';

describe('FFmpegChecker', () => {
    describe('isFFmpegInSystemPathAsync', () => {
        it('Should detect when FFmpeg is in the Operating System path', async () => {
            // Arrange
            const fileSystemMock = Mock.ofType<FileSystem>();
            const loggerMock = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.commanExistsAsync('ffmpeg')).returns(async () => true);
            fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');

            const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

            // Act
            const isFFmpegInPath: boolean = await ffmpegChecker.isFFmpegInSystemPathAsync();

            // Assert
            assert.ok(isFFmpegInPath);
        });

        it('Should detect when FFmpeg is not in the Operating System path', async () => {
            // Arrange
            const fileSystemMock = Mock.ofType<FileSystem>();
            const loggerMock = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.commanExistsAsync('ffmpeg')).returns(async () => false);
            fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');

            const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

            // Act
            const isFFmpegInPath: boolean = await ffmpegChecker.isFFmpegInSystemPathAsync();

            // Assert
            assert.ok(!isFFmpegInPath);
        });
    });

    describe('getPathOfDownloadedFFmpeg', () => {
        it('Should return an empty path if the FFmpeg directory is not found', async () => {
            // Arrange
            const fileSystemMock = Mock.ofType<FileSystem>();
            const loggerMock = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');
            const ffmpegFolder: string = path.join(fileSystemMock.object.applicatioDataDirectory(), 'FFmpeg');
            fileSystemMock.setup(x => x.pathExists(ffmpegFolder)).returns(() => false);

            const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

            // Act
            const pathOfDownloadedFFmpeg: string = ffmpegChecker.getPathOfDownloadedFFmpeg();

            // Assert
            assert.equal(pathOfDownloadedFFmpeg, '');
        });

        it('Should return an empty path if the FFmpeg directory is found but it does not contain a downloaded FFmpeg', async () => {
            // Arrange
            const fileSystemMock = Mock.ofType<FileSystem>();
            const loggerMock = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');
            const ffmpegFolder: string = path.join(fileSystemMock.object.applicatioDataDirectory(), 'FFmpeg');
            fileSystemMock.setup(x => x.pathExists(ffmpegFolder)).returns(() => true);
            fileSystemMock.setup(x => x.readDirectory(ffmpegFolder)).returns(() => ['test', 'otherfile', 'vlc.exe']);

            const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

            // Act
            const pathOfDownloadedFFmpeg: string = ffmpegChecker.getPathOfDownloadedFFmpeg();

            // Assert
            assert.equal(pathOfDownloadedFFmpeg, '');
        });

        it('Should return the path to the downloaded FFmpeg if a "ffmpeg" file is found', async () => {
             // Arrange
             const fileSystemMock = Mock.ofType<FileSystem>();
             const loggerMock = Mock.ofType<Logger>();

             fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');
             const ffmpegFolder: string = path.join(fileSystemMock.object.applicatioDataDirectory(), 'FFmpeg');
             fileSystemMock.setup(x => x.pathExists(ffmpegFolder)).returns(() => true);
             fileSystemMock.setup(x => x.readDirectory(ffmpegFolder)).returns(() => ['test', 'otherfile', 'ffmpeg']);

             const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

             // Act
             const pathOfDownloadedFFmpeg: string = ffmpegChecker.getPathOfDownloadedFFmpeg();

             // Assert
             assert.equal(pathOfDownloadedFFmpeg, '/directory/mock/FFmpeg/ffmpeg');

        });

        it('Should return the path to the downloaded FFmpeg if a "ffmpeg.exe" file is found', async () => {
            // Arrange
            const fileSystemMock = Mock.ofType<FileSystem>();
            const loggerMock = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.applicatioDataDirectory()).returns(() => '/directory/mock');
            const ffmpegFolder: string = path.join(fileSystemMock.object.applicatioDataDirectory(), 'FFmpeg');
            fileSystemMock.setup(x => x.pathExists(ffmpegFolder)).returns(() => true);
            fileSystemMock.setup(x => x.readDirectory(ffmpegFolder)).returns(() => ['test', 'otherfile', 'ffmpeg.exe']);

            const ffmpegChecker: FFmpegChecker = new FFmpegChecker(loggerMock.object, fileSystemMock.object);

            // Act
            const pathOfDownloadedFFmpeg: string = ffmpegChecker.getPathOfDownloadedFFmpeg();

            // Assert
            assert.equal(pathOfDownloadedFFmpeg, '/directory/mock/FFmpeg/ffmpeg.exe');
        });
    });

    describe('isFFmpegAvailable', () => {

    });
});
