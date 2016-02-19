"use strict";

let React = require('react');

import Store from '../../../stores/model-detail-store';
import ViewManager from '../view-manager';
import FieldStore from '../../../stores/field-store';
import _ from 'lodash';

import SensorView from './sensor.react';

export default class SensorsView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
        this.handleAddSensor = () => {
            let newSensorURI = Store.addSensor();
        };
        this.handleClick = (uri) => {
            return () => {
                ViewManager.setView(SensorView, { uri: uri });
            };
        };
    }

    render() {
        const device = Store.getDevice();
        const { sensors } = device;
        return (
            <div>
                <h3>Sensors</h3>
                <div>
                    {
                        <div className="col-md-4" key={-1}>
                            <button className="big indigo" onClick={this.handleAddSensor}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    }
                    {
                        sensors.map((s, index) => {
                            return (
                                <div className="col-md-4" key={s}>
                                    <button className="big" onClick={this.handleClick(s)}>
                                        <div>
                                            {
                                                _.find(FieldStore.getSensorTypes(), (t) => {
                                                    return  device.getSensorObserves(s) === t.literal;
                                                }).label
                                            }
                                        </div>
                                    </button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}