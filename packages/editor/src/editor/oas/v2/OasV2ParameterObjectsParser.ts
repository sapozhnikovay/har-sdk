import { BaseOasParameterObjectsParser } from '../BaseOasParameterObjectsParser';
import { OpenAPIV2 } from '@har-sdk/types';

export class OasV2ParameterObjectsParser extends BaseOasParameterObjectsParser<
  OpenAPIV2.Document,
  OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter
> {
  constructor(doc: OpenAPIV2.Document, dereferencedDoc: OpenAPIV2.Document) {
    super(doc, dereferencedDoc);
  }

  protected getParameterValue(paramObj: OpenAPIV2.Parameter): string | undefined {
    return paramObj.default ?? paramObj.items?.default;
  }

  protected getValueJsonPointer(paramPointer: string): string {
    return `${paramPointer}/default`;
  }
}
