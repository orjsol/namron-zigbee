'use strict';

// # Basic

// ManufacturerName: "Sunricher"
// ProductID: "ZG9101SAC-HP"
// DeviceID: 257
// ProfileID: 260

// # Jason

// ManufacturerName: "NAMRON AS", "NAMRON  AS", "NAMRON As"
// ProductID: "4512700"

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

module.exports = class ZG_Dimmer extends ZigBeeLightDevice {

    async onMeshInit() {

        await super.onMeshInit();
        
        this.enableDebug();

        this.printNode(); 

        this.log('GreenPowerProxy endpoint: ', this.getClusterEndpoint('genGreenPowerProxy'));

        if (this.getClusterEndpoint('genGreenPowerProxy') !== 0) {

            this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, value => {

                this.log('onoff', value);

                this.setCapabilityValue('onoff', value === 1);
                
                if (this.hasCapability('dim') && value === 0) {

                    this.setCapabilityValue('dim', value);
                }
            }, 0);
        }

        this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 3, 300, 3, value => {

            if (this.getCapabilityValue('onoff') === true) {

                this.log('dim report', value);

                this.setCapabilityValue('dim', value / 254);
            }
        }, 0);
    }

}