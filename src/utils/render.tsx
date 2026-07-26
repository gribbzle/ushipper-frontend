import React, { Fragment } from 'react';

export const renderTextWithBreakLines = (text: string) => {
    const textSplittedBy = text.split('<br/>');

    return textSplittedBy.map((line, index) => (
        <Fragment key={index}>
            {line}
            {textSplittedBy.length - 1 !== index && <br />}
        </Fragment>
    ));
};
