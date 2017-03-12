import React, { Component } from 'react';
import './ClickableList.css';
import ImmutableSet from '../ImmutableSet';

const { arrayOf, shape, number, string, func, instanceOf } = React.PropTypes;

export default class ClickableList extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onWheel = this.onWheel.bind(this);

        this.state = {
            startItem: 0
        };
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
        const { selectedItems, makeLabel } = this.props;
        const className = selectedItems.contains(item.id) ? 'selected' : '';
        return (
            <li key={item.id} className='list-item'>
                <button className={className} data-id={item.id} onClick={this.onClick}>{makeLabel(item)}</button>
            </li>
        );
    }

    onWheel(e) {
        const { items, startItem } = this.state;
        let newStartItem = e.deltaY > 0 ? startItem + 1 : startItem - 1;
        newStartItem = newStartItem < 0 ? 0 : newStartItem;
        this.setState({
            ...this.state,
            startItem: newStartItem
        });
    }

    render() {
        const { items } = this.props;
        const { startItem } = this.state; 
        const listItems = items.slice(startItem, startItem + 12).map(this.renderItem);

        return (
            <ul onWheel={this.onWheel} className="list">
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

ClickableList.defaultProps = {
    makeLabel: item => item.value
};