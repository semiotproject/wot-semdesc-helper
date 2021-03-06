import React from 'react';
import { Link } from 'react-router';
import Store from '../../stores/instance-detail-store';
import saveAs from 'browser-filesaver';
import { constructURIFromUUID } from '../../utils';

const capitalizeFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default class InstanceView extends React.Component {
    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            isLoading: true
        };

        this.handleSaveClick = (format) => {
            return () => {
                console.info(`downloading instance description in ${format}..`);
                Store.saveAsTurtle();
            };
        };
        this.handleChange = (p) => {
            return (e) => {
                console.info(`placeholder ${p} changed to ${e.target.value}`);
                Store.setPlaceholder(p, e.target.value);
                this.setState({
                    result: Store.toTurtle()
                });
            };
        };
        this.download = (name, text) => {
            return () => {
                debugger;
                const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                const fileName = `${name.toLowerCase().replace(' ', '_')}.ttl`;
                saveAs(blob, fileName);
            };
        };
    }

    componentDidMount() {
        Store.init(this.getURI()).done(() => {
            this.setState({
                result: Store.toTurtle(),
                isLoading: false
            });
        });
    }

    getURI() {
        return constructURIFromUUID(this.props.params.uri);
    }

    // render helpers
    renderView() {
        const { isLoading, result } = this.state;
        if (isLoading) {
            return "loading..";
        }
        const instance = Store.getInstance();

        console.log(result);
        return (
            <div className="col-md-6" style={{ float: 'none', margin: '0 auto' }}>
                <h3>Fill this form according to the <a href="https://github.com/semiotproject/semiot-platform/wiki/How-to-use-WoT-SemDesc-Helper-to-generate-device-descriptions">guide</a></h3>
                <form className="form-horizontal">
                    {
                        Object.keys(instance.placeholders).map((p) => {
                            return (
                                <div key={p} className="form-group">
                                    <label className="col-sm-1 control-label">{p}: </label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" value={instance.placeholders[p]} onChange={this.handleChange(p)}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                </form>
                <hr/>
                <h3>Result</h3>
                <div className="form-group" style={{ textAlign: "center" }}>
                    <label className="control-label">
                        <span>Device description template </span>
                        <i className="fa fa-download" onClick={this.download("description", result.device)}></i>
                    </label>
                </div>
                {
                    result.observations.length > 0 &&
                        result.observations.map((s, i) => {
                            return (
                                <div className="form-group" key={i} style={{ textAlign: "center" }}>
                                    <label className="control-label">
                                        <span>{capitalizeFirstLetter(s.type)} observation template </span>
                                        <i className="fa fa-download" onClick={this.download(`${s.type}-observation`, s.text)}></i>
                                    </label>
                                </div>
                            );
                        })
                }
            </div>
        );
    }

    render() {
        const { isLoading, result } = this.state;
        const instance = Store.getInstance();
        return (
            <div className="app-wrapper">
                <div className="app-header">
                    <div>
                        <Link to="/">
                            <button className="btn btn-primary" style={{
                                position: "absolute",
                                left: "20px",
                                top: "30px"
                            }}><i className="fa fa-arrow-circle-left"></i>&nbsp;Back</button>
                        </Link>
                        <h3>{
                            isLoading ?
                                "loading.." :
                                `Instance of model "${instance.model.label}"`
                            }
                        </h3>
                        <p>Fill the placeholders to generate your own template</p>
                    </div>
                </div>
                <div className="app-container instance-container">
                    {this.renderView()}
                </div>
            </div>
        );
    }
}