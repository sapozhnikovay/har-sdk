import { BaseOasParameterObjectsParser } from '../BaseOasParameterObjectsParser';
import { OpenAPIV3 } from '@har-sdk/types';

export class OasV3ParameterObjectsParser extends BaseOasParameterObjectsParser<
  OpenAPIV3.Document,
  OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
> {
  constructor(doc: OpenAPIV3.Document, dereferencedDoc: OpenAPIV3.Document) {
    super(doc, dereferencedDoc);
  }

  protected getParameterValue(
    paramObj: OpenAPIV3.ParameterObject
  ): string | undefined {
    return (
      paramObj.example ?? (paramObj.schema as OpenAPIV3.SchemaObject).default
    );
  }

  protected getValueJsonPointer(
    _paramObj: OpenAPIV3.ParameterObject,
    paramPointer: string
  ): string {
    return `${paramPointer}/example`;
  }
}
