'use strict';

const ZWaveLightDevice = require('homey-meshdriver').ZwaveLightDevice;

const util = require('./../../node_modules/homey-meshdriver/lib/util');

module.exports = class ZW_Dimmer extends ZWaveLightDevice {

    onMeshInit() {

        this.enableDebug();

        this.printNode();

        this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {
            set: 'SWITCH_MULTILEVEL_SET',
            setParserV4(value, options) {

                return {
                    Value: (value) ? 'on/enable' : 'off/disable',
                    'Dimming Duration': 'Default',
                };
            },
        });

        this.registerCapability('dim', 'SWITCH_MULTILEVEL');

        this.registerReportListener('BASIC', 'BASIC_REPORT', (report) => {

            if (report && report.hasOwnProperty('Current Value')) {

                if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', report['Current Value'] > 0);
                if (this.hasCapability('dim')) this.setCapabilityValue('dim', report['Current Value'] / 99);
            }
        });
    }

}