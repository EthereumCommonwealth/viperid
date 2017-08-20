import React from 'react';
import ReactModal from 'react-modal';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="viperidPanel">
        <button onClick={this.handleOpenModal}>Show Result Code</button>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
          style={{
            overlay: {
              zIndex: 100
            },
            content: {
              zIndex: 200
            }
          }}>
          <button onClick={this.handleCloseModal}>Close Modal</button>
          <textarea
            rows={30}
            cols={50}
            defaultValue={
              this.props.result &&
              JSON.stringify(this.props.result.result_abi, undefined, 2)
            }
          />
          <textarea
            rows={30}
            cols={50}
            defaultValue={
              this.props.result &&
              JSON.stringify(this.props.result.result_bytecode, undefined, 2)
            }
          />
        </ReactModal>
      </div>
    );
  }
}
