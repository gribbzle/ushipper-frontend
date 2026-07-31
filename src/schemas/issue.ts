import Joi from 'joi';

import { ChangesInfoDetails, IssueChangedByData } from '../store/api/issues-api';
import { requiredStringValidator } from '../validators/jois';

export const changesInfoDetailsSchema = Joi.object<ChangesInfoDetails>({
    changedBy: Joi.object<IssueChangedByData>({
        id: requiredStringValidator,
        name: requiredStringValidator,
    }).required(),
}).unknown(true);
