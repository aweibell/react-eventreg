import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {TextInput, CheckBox, Dropdown} from '../columns/RegistrationColumns';

import {TEXT, CHECKBOX, DROPDOWN} from '../columns/types';

const defaultRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  padding: '10px',
  margin: '0',
  borderTop: 'solid thin #777',
  backgroundColor: '#bbb',
  button: {
    alignSelf: 'flex-end',
    margin: '10px 6px 2px',
    borderRadius: '4px',
    flexGrow: '0',
    fontWeight: 'bold'
  },
  addButton: {
    backgroundColor: '#070',
    color: '#fff'
  },
  deleteButton: {
    backgroundColor: '#a00',
    color: '#fff'
  },
  input: {
    padding: '2px 5px',
    borderRadius: '4px'
  }
};

class RegistrationRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: {}
    };
    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.sendValue = this.sendValue.bind(this);
  }

  sendValue(value, colName) {
    if (this.props.data) {
      // send updated row to parent
      const { data } = this.props;
      data[colName] = value;
      this.props.updateRow(this.props.index, data);
    } else {
      // row not added to collection yet, so update our own state
      const { rowData } = this.state;
      rowData[colName] = value;
      this.setState({ rowData });
    }
  }

  addRow(event) {
    event.preventDefault();
    if (this.props.addRow) {
      // calling parent to add row to collection
      this.props.addRow(this.state.rowData, this.props.collectionId);
      this.rowForm.reset();
      this.setState({rowData: {}});
    }
  }

  deleteRow(event) {
    event.preventDefault();
    if (this.props.deleteRow) {
      this.props.deleteRow(this.props.index);
    }
  }

  render() {
    const { data, columns, style, texts } = this.props;
    // TODO: Consider lodash for deep cloning instead of Object.assign
    const rowStyle = Object.assign({}, defaultRowStyle, style);
    const buttonStyle = Object.assign({}, rowStyle.button);
    const deleteButtonStyle = Object.assign({}, buttonStyle, rowStyle.deleteButton);
    const addButtonStyle = Object.assign({}, buttonStyle, rowStyle.addButton);
    delete rowStyle.button;
    delete rowStyle.addButton;
    delete rowStyle.deleteButton;
    return (
      <div className="registration-row">
        <form ref={(input) => this.rowForm = input} style={rowStyle} onSubmit={(e) => this.addRow(e)}>
        {
          columns.map((data, index) => {
            const {id, name, type, options} = data;
            const fieldData = this.props.data ? this.props.data[id] : undefined;
            switch (type) {
              case CHECKBOX:
                return <CheckBox key={index} id={id} name={name} type={type}
                                 sendValue={this.sendValue} style={style} data={fieldData} />
              case DROPDOWN:
                return <Dropdown key={index} id={id} options={options} name={name} type={type}
                                 sendValue={this.sendValue} style={style} data={fieldData} />
              case TEXT:
              default:
                return <TextInput key={index} id={id} name={name} type={type}
                                  ref={(input) => this.textInput = input}
                                  sendValue={this.sendValue} style={style} data={fieldData} />
            }
          })
        }
          {this.props.addRow &&
            <button style={addButtonStyle} type="submit" >{texts.addRow}</button>
          }
          {this.props.deleteRow &&
            <button style={deleteButtonStyle} onClick={this.deleteRow} type="" >{texts.deleteRow}</button>
          }
        </form>
      </div>
    );
  }
}

RegistrationRow.propTypes = {
  collectionId: PropTypes.string.isRequired,
  index: PropTypes.number,
  data: PropTypes.object,
  addRow: PropTypes.func,
  deleteRow: PropTypes.func,
  updateCollection: PropTypes.func,
  style: PropTypes.object,
  texts: PropTypes.object,
  columns: PropTypes.array.isRequired
}

export default RegistrationRow;
