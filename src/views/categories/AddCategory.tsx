import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

export default class AddCategory extends React.PureComponent<RouterProps, {name: string}> {
    
    render () {
        return <CategoryForm {...this.props} closeAfterSave/>;
    }
}