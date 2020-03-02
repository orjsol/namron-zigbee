'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

module.exports = class ZW_DoorWindowSensor extends ZwaveDevice {

	async onMeshInit() {

		this.enableDebug();
		this.printNode();

		this.registerCapability('alarm_contact', 'BASIC', {
			getOpts: {
				getonOnline: true,
			}
		});

		this.registerCapability('alarm_tamper', 'SENSOR_ALARM', {
			getOpts: {
				getonOnline: true,
			}
		});

		// if (this.node.CommandClass.COMMAND_CLASS_SENSOR_MULTILEVEL) {
		// 	this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
		// 		getOnStart: false, 
		// 	});
		// }

		this.registerCapability('measure_battery', 'BATTERY');
	}

}