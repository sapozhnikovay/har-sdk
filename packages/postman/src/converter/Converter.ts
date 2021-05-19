import { Postman } from '../postman';
import HarV1 from 'har-format';

export interface Converter {
  convert(collection: Postman.Collection): Promise<HarV1.Request[]>;
}
