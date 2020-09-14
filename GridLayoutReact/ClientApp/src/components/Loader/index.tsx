import * as React from 'react';
import { IProps } from './IProps';
import './styles.scss';


export default class Loader extends React.PureComponent<IProps, any> {

    //<constructor> Initializing State And Props
    constructor(props: any) {
        super(props);
    }

    /// <render> rendering DOM.
    public render() {
        return (
            <React.Fragment>
                {
                    this.props.isActive ?
                        <div className="loaderContainer">
                            <div className="spinner-border text-warning"></div>
                        </div> : ""
                }
            </React.Fragment>
        );
    }


};




