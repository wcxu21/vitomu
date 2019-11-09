import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from "typemoq";
import { AppearanceService } from '../../app/services/appearance/appearance.service';
import { TranslatorService } from '../../app/services/translator/translator.service';
import { AppComponent } from '../../app/app.component';
import { ElectronService } from '../../app/services/electron.service';

describe('AppComponent', () => {
    describe('constructor', () => {
        it('Should apply language', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
         
            // Act
            let appComponent: AppComponent = new AppComponent(translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            translatorServiceMock.verify(x => x.applyLanguage(), Times.atLeastOnce());
        });

        it('Should apply theme', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            
            // Act
            let appComponent: AppComponent = new AppComponent(translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            appearanceServiceMock.verify(x => x.applyTheme(), Times.atLeastOnce());
        });
    });
});