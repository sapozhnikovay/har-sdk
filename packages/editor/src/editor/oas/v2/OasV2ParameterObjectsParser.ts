import {
  ParamLocation,
  SpecTreeRequestBodyParam,
  SpecTreeNodeParam
} from '../../../models';
import { BaseOasParameterObjectsParser } from '../BaseOasParameterObjectsParser';
import jsonPointer from 'json-pointer';
import { OpenAPIV2 } from '@har-sdk/types';

export class OasV2ParameterObjectsParser extends BaseOasParameterObjectsParser<
  OpenAPIV2.Document,
  OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter
> {
  constructor(doc: OpenAPIV2.Document, dereferencedDoc: OpenAPIV2.Document) {
    super(doc, dereferencedDoc);
  }

  public parse(pointer: string): SpecTreeNodeParam[] {
    const parameters: (OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject)[] =
      jsonPointer.has(this.doc, pointer)
        ? jsonPointer.get(this.doc, pointer)
        : undefined;

    return (
      parameters?.flatMap(
        (
          parameter: OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject,
          idx: number
        ): SpecTreeNodeParam[] => {
          const parameterPointer = `${pointer}/${idx}`;

          const paramObj = this.getParameterObject(
            parameterPointer,
            parameter
          ) as OpenAPIV2.Parameter;

          return paramObj.in === 'body'
            ? this.parseBodyParameter(parameterPointer, paramObj)
            : [this.parseParameter(parameterPointer, paramObj)];
        }
      ) ?? []
    );
  }

  protected getParameterValue(
    paramObj: OpenAPIV2.Parameter
  ): string | undefined {
    return paramObj.default ?? paramObj.items?.default;
  }

  protected getValueJsonPointer(paramPointer: string): string {
    return `${paramPointer}/default`;
  }

  protected parseParameter(
    pointer: string,
    paramObj: OpenAPIV2.Parameter
  ): SpecTreeNodeParam {
    return super.parseParameter(pointer, {
      ...paramObj,
      in:
        paramObj.in === 'formData'
          ? ParamLocation.BODY
          : (paramObj.in as ParamLocation)
    });
  }

  private parseBodyParameter(
    pointer: string,
    parameter: OpenAPIV2.Parameter
  ): SpecTreeRequestBodyParam[] {
    const operationObject: OpenAPIV2.OperationObject = jsonPointer.get(
      this.doc,
      jsonPointer.compile(jsonPointer.parse(pointer).slice(0, -2))
    );
    const mimeTypes = operationObject.consumes || ['application/json'];
    const value = parameter.schema?.default;

    return mimeTypes.map((mimeType) => ({
      paramType: 'requestBody',
      bodyType: mimeType,
      ...(value != null ? { value } : {}),
      valueJsonPointer: this.getValueJsonPointer(`${pointer}/schema`)
    }));
  }
}
