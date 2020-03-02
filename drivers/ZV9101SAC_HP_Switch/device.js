'use strict';

const ZwaveLightDevice = require('homey-meshdriver').ZwaveLightDevice;

module.exports = class ZW_Switch extends ZwaveLightDevice {

    onMeshInit() {

        this.enableDebug();
        this.printNode();

        this.registerCapability('onoff', 'BASIC');

		this.registerReportListener('BASIC', 'BASIC_REPORT', (report) => {
			if (report && report.hasOwnProperty('Current Value')) {
				if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', report['Current Value'] > 0);
			}
		});
    }

}