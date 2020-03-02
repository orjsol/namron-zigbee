'use strict';

// # Basic

// ManufacturerName: "Sunricher"
// ProductID: "ZG2868A"
// DeviceID: 1
// ProfileID: 260

// # Jason

// ManufacturerName: "NAMRON AS", "NAMRON  AS", "NAMRON As"
// ProductID: "4512706"

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

module.exports = class ZB_WallController extends ZigBeeDevice {

	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		this.log(this.getStore());

		// Register measure_battery capability
		this.registerCapability('measure_battery', 'genPowerCfg');

		this.registerAttrReportListener('genPowerCfg', 'batteryPercentageRemaining', 10, 60, 1, this.onPowerCfgBatteryPercentageRemainingReport.bind(this), 0)
			.then(() => {

				this.log('registered attr report listener');
			})
			.catch(err => {

				this.error('failed to register attr report listener', err);
			}
		);

		let clustersArray = ['genOnOff', 'genLevelCtrl'];
		this.log(clustersArray, Object.keys(clustersArray));

		Object.keys(this.node.endpoints).forEach(endpointsID => {
            
			this.log('- Endpoints:', endpointsID);

			Object.keys(clustersArray).forEach(clusterID => {

                this.log('-- Clusters:', clustersArray[clusterID]);
                
				if (typeof this.node.endpoints[endpointsID].clusters[clustersArray[clusterID]] !== 'undefined') {

					if (this.getStoreValue(`${endpointsID}_${clustersArray[clusterID]}_bind`) !== true) {

                        this.log('binding:', this.node.endpoints[endpointsID].clusters[clustersArray[clusterID]]);
                        
						this.node.endpoints[endpointsID].clusters[clustersArray[clusterID]].bind()
						.then(result => {

							this.setStoreValue(`${endpointsID}_${clustersArray[clusterID]}_bind`, true);
							this.log(`Registered ${clustersArray[clusterID]} cluster on endpoint ${endpointsID}`, result);
						})
						.catch(err => {

							if (err) this.log(`Something went wrong while binding the ${clustersArray[clusterID]} cluster on endpoint ${endpointsID}`, err);
						});
					}
				}
			});
		});
	}

	onPowerCfgBatteryPercentageRemainingReport(value) {

        this.log('onPowerCfgBatteryPercentageRemainingReport', value);
        
        if (this.hasCapability('alarm_battery')) this.setCapabilityValue('alarm_battery', value < 10);
        
		this.setCapabilityValue('measure_battery', value);
	}

}