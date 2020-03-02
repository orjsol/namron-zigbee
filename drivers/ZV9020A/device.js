'use strict';

const Homey = require('homey');

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

module.exports = class ZW_Outlet extends ZwaveDevice {

	async onMeshInit() {

		this.enableDebug();
		this.printNode();
		
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_power', 'SENSOR_MULTILEVEL');
		this.registerCapability('meter_power', "METER");

		this.registerSetting('kwh_threshold_report', (value) => new ArrayBuffer([value * 100]));
	}

	async ledOnRunListener(args, state) {

		if (args.hasOwnProperty('color')) {

			return this.configurationGet({
				index: 41, 
				size: 1,
				id: "led_ring_color_on"
			}, new ArrayBuffer([args.color]));
		}
	}

	async ledOffRunListener(args, state) {

		if (args.hasOwnProperty('color')) {

			return this.configurationGet({ 
				index: 42, 
				size: 1,
				id: 'led_ring_color_off'
			}, new ArrayBuffer([args.color]));
		}
	}

}