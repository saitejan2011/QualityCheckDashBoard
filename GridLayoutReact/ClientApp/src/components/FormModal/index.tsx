import * as React from 'react';
import './styles.scss';
import '../../Utility/gbStyles.scss';
import 'lodash';
import 'bootstrap';
// import { Button, Modal } from 'react-bootstrap';










export default class FormModal extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            dBData: []
        }
    }

    getControl(key: string): JSX.Element {
        switch (key) {
            case "textbox":
                return (
                    <span></span>
                );
            case "datepicker":
                return (
                    <span></span>
                );

            default:
                return (<span></span>);
        }


    }




    public render() {
        return (
            <div>


                <div className="modal fade right" id="fullHeightModalRight" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true">

                    <div className="modal-dialog modal-full-height modal-right" role="document">


                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title w-100" id="myModalLabel">New Form</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                            {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }







};


