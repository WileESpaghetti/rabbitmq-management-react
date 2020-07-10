import React from 'react';
import renderer from 'react-test-renderer';
import LoginForm from "../LoginForm";

let wrapper;

describe('<LoginForm />', () => {

    it('renders correctly', () => {
        const tree = renderer
            .create(<LoginForm/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

})



