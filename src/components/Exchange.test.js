import React from 'react';
import { create } from 'react-test-renderer';
import Exchange from './Exchange';

describe('Real-time exchange component', () => {
    test('it shows the expected text on render', () => {
        const component = create(<Exchange exchange={{ rate: 1.0, from: 'PLN', to: 'EUR' }} loading={false} />);
        const rootInstance = component.root;
        const divs = rootInstance.findByType(Exchange).findAllByType('div');
        const button = divs[2].findByType('button');
        expect(divs[1].children).toStrictEqual(['1.0000']);
        expect(divs[2].children).toStrictEqual(['PLN', button, 'EUR']);
    });
});