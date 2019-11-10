import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { LogoFullComponent } from '../../app/components/logo-full/logo-full.component';

describe('LogoFullComponent', () => {
    describe('constructor', () => {
        it('Should provide correct application name', () => {
            // Arrange
        
            // Act
            let logoFullComponent: LogoFullComponent = new LogoFullComponent();

            // Assert
            assert.equal(logoFullComponent.applicationName, "Vitomu");
        });
    });
});