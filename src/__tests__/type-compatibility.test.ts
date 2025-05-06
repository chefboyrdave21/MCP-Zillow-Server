import { expectType } from 'tsd';
import { z } from 'zod';
import { propertyDetailsParamsSchema } from '../validation/propertyDetailsParamsSchema';
import type { PropertyDetailsParams } from '../models/propertyDetails';

type SchemaType = z.infer<typeof propertyDetailsParamsSchema>;
declare const params: SchemaType;
declare function acceptParams(p: PropertyDetailsParams): void;

// This should not error if types are compatible
acceptParams(params);
