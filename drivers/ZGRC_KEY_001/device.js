'use strict';

// # Basic

// ManufacturerName: "Sunricher"
// ProductID: "ZGRC-KEY-004"
// DeviceID: 1
// ProfileID: 260

// # Jason

// ManufacturerName: "NAMRON AS", "NAMRON  AS", "NAMRON As"
// ProductID: "4512701"

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

module.exports = class ZG_WallController extends ZigBeeDevice {

    onMeshInit() {

        this.enableDebug();

        this.printNode();

        this.log(this.getStore());

        // supported scenes and their reported attribute numbers (all based on reported data)
		this.buttonMap = {
			0: {
				button: 'Group1',
			}
		};

		this.sceneMap = {
			on: {
				scene: 'Switched ON',
			},
			off: {
				scene: 'Switched OFF',
			},
			moveWithOnOff_move_up: {
				scene: 'Dimming UP',
			},
			moveWithOnOff_move_down: {
				scene: 'Dimming DOWN',
			},
			stopWithOnOff: {
				scene: 'Dimming STOP',
			},
		};

        this.registerCapability('measure_battery', 'genPowerCfg');

        this.registerAttrReportListener('genPowerCfg', 'batteryPercentageRemaining', 10, 60, 1, this.onPowerCgfBatteryRercentageRemainingReport.bind(this), 0)
            .then(() => {

                this.log('registered attr report listener');
            })
            .catch(err => {

                this.error('failed to register attr report listener', err);
            });

        let clustersArray = ['genOnOff', 'genLevelCtrl'];
        this.log(clustersArray, Object.keys(clustersArray));

        Object.keys(this.node.endpoints).forEach(endpointsID => {

            this.log('- Endpoints: ', endpointsID);

            Object.keys(clustersArray).forEach(clusterID => {

                this.log('- Clusters: ', clustersArray[clusterID]);

                if (typeof this.node.endpoints[endpointsID].clusters[clustersArray[clusterID]] !== 'undefined') {

                    if (this.getStoreValue(`${endpointsID}_${clustersArray[clusterID]}_bind`) !== true) {

                        this.log('binding', this.node.endpoints[endpointsID].clusters[clustersArray[clusterID]]);

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

    onPowerCgfBatteryRercentageRemainingReport(value) {

        this.log('onPowerCgfBatteryRercentageRemainingReport', value);

        if (this.hasCapability('alarm_batter')) {

            this.setCapabilityValue('alarm_battery', value < 10);
        }

        this.setCapabilityValue('measure_battery', value);
    }

}