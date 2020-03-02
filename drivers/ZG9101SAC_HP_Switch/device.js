'use strict';

// # Basic

// ManufacturerName: "Sunricher"
// ProductID: "ON/OFF"
// DeviceID: 256
// ProfileID: 260

// # Jason

// ManufacturerName: "NAMRON AS", "NAMRON  AS", "NAMRON As"
// ProductID: "4512704"

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

module.exports = class ZG_Switch extends ZigBeeLightDevice {

    async onMeshInit() {

        await super.onMeshInit();

        this.printNode();

        this.enableDebug();

        this.log('GreenPowerProxy endpoint: ', this.getClusterEndpoint('genGreenPowerProxy'));

        if (this.getClusterEndpoint('genGreenPowerProxy') !== 0) {

            this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, value => {

                this.log('onoff', value);
                this.setCapabilityValue('onoff', value === 1);
            }, 0);
        }
    }
}