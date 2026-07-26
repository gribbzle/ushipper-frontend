import { isFreightX } from '@utils';

import * as freightXLogos from './freightx';
import * as uShipperLogos from './ushipper';

const logos = isFreightX ? freightXLogos : uShipperLogos;

export default logos;
