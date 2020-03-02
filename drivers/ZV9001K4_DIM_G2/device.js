'use strict';

const Homey = require('homey');

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

module.exports = class ZW_WallController extends ZwaveDevice {

	async onMeshInit() {

		this.enableDebug();
		this.printNode();
		
		this.registerCapability('alarm_battery', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');
	}

}