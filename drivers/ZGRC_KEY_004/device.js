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

        this.node.on('command', (command) => {
			let remoteValue = {};
			if (command.attr === 'moveWithOnOff') {
				remoteValue = {
					button: this.buttonMap[command.endpoint].button,
					scene: this.sceneMap[`${command.attr}_move_${command.value.movemode === 1 ? 'up' : 'down'}`].scene,
				};
			} else {
				remoteValue = {
					button: this.buttonMap[command.endpoint].button,
					scene: this.sceneMap[`${command.attr}`].scene,
				};
			}
			this.log('Triggering sequence: remoteValue', remoteValue);

			// Trigger the trigger card with 2 autocomplete options
			Homey.app.triggerWallController_scene.trigger(this, null, remoteValue);
			// Trigger the trigger card with tokens
			Homey.app.triggerWallController_button.trigger(this, remoteValue, null);
		});

    }

    onSceneAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.sceneMap) {
			resultArray.push({
				id: this.sceneMap[sceneID].scene,
				name: Homey.__(this.sceneMap[sceneID].scene),
			});
		}
		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

	onButtonAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.buttonMap) {
			resultArray.push({
				id: this.buttonMap[sceneID].button,
				name: Homey.__(this.buttonMap[sceneID].button),
			});
		}

		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

    onPowerCgfBatteryRercentageRemainingReport(value) {

        this.log('onPowerCgfBatteryRercentageRemainingReport', value);

        if (this.hasCapability('alarm_batter')) {

            this.setCapabilityValue('alarm_battery', value < 10);
        }

        this.setCapabilityValue('measure_battery', value);
    }

}