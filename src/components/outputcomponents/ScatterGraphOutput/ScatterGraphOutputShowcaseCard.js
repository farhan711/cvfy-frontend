import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import CustomCard from '../../stateless/cards';
import ScatterGraphOutputShowcaseModifyDialog from './ScatterGraphOutputShowcaseModifyDialog';
import ScatterGraphOutputPreview from './ScatterGraphOutputPreview';
import toastr from 'toastr';

class ScatterGraphOutputShowcaseCard extends React.Component {
  constructor(props) {
    super(props);
    let initHeaders = [];
    if (props.demoProps.outputComponentDemoModel.baseComponentId === 4) {
      initHeaders = props.demoProps.outputComponentDemoModel.props;
      this.selected = props.demoProps.outputComponentDemoModel.baseComponentId === props.demoProps.selected;
    }
    this.state = {
      headers: initHeaders,
      modifyDialogDisplay: false,
      previewDialogDisplay: false
    };
    this.demoModel = props.demoProps.demoModel;
    this.user = props.demoProps.user;
    this.outputComponentDemoModel = props.demoProps.outputComponentDemoModel;
    this.outputComponentDemoModelActions = props.demoProps.outputComponentDemoModelActions;
    this.forwardAddress = props.demoProps.forwardAddress;
    this.forwardAddressAlternate = props.demoProps.forwardAddressAlternate;
    this.showModifyDialog = this.showModifyDialog.bind(this);
    this.getHeaderRealLength = this.getHeaderRealLength.bind(this);
    this.showPreviewDialog = this.showPreviewDialog.bind(this);
    this.updateOutputComponentModel = this.updateOutputComponentModel.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.hideModifyDialog = this.hideModifyDialog.bind(this);
    this.hidePreviewDialog = this.hidePreviewDialog.bind(this);
  }

  showModifyDialog() {
    this.setState({ modifyDialogDisplay: true });
  }

  hideModifyDialog() {
    this.setState({ modifyDialogDisplay: false });
  }

  showPreviewDialog() {
    this.setState({ previewDialogDisplay: true });
  }

  hidePreviewDialog() {
    this.setState({ previewDialogDisplay: false });
  }

  updateOutputComponentModel() {
    if (Object.keys(this.demoModel).length === 0) {
      toastr.error('Registration info not found! Register again');
      browserHistory.push('/');
    } else {
      let propsToStore = [];
      this.state.headers.map((header) => {
        propsToStore.push(header);
      });
      this.outputComponentDemoModelActions.updateOutputComponentModel({
        id: this.demoModel.id,
        userid: this.user.id,
        baseComponentId: 4,
        props: propsToStore
      }).then(() => {
        if (this.props.demoProps.params.type === 'modify') {
          browserHistory.push('/ngh/user');
        } else {
          if (this.forwardAddressAlternate) {
            if (this.demoModel.status === 'input') {
              browserHistory.push(this.forwardAddress);
            } else if (this.demoModel.status === 'demo') {
              browserHistory.push(this.forwardAddressAlternate);
            }
          } else {
            browserHistory.push(this.forwardAddress);
          }
        }
      });
    }
  }

  updateHeaders(data) {
    let dataToUpdate = [];
    data.map((value) => {
      dataToUpdate.push(value);
    });
    this.setState({ headers: dataToUpdate });
  }

  getHeaderRealLength() {
    let counter = 0;
    this.state.headers.map(() => {
      counter += 1;
    });
    return counter;
  }

  getHeaders() {
    return this.state.headers;
  }

  render() {
    return (
      <div>
        <CustomCard
          header="Scatter Graph Output"
          width="five"
          context="selection"
          selected={this.selected}
          centeredParent
          centeredSegment
          displayData = {[
            `Number of Outputs: ${this.getHeaderRealLength()}`
          ]}
          buttonData = {[
            {
              label: 'Modify',
              onDeployClick: () => this.showModifyDialog()
            },
            {
              label: 'Preview',
              onDeployClick: () => this.showPreviewDialog()
            },
            {
              label: 'Save',
              onDeployClick: () => this.updateOutputComponentModel()
            }
          ]}
        />
        {this.state.modifyDialogDisplay && <ScatterGraphOutputShowcaseModifyDialog
          functions={{
            updateHeaders: this.updateHeaders,
            hideModifyDialog: this.hideModifyDialog,
            getHeaders: this.getHeaders
          }}
                                           />}

        {this.state.previewDialogDisplay && <ScatterGraphOutputPreview
          functions={{
            getHeaders: this.getHeaders,
            hidePreviewDialog: this.hidePreviewDialog
          }}
                                            />}
      </div>

    );
  }
}

ScatterGraphOutputShowcaseCard.propTypes = {
  demoProps: PropTypes.object.isRequired
};

export default ScatterGraphOutputShowcaseCard;

