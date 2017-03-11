import React, { Component } from 'react';
import './ClickableList.css';
import ImmutableSet from '../ImmutableSet';

const { arrayOf, shape, number, string, func, instanceOf } = React.PropTypes;

export default class ClickableList extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const { onClick, onSelect } = this.props;
        const id = e.target.dataset.id;
        if (e.ctrlKey) {
            onSelect(id);
        } else {
            onClick(id);
        }
    }

    renderItem(item) {
        const { selectedItems } = this.props;
        const className = selectedItems.contains(item.id) ? 'selected' : '';
        return (
            <li key={item.id} className='list-item'>
                <button className={className} data-id={item.id} onClick={this.onClick}>{item.value}</button>
            </li>
        );
    }

    render() {
        const { items } = this.props;
        const listItems = items.map(this.renderItem);
        return (
            <ul className="list">
                { listItems }
            </ul>
        );
    }

}


ClickableList.propTypes = {
    items: arrayOf(shape({
        id: number,
        value: string
    })).isRequired,
    onClick: func.isRequired,
    onSelect: func.isRequired,
    selectedItems: instanceOf(ImmutableSet).isRequired
};