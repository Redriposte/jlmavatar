import React from 'react';

import preview from '../assets/img/preview.png';


const Preview = ({image}) => {
    return (
        <div className='preview-card mb-3'>
            <img src={preview} alt="preview" />
            <section>
                <span>JLMelenchon - @JLMelenchon</span>
                <span>Faites confiance à une tortue électorale, sagace.</span>
            </section>
        </div>
     );
}

export default Preview;